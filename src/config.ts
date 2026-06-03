import { pkgFromUserAgent, ColorFunc, green, getVersion } from "./util";
import type { Option } from "@clack/prompts";
export type BuildTasksToolName = "turbo" | "nx";
type BuildTasksToolDisplay = "Turbo" | "Nx";
export type BuildToolName = "tsup" | "tsdown" | "rollup" | "rolldown" | "vite";
export type BuildToolDisplay = "Tsup" | "Tsdown" | "Rollup" | "Rolldown" | "Vite";
export type OtherToolName = "oxfmt" | "oxlint" | "lefthook" | "cspell" | "changesets" | "bumpp";
type OtherToolDisplay = "Oxfmt" | "Oxlint" | "Lefthook" | "Cspell" | "Changesets" | "Bumpp";

export type AllBuildToolName = BuildToolName | BuildTasksToolName;

export type ToolName = AllBuildToolName | OtherToolName;

export type ArchitectureName = "monorepo" | "package" | "normal" | "layout";
type ArchitectureDisplay = "Monorepo" | "Package" | "Normal" | "Layout";
type ArchitectureConfirm = {
  message: string;
};
export type TemplateDirBaseName = `template-${ArchitectureName}-${string}`;
type ToolNameMapping = {
  [key in ToolName]?: any;
};
type TemplateDirBaseNameConfig = {
  pkgManager?: string;
  devDeps?: ToolNameMapping;
  scripts?: ToolNameMapping;
  configs?: ToolNameMapping;
  buildTools?: BuildTool[];
  tools?: Tool[] | { [key: string]: Tool[] };
};
type Config = {
  [key: TemplateDirBaseName]: TemplateDirBaseNameConfig;
} & {
  [key in ArchitectureName]?: {
    templateNames: string[];
  };
};
type Architecture = {
  name: ArchitectureName;
  display: ArchitectureDisplay;
  color: ColorFunc;
  confirm?: ArchitectureConfirm;
  templates: Template[];
};
type Template = {
  name: string;
  display: string;
  color: ColorFunc;
  variants: TemplateVariant[];
};
type TemplateVariant = {
  name: string;
  display: string;
  color: ColorFunc;
  link?: string;
  customCommand?: string;
};
type Tool = {
  name: OtherToolName;
  display: OtherToolDisplay;
  color: ColorFunc;
};
type BuildTool = {
  name: BuildToolName | BuildTasksToolName;
  display: BuildToolDisplay | BuildTasksToolDisplay;
  color: ColorFunc;
};
export const TARGET_BASENAME_STRING = "TARGET_BASENAME";
const ARCHITECTURES: Architecture[] = [
  {
    name: "monorepo",
    display: "Monorepo",
    color: green,
    templates: [
      {
        name: "vanilla",
        display: "Vanilla",
        color: green,
        variants: [
          {
            name: "vanilla-ts",
            display: "Typescript",
            color: green,
          },
          {
            name: "vanilla",
            display: "JavaScript",
            color: green,
          },
        ],
      },
    ],
  },
  {
    name: "package",
    display: "Package",
    color: green,
    confirm: {
      message: "In Monorepo ?",
    },
    templates: [
      {
        name: "vanilla",
        display: "Vanilla",
        color: green,
        variants: [
          {
            name: "vanilla-ts",
            display: "Typescript",
            color: green,
          },
          {
            name: "vanilla",
            display: "Javascript",
            color: green,
          },
        ],
      },
      {
        name: "vue",
        display: "Vue",
        color: green,
        variants: [
          {
            name: "vue-ts",
            display: "Typescript",
            color: green,
          },
          {
            name: "vue",
            display: "JavaScript",
            color: green,
          },
        ],
      },
      {
        name: "react",
        display: "React",
        color: green,
        variants: [
          {
            name: "react-ts",
            display: "Typescript",
            color: green,
          },
          {
            name: "react",
            display: "JavaScript",
            color: green,
          },
        ],
      },
    ],
  },
  {
    name: "normal",
    display: "Normal",
    color: green,
    confirm: {
      message: "In Monorepo ?",
    },
    templates: [
      {
        name: "vanilla",
        display: "Vanilla",
        color: green,
        variants: [
          {
            name: "vanilla-ts",
            display: "Typescript",
            color: green,
          },
          {
            name: "vanilla",
            display: "JavaScript",
            color: green,
          },
        ],
      },
      {
        name: "vue",
        display: "Vue",
        color: green,
        variants: [
          {
            name: "vue-ts",
            display: "Typescript",
            color: green,
          },
          {
            name: "vue",
            display: "JavaScript",
            color: green,
          },
        ],
      },
      {
        name: "react",
        display: "React",
        color: green,
        variants: [
          {
            name: "react-ts",
            display: "Typescript",
            color: green,
          },
          {
            name: "react",
            display: "JavaScript",
            color: green,
          },
        ],
      },
      {
        name: "express",
        display: "Express",
        color: green,
        variants: [
          {
            name: "express-ts",
            display: "Typescript",
            color: green,
          },
          {
            name: "express",
            display: "JavaScript",
            color: green,
          },
        ],
      },
    ],
  },
];
export const getArchitecture = (arch: ArchitectureName): Architecture => {
  return ARCHITECTURES.find(({ name }) => name === arch) as Architecture;
};
export const getTemplatesByArch = (arch: ArchitectureName): Template[] => {
  return getArchitecture(arch).templates;
};
export const getArchTemplateNames = (arch: ArchitectureName): string[] => {
  return getTemplatesByArch(arch)
    .flatMap((t) => t.variants)
    .map((v) => v.name);
};
export const getTemplateVariant = (arch: ArchitectureName, template: string): TemplateVariant => {
  return getTemplatesByArch(arch)
    .flatMap((t) => t.variants)
    .find((t) => t.name === template) as TemplateVariant;
};
export const VERSION = getVersion();
export const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
export const ownPkgManager = (pkgInfo ? pkgInfo.name : "npm") as string;
export const PKG_MANAGER_STRING = "PKG_MANAGER";
export const DEFAULT_TARGET_DIR = "ku-project";
export const cwd = process.cwd();
export const renameFiles: Record<string, string> = { _gitignore: ".gitignore" };
const config: Config = {
  "template-monorepo-vanilla": {
    pkgManager: "pnpm",
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      changesets: {
        "@changesets/cli": "^2.31.0",
      },
      turbo: {
        turbo: "^2.9.7",
      },
      nx: {
        nx: "22.7.2",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      turbo: {
        build: "turbo run build",
        dev: "turbo run dev",
      },
      nx: {
        build: "nx run-many -t build",
        dev: "nx run-many -t dev",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      changesets: {
        change: "pnpm changeset",
        "change:v": "pnpm changeset version",
        "ci:publish": "pnpm publish -r ",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      { name: "turbo", display: "Turbo", color: green },
      { name: "nx", display: "Nx", color: green },
    ],
    tools: {
      "All Tools": [
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "changesets",
          display: "Changesets",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-monorepo-vanilla-ts": {
    pkgManager: "pnpm",
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      changesets: {
        "@changesets/cli": "^2.31.0",
      },
      turbo: {
        turbo: "^2.9.7",
      },
      nx: {
        nx: "22.7.2",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      turbo: {
        build: "turbo run build",
        dev: "turbo run dev",
      },
      nx: {
        build: "nx run-many -t build",
        dev: "nx run-many -t dev",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      changesets: {
        change: "pnpm changeset",
        "change:v": "pnpm changeset version",
        "ci:publish": "pnpm publish -r ",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "turbo",
        display: "Turbo",
        color: green,
      },
      { name: "nx", display: "Nx", color: green },
    ],
    tools: {
      "All Tools": [
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "changesets",
          display: "Changesets",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-package-vanilla": {
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      tsdown: {
        tsdown: "^0.22.0",
      },
      tsup: {
        tsup: "^8.5.1",
      },
      rolldown: {
        rolldown: "^1.0.1",
      },
      bumpp: {
        bumpp: "^11.1.0",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      tsdown: {
        build: "tsdown",
        dev: "tsdown --watch",
      },
      tsup: {
        build: "tsup",
        dev: "tsup --watch",
      },
      rolldown: {
        build: "rolldown -c",
        dev: "rolldown -c --watch",
      },
      bumpp: {
        release: "bumpp",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "tsdown",
        display: "Tsdown",
        color: green,
      },
      {
        name: "tsup",
        display: "Tsup",
        color: green,
      },
      {
        name: "rolldown",
        display: "Rolldown",
        color: green,
      },
    ],
    tools: {
      "All Tools": [
        {
          name: "bumpp",
          display: "Bumpp",
          color: green,
        },
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-package-vanilla-ts": {
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      changesets: {
        "@changesets/cli": "^2.31.0",
      },
      tsdown: {
        tsdown: "^0.22.0",
      },
      tsup: {
        tsup: "^8.5.1",
      },
      rolldown: {
        rolldown: "^1.0.1",
        "rolldown-plugin-dts": "^0.25.1",
      },
      bumpp: {
        bumpp: "^11.1.0",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      tsdown: {
        build: "tsdown",
        dev: "tsdown --watch",
      },
      tsup: {
        build: "tsup",
        dev: "tsup --watch",
      },
      rolldown: {
        build: "rolldown -c",
        dev: "rolldown -c --watch",
      },
      bumpp: {
        release: "bumpp",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "tsdown",
        display: "Tsdown",
        color: green,
      },
      {
        name: "tsup",
        display: "Tsup",
        color: green,
      },
      {
        name: "rolldown",
        display: "Rolldown",
        color: green,
      },
    ],
    tools: {
      "All Tools": [
        {
          name: "bumpp",
          display: "Bumpp",
          color: green,
        },
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-package-vue": {
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      tsdown: {
        tsdown: "^0.22.0",
        "@tsdown/css": "^0.22.0",
        "unplugin-vue": "^7.2.0",
        "vue-tsc": "^3.2.8",
      },
      rolldown: {
        rolldown: "^1.0.1",
      },
      bumpp: {
        bumpp: "^11.1.0",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      tsdown: {
        build: "tsdown",
        dev: "tsdown --watch",
        prepublishOnly: "",
      },
      rolldown: {
        build: "rolldown -c",
        dev: "rolldown -c --watch",
        prepublishOnly: "",
      },
      bumpp: {
        release: "bumpp",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "tsdown",
        display: "Tsdown",
        color: green,
      },
    ],
    tools: {
      "All Tools": [
        {
          name: "bumpp",
          display: "Bumpp",
          color: green,
        },
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-package-vue-ts": {
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      tsdown: {
        tsdown: "^0.22.0",
        "@tsdown/css": "^0.22.0",
        "unplugin-vue": "^7.2.0",
        "vue-tsc": "^3.2.8",
      },
      rolldown: {
        rolldown: "^1.0.1",
        "rolldown-plugin-dts": "^0.25.1",
      },
      bumpp: {
        bumpp: "^11.1.0",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      tsdown: {
        build: "tsdown",
        dev: "tsdown --watch",
        prepublishOnly: "",
      },
      rolldown: {
        build: "rolldown -c",
        dev: "rolldown -c --watch",
        prepublishOnly: "",
      },
      bumpp: {
        release: "bumpp",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "tsdown",
        display: "Tsdown",
        color: green,
      },
    ],
    tools: {
      "All Tools": [
        {
          name: "bumpp",
          display: "Bumpp",
          color: green,
        },
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-package-react": {
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      tsdown: {
        tsdown: "^0.22.0",
        "@tsdown/css": "^0.22.0",
      },
      bumpp: {
        bumpp: "^11.1.0",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      tsdown: {
        build: "tsdown",
        dev: "tsdown --watch",
        prepublishOnly: "",
      },
      bumpp: {
        release: "bumpp",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{js,jsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "tsdown",
        display: "Tsdown",
        color: green,
      },
    ],
    tools: {
      "All Tools": [
        {
          name: "bumpp",
          display: "Bumpp",
          color: green,
        },
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-package-react-ts": {
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      tsdown: {
        tsdown: "^0.22.0",
        "@tsdown/css": "^0.22.0",
      },
      bumpp: {
        bumpp: "^11.1.0",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      tsdown: {
        build: "tsdown",
        dev: "tsdown --watch",
        prepublishOnly: "",
      },
      bumpp: {
        release: "bumpp",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "tsdown",
        display: "Tsdown",
        color: green,
      },
    ],
    tools: {
      "All Tools": [
        {
          name: "bumpp",
          display: "Bumpp",
          color: green,
        },
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-normal-express": {
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      tsdown: {
        tsdown: "^0.22.0",
      },
      bumpp: {
        bumpp: "^11.1.0",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      tsdown: {
        build: "tsdown",
      },
      bumpp: {
        release: "bumpp",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "tsdown",
        display: "Tsdown",
        color: green,
      },
    ],
    tools: {
      "All Tools": [
        {
          name: "bumpp",
          display: "Bumpp",
          color: green,
        },
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
  "template-normal-express-ts": {
    devDeps: {
      cspell: {
        cspell: "^9.8.0",
        "@cspell/dict-lorem-ipsum": "^4.0.5",
      },
      oxfmt: {
        oxfmt: "^0.46.0",
      },
      oxlint: {
        oxlint: "^1.61.0",
      },
      lefthook: {
        lefthook: "^2.1.6",
      },
      tsdown: {
        tsdown: "^0.22.0",
      },
      bumpp: {
        bumpp: "^11.1.0",
      },
    },
    scripts: {
      cspell: {
        "lint:cspell": "cspell .",
      },
      oxfmt: {
        "lint:fmt": "oxfmt",
      },
      oxlint: {
        lint: "oxlint",
      },
      lefthook: {
        prepare: "lefthook install",
      },
      tsdown: {
        build: "tsdown",
      },
      bumpp: {
        release: "bumpp",
      },
    },
    configs: {
      lefthook: {
        "pre-commit": {
          parallel: true,
          jobs: [
            {
              name: "oxfmt",
              run: `${PKG_MANAGER_STRING} lint:fmt {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "oxlint",
              run: `${PKG_MANAGER_STRING} lint {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
            {
              name: "cspell",
              run: `${PKG_MANAGER_STRING} lint:cspell {staged_files}`,
              glob: "*.{ts,tsx,json}",
            },
          ],
        },
      },
    },
    buildTools: [
      {
        name: "tsdown",
        display: "Tsdown",
        color: green,
      },
    ],
    tools: {
      "All Tools": [
        {
          name: "bumpp",
          display: "Bumpp",
          color: green,
        },
        {
          name: "oxfmt",
          display: "Oxfmt",
          color: green,
        },
        {
          name: "oxlint",
          display: "Oxlint",
          color: green,
        },
        {
          name: "lefthook",
          display: "Lefthook",
          color: green,
        },
        {
          name: "cspell",
          display: "Cspell",
          color: green,
        },
      ],
    },
  },
};

export const getTemplateDevDeps: (
  templateName: TemplateDirBaseName,
) => TemplateDirBaseNameConfig["devDeps"] = (templateName: TemplateDirBaseName) => {
  return config[templateName]?.devDeps;
};
export const getTemplateScripts: (
  templateName: TemplateDirBaseName,
) => TemplateDirBaseNameConfig["scripts"] = (templateName: TemplateDirBaseName) => {
  return config[templateName]?.scripts;
};
export const getTemplatePkgManager: (
  templateName: TemplateDirBaseName,
) => TemplateDirBaseNameConfig["pkgManager"] = (templateName: TemplateDirBaseName) => {
  return config[templateName]?.pkgManager;
};
export const getTemplateConfigs: (
  templateName: TemplateDirBaseName,
) => TemplateDirBaseNameConfig["configs"] = (templateName: TemplateDirBaseName) => {
  return config[templateName]?.configs;
};
export const getTemplateBuildTools: (
  templateName: TemplateDirBaseName,
) => TemplateDirBaseNameConfig["buildTools"] = (templateName: TemplateDirBaseName) => {
  return config[templateName]?.buildTools;
};
export const getTemplateBuildToolNames = (templateName: TemplateDirBaseName) => {
  const buildTools = getTemplateBuildTools(templateName);
  return buildTools?.map((buildTool) => buildTool.name) ?? [];
};
export const getTemplateTools: (
  templateName: TemplateDirBaseName,
) => TemplateDirBaseNameConfig["tools"] = (templateName: TemplateDirBaseName) => {
  return config[templateName]?.tools;
};
export const getTemplateToolNames = (templateName: TemplateDirBaseName) => {
  let tools = getTemplateTools(templateName);
  let toolNames: ToolName[] = [];
  if (tools) {
    if (Array.isArray(tools)) toolNames = tools.map((tool) => tool.name);
    else
      toolNames = Object.values(tools)
        .flat()
        .map((tool) => tool.name);
  }
  return toolNames;
};
export const getTemplateAllToolNames = (templateName: TemplateDirBaseName) => {
  return getTemplateToolNames(templateName).concat(getTemplateBuildToolNames(templateName));
};
export const hasInvalidToolNames = (templateName: TemplateDirBaseName, tools: OtherToolName[]) => {
  let hasInvalidTools = false;
  const toolNames = getTemplateToolNames(templateName);
  if (tools && !tools.every((t) => toolNames.includes(t))) {
    hasInvalidTools = true;
  }
  return hasInvalidTools;
};
export const hasInvalidBuildToolName = (
  templateName: TemplateDirBaseName,
  tool: AllBuildToolName,
) => {
  let hasInvalid = false;
  let toolNames = getTemplateBuildToolNames(templateName);
  if (tool && !toolNames.includes(tool)) {
    hasInvalid = true;
  }
  return hasInvalid;
};
type GroupToolOptions = Record<string, Option<string>[]>;
export const getGroupToolOptions = (toolOptions: Record<string, Tool[]>): GroupToolOptions => {
  let groupToolOptions: GroupToolOptions = {};
  Object.keys(toolOptions).forEach((key) => {
    groupToolOptions[key] = toolOptions[key].map(({ name, display, color }) => {
      return {
        label: color(display),
        value: name,
      };
    });
  });
  return groupToolOptions;
};
export const getBuildToolOptions = (toolOptions: BuildTool[]): Option<string>[] => {
  return toolOptions.map(({ name, display, color }) => {
    return {
      label: color(display),
      value: name,
    };
  });
};
export const getArchitectureOptions = (): Option<string>[] => {
  return ARCHITECTURES.map(({ name, display, color }) => {
    return {
      label: color(display),
      value: name,
    };
  });
};
