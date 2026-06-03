import fs from "node:fs";
import path from "node:path";
import { isCancel, text, select, groupMultiselect, log, confirm } from "@clack/prompts";
import spawn from "cross-spawn";
import {
  cancel,
  copy,
  emptyDir,
  formatTargetDir,
  getFullCustomCommand,
  install,
  start,
  isEmpty,
  isValidPackageName,
  toValidPackageName,
  end,
  generateLefthookConfig,
  getRunCommand,
} from "./util";
import {
  cwd,
  pkgInfo,
  renameFiles,
  ToolName,
  ArchitectureName,
  getTemplateScripts,
  getTemplateDevDeps,
  getTemplatePkgManager,
  getTemplateConfigs,
  hasInvalidToolNames,
  OtherToolName,
  hasInvalidBuildToolName,
  AllBuildToolName,
  getTemplateTools,
  getTemplateBuildTools,
  getArchTemplateNames,
  getTemplateAllToolNames,
  TemplateDirBaseName,
  getGroupToolOptions,
  getBuildToolOptions,
  getArchitectureOptions,
  getArchitecture,
  getTemplatesByArch,
  getTemplateVariant,
  TARGET_BASENAME_STRING,
  ownPkgManager,
  PKG_MANAGER_STRING,
} from "./config";
import { fileURLToPath } from "node:url";
import { determineAgent } from "@vercel/detect-agent";
async function mainAction(target: string | undefined, options: any) {
  // command options
  const argTargetDir = target ? formatTargetDir(target) : undefined;
  const argTemplate = options.template;
  const argInteractive = options.interactive;
  const argNoInteractive = options.noInteractive;
  const argOverwrite = options.overwrite;
  const argMonorepo = options.monorepo;
  const argPackage = options.package;
  const argNormal = options.normal;
  const argTools = options.tools;
  const argBuildTool = options.buildTool;
  const argImmediate = options.immediate;
  const argInMonorepo = options.inMonorepo;
  // root options
  const argDefaultTargetDir = options.dirname;
  // interactive mode when not specified and stdin is a terminal and not piped
  const interactive = argNoInteractive === true ? false : (argInteractive ?? process.stdin.isTTY);
  const targetDirNameMessage = "Project name:";

  // Detect AI agent environment for better agent experience (AX)
  const { isAgent } = await determineAgent();
  if (isAgent && interactive) {
    // eslint-disable-next-line no-console
    console.log(
      "\nTips: ARCHITECTURE = monorepo | package | normal\n",
      "\nTo create in one go, run: create-ku --<ARCHITECTURE> <DIRECTORY> --no-interactive --template <TEMPLATE>\n",
    );
  }

  // 1. Project Name
  let targetDir = argTargetDir;
  if (!targetDir) {
    if (interactive) {
      const projectName = (await text({
        message: targetDirNameMessage,
        placeholder: argDefaultTargetDir,
        defaultValue: argDefaultTargetDir,
      })) as string;
      if (isCancel(projectName)) return cancel();
      targetDir = formatTargetDir(projectName);
    } else {
      targetDir = argDefaultTargetDir;
    }
  }
  // 2. targetDir exists?
  if (fs.existsSync(targetDir as string) && !isEmpty(targetDir as string)) {
    let overwrite: "yes" | "ignore" | "no" | undefined = argOverwrite ? "yes" : undefined;
    if (!overwrite) {
      if (interactive) {
        const mode = await select({
          message: "Target directory exists. Pick an action:",
          options: [
            {
              label: "Cancel operation",
              value: "no",
            },
            {
              label: "Remove existing files and continue",
              value: "yes",
            },
            {
              label: "Ignore files and continue",
              value: "ignore",
            },
          ],
        });
        if (isCancel(mode)) return cancel();
        overwrite = mode;
      } else {
        overwrite = "no";
      }
    }
    switch (overwrite) {
      case "yes":
        emptyDir(targetDir as string);
        break;
      case "no":
        return cancel();
    }
  }
  // 3. get package name
  let packageName = path.basename(path.resolve(targetDir as string));
  if (!isValidPackageName(packageName)) {
    if (interactive) {
      const rePackageName = await text({
        message: targetDirNameMessage,
        placeholder: toValidPackageName(packageName),
        defaultValue: toValidPackageName(packageName),
        validate: (name) => {
          if (name && !isValidPackageName(name)) {
            return "Invalid package name";
          }
        },
      });
      if (isCancel(rePackageName)) return cancel();
      packageName = rePackageName;
    } else {
      packageName = toValidPackageName(packageName);
    }
  }
  // 4. Choose A Architecture
  let arch: ArchitectureName | undefined = undefined;
  if (argMonorepo) arch = "monorepo";
  if (argPackage) arch = "package";
  if (argNormal) arch = "normal";
  if (!arch) {
    if (interactive) {
      const reArch = (await select({
        message: "Choose a architecture:",
        options: getArchitectureOptions(),
      })) as ArchitectureName;
      if (isCancel(reArch)) return cancel();
      arch = reArch;
    } else {
      arch = "normal";
    }
  }
  // 4.1 Is in monorepo project?
  let isInMonorepoProject = argInMonorepo;
  const archMap = getArchitecture(arch);
  const hasInMonorepoConfirm = !!archMap.confirm;
  if (hasInMonorepoConfirm && isInMonorepoProject === undefined) {
    if (interactive) {
      const isInMono = await confirm({
        message: archMap.confirm?.message || "Is in a monorepo project?",
      });
      if (isCancel(isInMono)) return cancel();
      isInMonorepoProject = isInMono;
    } else {
      isInMonorepoProject = false;
    }
  }
  // in monorepo project
  const yesInMonorepo = hasInMonorepoConfirm && isInMonorepoProject;

  // 5. Choose A Template
  let template = argTemplate;
  let hasInvalidTemplate = false;
  let templateNames: string[] = getArchTemplateNames(arch);
  if (template && !templateNames.includes(template)) {
    template = undefined;
    hasInvalidTemplate = true;
  }
  if (!template) {
    if (interactive) {
      const currentTemplates = getTemplatesByArch(arch);
      const framework = await select({
        message: hasInvalidTemplate
          ? `"${argTemplate}" isn't a valid template. Please choose from below: `
          : "Choose a framework:",
        options: currentTemplates.map(({ name, display, color }) => {
          return {
            label: color(display),
            value: name,
          };
        }),
      });
      if (isCancel(framework)) return cancel();
      const variants = currentTemplates.find((t) => t.name === framework)?.variants;
      const variant = await select({
        message: "Select a variant:",
        options:
          variants?.map(({ name, display, color, customCommand }) => {
            const command = customCommand
              ? getFullCustomCommand(customCommand, pkgInfo)
              : undefined;
            return {
              label: color(display),
              value: name,
              hint: command,
            };
          }) || [],
      });
      if (isCancel(variant)) return cancel();
      template = variant;
    } else {
      template = "vanilla-ts";
    }
  }
  const templateDirBaseName: TemplateDirBaseName = `template-${arch}-${template}`;

  const toolOptions = getTemplateTools(templateDirBaseName);
  const buildToolOptions = getTemplateBuildTools(templateDirBaseName);
  const preTools = typeof argTools === "string" ? [argTools] : argTools;

  // 6.Choose a build tool
  let buildTool: AllBuildToolName | undefined = argBuildTool;
  if (buildToolOptions) {
    let hasInvalidBuildTool = hasInvalidBuildToolName(
      templateDirBaseName,
      buildTool as AllBuildToolName,
    );
    if (hasInvalidBuildTool) {
      buildTool = undefined;
    }
    if (!buildTool) {
      if (interactive) {
        const reBuildTool = (await select({
          message: hasInvalidBuildTool
            ? `"${argBuildTool}" isn't a valid build tool. Please choose from below: `
            : "Choose a build tool",
          options: getBuildToolOptions(buildToolOptions),
        })) as AllBuildToolName;
        if (isCancel(reBuildTool)) return cancel();
        buildTool = reBuildTool;
      }
    }
  }

  // 6.1 Choose tools
  let tools: OtherToolName[] | undefined = preTools;
  if (toolOptions && !yesInMonorepo) {
    const hasInvalidTools = hasInvalidToolNames(templateDirBaseName, tools as OtherToolName[]);
    if (hasInvalidTools) {
      tools = undefined;
    }
    if (!tools) {
      if (interactive) {
        if (!Array.isArray(toolOptions)) {
          const groupToolOptions = getGroupToolOptions(toolOptions);
          const reTools = (await groupMultiselect({
            message: hasInvalidTools
              ? `"${argTools}" isn't a valid tool. Please choose from below: `
              : "Choose tools:",
            options: groupToolOptions,
            required: false,
          })) as OtherToolName[];
          if (isCancel(reTools)) return cancel();
          tools = reTools;
        }
      }
    }
  }

  let allTools: ToolName[] = [];
  if (buildTool) {
    allTools.push(buildTool);
  }
  if (tools) {
    allTools.push(...tools);
  }

  const templateDir = path.join(fileURLToPath(import.meta.url), "../..", templateDirBaseName);

  const pkgManager = yesInMonorepo
    ? "pnpm"
    : (getTemplatePkgManager(templateDirBaseName) ?? ownPkgManager);

  const rootDir = path.join(cwd, targetDir ?? "");

  const { customCommand } = getTemplateVariant(arch, template) ?? {};
  if (customCommand) {
    (pkgInfo as any).name = pkgManager;
    const fullCustomCommand = getFullCustomCommand(customCommand, pkgInfo);

    const [command, ...args] = fullCustomCommand.split(" ");
    const replaceArgs = args.map((arg) => {
      if (arg.includes(TARGET_BASENAME_STRING)) {
        return arg.replace(TARGET_BASENAME_STRING, () => path.basename(targetDir as string));
      }
      return arg;
    });

    const { status } = spawn.sync(command, replaceArgs, {
      cwd: path.join(rootDir, ".."),
      stdio: "inherit",
    });
    process.exit(status ?? 0);
  }

  fs.mkdirSync(rootDir, { recursive: true });
  log.step(`Scaffolding project in ${rootDir}...`);

  let immediate = argImmediate;
  if (!immediate) {
    if (interactive) {
      const immediateResult = await confirm({
        message: `Install with ${pkgManager} and start now?`,
      });
      if (isCancel(immediateResult)) return cancel();
      immediate = immediateResult;
    } else {
      immediate = false;
    }
  }

  function write(file: string, content?: string) {
    const targetPath = path.join(rootDir, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else if (file === "index.html") {
      const templatePath = path.join(templateDir, file);
      const templateContent = fs.readFileSync(templatePath, "utf-8");
      const updateContent = templateContent.replace(
        /<title>.*<\/title>/,
        `<title>${packageName}</title>`,
      );
      fs.writeFileSync(targetPath, updateContent);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  }
  let files = fs.readdirSync(templateDir);
  function filterFiles(toolNames: ToolName[]) {
    const commonFiles = files.filter((file) => {
      // in monorepo, we don't need to generate .gitignore or .vscode
      if (yesInMonorepo && (file.includes("gitignore") || file.includes("vscode"))) return false;
      return !toolNames?.some((name) => file.includes(name));
    });
    const toolFiles = files.filter((file) => {
      return allTools.some((name) => file.includes(name));
    });
    return [...commonFiles, ...toolFiles];
  }
  if (allTools) {
    files = filterFiles(getTemplateAllToolNames(templateDirBaseName));
  }

  // lefthook.yaml
  const configs = getTemplateConfigs(templateDirBaseName);
  if (configs && !yesInMonorepo) {
    const configKeys = Object.keys(configs);
    configKeys.forEach((key) => {
      const hasKey = tools?.includes(key as OtherToolName);
      if (hasKey && key === "lefthook") {
        const otherTools = tools?.filter((t) => t !== "lefthook");
        const index = files.findIndex((file) => file.includes("lefthook"));
        const lefthookFile = files.splice(index, 1)[0];
        configs.lefthook["pre-commit"].jobs = configs.lefthook["pre-commit"].jobs.filter(
          (j: any) => {
            return otherTools?.includes(j.name);
          },
        );
        const content = generateLefthookConfig(configs.lefthook).replace(
          new RegExp(PKG_MANAGER_STRING, "g"),
          getRunCommand(pkgManager, "").join(" ").trim(),
        );
        write(lefthookFile, content);
      }
    });
  }
  for (const file of files.filter((file) => file !== "package.json")) {
    write(file);
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, "package.json"), "utf-8"));
  pkg.name = packageName;

  allTools?.forEach((t) => {
    const devDeps = getTemplateDevDeps(templateDirBaseName)?.[t];
    const scripts = getTemplateScripts(templateDirBaseName)?.[t];
    pkg.devDependencies = {
      ...pkg.devDependencies,
      ...devDeps,
    };
    pkg.scripts = {
      ...pkg.scripts,
      ...scripts,
    };
    if (pkg.scripts.hasOwnProperty("prepublishOnly")) {
      pkg.scripts.prepublishOnly = getRunCommand(pkgManager, "build").join(" ");
    }
  });

  if (template.includes("ts") && yesInMonorepo) {
    delete pkg.devDependencies?.typescript;
  }

  write("package.json", JSON.stringify(pkg, null, 2) + "\n");

  if (immediate) {
    install(rootDir, pkgManager);
    start(rootDir, pkgManager);
  } else {
    end(cwd, rootDir, pkgManager);
  }
}
export { mainAction };
