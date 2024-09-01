# nestjs-pg-tmplate

> 经常初始化项目, 有些功能都是通用的, 每次都进行通用化功能的实现比较繁琐, 因此提取到该项目中.

## 相关功能

- ts strict true
- debugger vscode
- eslint, prettier, cSpell, commitLint, husky
- config yml env 支持
- docker compose pg
- typeorm migration soft-delete
- user login register rbac
- app metaData
- open sdk generate

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

## docker compose pg

```yml
# docker-compose-depend.yml
services:
  redis:
    image: redis:latest
    container_name: redis
    restart: unless-stopped
    privileged: true
    volumes:
      - ./volumes/redis/datadir:/data
      - ./volumes/redis/conf/redis.conf:/usr/local/etc/redis/redis.conf
      - ./volumes/redis/logs:/logs
    command:
      # redis-server
      #  两个写入操作 只是为了解决启动后警告 可以去掉
      /bin/bash -c "echo 511 > /proc/sys/net/core/somaxconn && echo never > /sys/kernel/mm/transparent_hugepage/enabled && redis-server /usr/local/etc/redis/redis.conf"
    ports:
      - 6379:6379
    networks:
      - dev

  pgsql:
    image: postgres:latest
    restart: unless-stopped
    container_name: pgsql-new
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - TZ=Asia/Shanghai
    ports:
      - '5434:5432'
    volumes:
      # 初始的数据文件
      - ./volumes/pgsql/data:/var/lib/postgresql/data
    networks:
      - dev
networks:
  dev:
    name: zhengjue-serve-dev
```

```bash
# redis pgsql
docker compose -f docker-compose-depend.yml up -d
```

## typeorm pg

```bash
nest g lib db
```

```bash
pnpm add --save @nestjs/typeorm typeorm pg
```

## user login register rbac

```bash
pnpm add bcrypt @nestjs/jwt @nestjs/passport passport-jwt
```

```bash
nest g mo auth
nest g co auth
nest g s auth

nest g mo user
nest g co user
nest g s user

nest g mo role
nest g co role
nest g s role
```

## open sdk generate

```bash
# change branch to openapi
npm version patch
git push --tags
git push
```

## 数据迁移

```bash
# 生成迁移 (根据实体信息)
npm run typeorm migration:generate -n ./libs/db/src/migrations/fix-data
# 新建迁移
npx typeorm migration:create ./libs/db/src/migrations/init-data
# 迁移
npm run typeorm migration:run --fake
# 回滚
npm run typeorm migration:revert
# 同步实体
npm run typeorm schema:sync
```

## 提交代码

```bash
pnpm lint
# git commit -m "type: subject"
# rules view https://www.npmjs.com/package/@commitlint/config-conventional
```
