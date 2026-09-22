# Inkstone

基于 React、TypeScript、Vite 和 CodeMirror 的 Markdown 笔记前端，后端接入同级 `tiny-blog-go`，与 Tiny Note 共用账号和笔记数据。

[English](README.md) · [文档索引](docs/README.md) · [许可证](LICENSE)

## 启动与打包

使用 Node 24；依赖缺失或变更时才执行 `npm install`。

```sh
npm run dev
npm run prod
npm run build:prod
```

`npm run prod` 启动本地 Vite 并加载 `.env.production`，连接生产 API；此命令不执行打包。

开发页为 `http://localhost:7712`，`.env.development` 中的 `INKSTONE_API_TARGET` 默认代理至 `http://127.0.0.1:8081`。Go 在同级 `tiny-blog-go` 单独运行。端口固定，避免与 Go 的 Origin 白名单不一致。

构建产物为 `dist/client`，按静态站点部署。`.env.production` 设置生产 `VITE_API_BASE_URL`；`.env` 为公共默认值，`.env.demo` 用于独立演示。个人覆盖放入 `.env.development.local` 或 `.env.production.local`，这些文件不提交。前端变量不得存放密码、数据库连接或 S3 密钥。

`npm run build` 等同于 `build:prod`；`npm run preview` 预览已有生产产物，不会重新构建。演示模式使用 `dev:demo` / `build:demo`。Go 的 `INKSTONE_PUBLIC_URL` 必须与部署前端 Origin 一致。详见[构建与部署](docs/05-operations/tiny-build-and-deployment.md)。

## 当前状态

默认开发和生产构建已切换到 Go，笔记、目录、标签、版本、会话、附件、搜索及同步已实现首批接入。账号管理统一使用 Tiny，移除独立 TOTP 和自助销号入口。

完整迁移尚未完成：分享、远程备份、对外 MCP/OAuth、可选语义搜索及部分并发验收仍待完成。Worker 专用依赖、部署命令、Wrangler 配置已移除；旧 Worker 源码仅作为迁移参考保留，不参与当前 TypeScript 构建。

[验证记录](docs/04-quality/go-backend-verification.md)列明检查和限制；原 Cloudflare 说明已[归档](docs/99-archive/cloudflare-readme-zh.md)。

## 验证

```sh
npm run test:unit
npm run typecheck
npm run i18n:check
npm run comments:check
```

原端到端脚本会创建、修改和删除数据，只能连接隔离测试后端。
