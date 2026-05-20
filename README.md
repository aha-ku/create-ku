# create-ku

Flexible project scaffolding CLI – supports Monorepo, Package, and Normal architectures.

## Scaffolding a project

With npm:

```bash
npm create ku@latest
```

With yarn:

```bash
yarn create ku
```

With pnpm:

```bash
pnpm create ku
```

Then follow the prompts!

You can also use command line options to scaffold a project , For example:

```bash
# create a monorepo project with turbo, oxfmt, oxlint, cspell, lefthook, and vanilla-ts template
pnpm create ku --monorepo my-project --build-tool turbo --tools oxfmt oxlint cspell lefthook -- --template vanilla-ts
# create a package project with tsdown, in a monorepo, and react-ts template
pnpm create ku --package ./my-project/packages/ui --build-tool tsdown --in-monorepo --template react-ts
# create a normal project with vue-ts template in a monorepo
pnpm create ku --normal ./my-project/apps/my-app --template --in-monorepo vue-ts
```

Currently supported template presets include:

- monorepo:
  - vanilla-ts
  - vanilla
- package:
  - vanilla-ts
  - vanilla
  - vue-ts
  - vue
  - react-ts
  - react
- normal:
  - vanilla-ts
  - vanilla
  - vue-ts
  - vue
  - react-ts
  - react
