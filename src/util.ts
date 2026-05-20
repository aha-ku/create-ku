import { cancel as cancelP, log, outro } from "@clack/prompts";
import fs from "node:fs";
import path from "node:path";
import util from "node:util";
import type { InspectColor } from "node:util";
import spawn from "cross-spawn";
import type { SpawnOptions } from "node:child_process";
import { fileURLToPath } from "node:url";

type ColorName = InspectColor;
export type ColorFunc = (text: string) => string;
function createColors() {
  return new Proxy({} as Record<ColorName, ColorFunc>, {
    get(_, prop: ColorName) {
      return (text: string) => util.styleText(prop, text);
    },
  });
}
const {
  red,
  redBright,
  blue,
  blueBright,
  green,
  greenBright,
  yellow,
  yellowBright,
  magenta,
  magentaBright,
  cyan,
  cyanBright,
  white,
  whiteBright,
  gray,
  black,
  bgRed,
  bgRedBright,
  bgBlue,
  bgBlueBright,
} = createColors();
export {
  red,
  redBright,
  blue,
  blueBright,
  green,
  greenBright,
  yellow,
  yellowBright,
  magenta,
  magentaBright,
  cyan,
  cyanBright,
  white,
  whiteBright,
  gray,
  black,
  bgRed,
  bgRedBright,
  bgBlue,
  bgBlueBright,
};

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (let file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}
function isEmpty(dir: string) {
  const files = fs.readdirSync(dir);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}
function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (let file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}
type PkgInfo = {
  name?: string;
  version?: string;
};
function pkgFromUserAgent(agent?: string): PkgInfo | undefined {
  if (!agent) {
    return undefined;
  }
  const pkgSpec = agent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}
function isYarn(pkgInfo: PkgInfo | undefined) {
  return pkgInfo?.name === "yarn" && pkgInfo?.version?.startsWith("1.");
}
function formatTargetDir(targetDir: string) {
  return targetDir
    .trim()
    .replace(/[<>:"\\?*]/g, "")
    .replace(/\/+$/g, "");
}
function cancel() {
  return cancelP("Operation cancelled");
}
function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
}
function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}
function getFullCustomCommand(customCommand: string, pkgInfo?: PkgInfo) {
  const pkgManager = pkgInfo ? pkgInfo.name : "npm";
  const isYarn1 = isYarn(pkgInfo);

  return (
    customCommand
      .replace(/^npm create (?:-- )?/, () => {
        // `bun create` uses its own set of templates,
        // the closest alternative is using `bun x` directly on the package
        if (pkgManager === "bun") {
          return "bun x create-";
        }
        // Deno uses `run -A npm:create-` instead of `create` or `init` to also provide needed perms
        if (pkgManager === "deno") {
          return "deno run -A npm:create-";
        }
        // pnpm doesn't support the -- syntax
        if (pkgManager === "pnpm") {
          return "pnpm create ";
        }
        // For other package managers, preserve the original format
        return customCommand.startsWith("npm create -- ")
          ? `${pkgManager} create -- `
          : `${pkgManager} create `;
      })
      // Only Yarn 1.x doesn't support `@version` in the `create` command
      .replace("@latest", () => (isYarn1 ? "" : "@latest"))
      .replace(/^npm exec (?:-- )?/, () => {
        // Prefer `pnpm dlx`, `yarn dlx`, or `bun x`
        if (pkgManager === "pnpm") {
          // pnpm doesn't support the -- syntax
          return "pnpm dlx ";
        }
        if (pkgManager === "yarn" && !isYarn1) {
          return "yarn dlx ";
        }
        if (pkgManager === "bun") {
          return "bun x ";
        }
        if (pkgManager === "deno") {
          return "deno run -A npm:";
        }
        // Use `npm exec` in all other cases,
        // including Yarn 1.x and other custom npm clients.
        return customCommand.startsWith("npm exec -- ") ? "npm exec -- " : "npm exec ";
      })
  );
}
function getInstallCommand(agent: string) {
  if (agent === "yarn") return ["yarn"];
  return [agent, "install"];
}
function getRunCommand(agent: string, script: string) {
  switch (agent) {
    case "yarn":
    case "pnpm":
    case "bun":
      return [agent, script];
    case "deno":
      return [agent, "task", script];
    default:
      return [agent, "run", script];
  }
}
function run([command, ...args]: string[], options?: SpawnOptions) {
  const { status, error } = spawn.sync(command, args, options);
  if (status !== null && status > 0) {
    process.exit(status);
  }
  if (error) {
    // eslint-disable-next-line no-console
    console.log(`\n${command} ${args.join(" ")} error!`);
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  }
}
function install(root: string, agent: string) {
  log.step(`Installing dependencies with ${agent}...`);
  run(getInstallCommand(agent), {
    cwd: root,
    stdio: "inherit",
  });
}
function start(root: string, agent: string) {
  log.step("Starting dev server...");
  run(getRunCommand(agent, "dev"), { cwd: root, stdio: "inherit" });
}
function end(cwd: string, root: string, agent: string) {
  const relativeDir = path.relative(cwd, root);
  let message = "";
  // message += "Done. run:\n";
  outro("Done. run:");
  if (root !== cwd) {
    message += `   cd ${relativeDir.includes(" ") ? `"${relativeDir}"` : relativeDir}`;
  }
  message += `\n   ${getInstallCommand(agent).join(" ")}`;
  message += `\n   ${getRunCommand(agent, "dev").join(" ")}`;
  // eslint-disable-next-line no-console
  console.log(greenBright(message));
}

function generateLefthookConfig(obj) {
  function serialize(value, indentLevel = 0, isArrayItem = false) {
    const indent = "  ".repeat(indentLevel);
    if (value === null || value === undefined) return "";
    if (typeof value === "string") {
      // 如果字符串包含特殊字符，加单引号
      if (/[:\-{}[\]*&%#]/.test(value)) return `'${value}'`;
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) {
      const items = value
        .map((item) => {
          const serializedItem = serialize(item, indentLevel + 1, true).trim();
          return `\n${indent}- ${serializedItem}`;
        })
        .join("");
      return items;
    }
    if (typeof value === "object") {
      const lines = [];
      for (const [key, val] of Object.entries(value)) {
        const serializedVal = serialize(val, indentLevel + 1);
        if (serializedVal === "") continue;
        if (typeof val === "object" && !Array.isArray(val)) {
          lines.push(`${indent}${key}:${serializedVal}`);
        } else if (Array.isArray(val)) {
          lines.push(`${indent}${key}:${serializedVal}`);
        } else {
          lines.push(`${indent}${key}: ${serializedVal}`);
        }
      }
      // 如果是数组项，返回不带前导换行的内容；否则添加换行
      return isArrayItem ? lines.join("\n") : `\n${lines.join("\n")}`;
    }
    return "";
  }

  const result = serialize(obj).trim();
  // 确保第一行没有多余换行
  return result.startsWith("\n") ? result.slice(1) : result;
}

function getVersion() {
  const filePath = path.join(fileURLToPath(import.meta.url), "../../package.json");
  const pkgContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(pkgContent).version;
}
export {
  copy,
  isEmpty,
  emptyDir,
  pkgFromUserAgent,
  isYarn,
  formatTargetDir,
  cancel,
  isValidPackageName,
  toValidPackageName,
  getFullCustomCommand,
  getRunCommand,
  install,
  start,
  end,
  generateLefthookConfig,
  getVersion,
};
