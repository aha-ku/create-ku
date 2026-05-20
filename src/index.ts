import cac from "cac";
import { DEFAULT_TARGET_DIR, VERSION } from "./config";
import { mainAction } from "./actions";

const cli = cac();
cli.option("--dirname <dirname>", "target directory name", {
  default: DEFAULT_TARGET_DIR,
});
cli
  .command("[target]", "create a new project")
  .option("-m, --monorepo", "create a monorepo project")
  .option("-p, --package", "create a package project")
  .option("-n, --normal", "create a normal project")
  .option("--tools [...tools]", "specify the tools to use")
  .option("--build-tool [buildTool]]", "specify the build tool to use")
  .option("--in-monorepo", "In monorepo project")
  .option("-t, --template [template]", "specify the template to use")
  .option("--overwrite", "overwrite target directory if it exists")
  .option("--interactive", "interactive mode")
  .option("--no-interactive", "non-interactive mode")
  .option("--immediate", "Install dependencies immediately")
  .action((target, options) => {
    mainAction(target, options).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
  });
cli.version(VERSION);
cli.help();
cli.parse();
