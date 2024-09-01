# nestjs-pg-tmplate

> 经常初始化项目, 有些功能都是通用的, 每次都进行通用化功能的实现比较繁琐, 因此提取到该项目中.

## 相关功能

- debugger vscode
- eslint, prettier, cSpell, commitLint, husky
- config yml env 支持
- docker compose pg
- typeorm migration
- user login register rbac
- app metaData

## commitLint

```jsonc
// npx husky init
"prepare": "husky"
```

```bash
pnpm i @commitlint/cli @commitlint/config-conventional husky -D
```

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

## config yml env

```bash
pnpm add --save class-validator class-transformer @nestjs/config js-yaml
pnpm add @types/js-yaml -D
```

## 提交代码

```bash
pnpm lint
# git commit -m "type: subject"
# rules view https://www.npmjs.com/package/@commitlint/config-conventional
```
