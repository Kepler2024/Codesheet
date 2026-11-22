# Codesheet 前端开发规范

Codesheet 用 Astro 从同一仓库的 `sheets/*.md` 生成静态网站，再由 GitHub Actions 发布到绑定自定义域名的 GitHub Pages。读者从首页选择语言，贡献者从语言页进入对应 Markdown 提交修改。页面的视觉风格和布局由前端设计者决定。

## 内容从哪里来

每次构建时扫描 `sheets/*.md`。首页、语言路由和正文共用这批文件。现有 sheet 格式足以生成页面，新增一份符合格式的文件即可进入网站，贡献者无需另填 front matter、登记语言清单或编写组件。[贡献指南](../CONTRIBUTING.md)

| 页面需要的值 | 取值规则 | 以 C++ 为例 |
| --- | --- | --- |
| 路由 ID | 取文件名，去掉末尾的 `.md` | `sheets/cpp.md` → `cpp` → `/cpp/` |
| 语言显示名 | 读取文档首个一级标题，去掉末尾的 ` Cheat Sheet`，保留大小写和符号 | `# C++ Cheat Sheet` → `C++` |
| 适用版本 | 读取标题后的引用段，去掉开头的 `Written for `，保留完整工具链描述 | `C++23 (GCC 14)` |
| 章节目录 | 按原文顺序读取二、三级标题，链接到渲染器给对应标题生成的实际 ID | `References and Pointers` 也是目录项 |
| 正文和编辑路径 | 渲染同一份 Markdown，保留其仓库相对路径，用于生成编辑链接 | `sheets/cpp.md` |

按 Markdown 文档结构提取元数据。代码围栏里的 `#` 可以是 Python 注释或 C++ 预处理指令。文件头不符合约定，或两个页面要写到同一个 URL 时，构建须报出源文件路径并以失败退出，避免发布缺页的导览。

## 页面如何生成

- **导览页 `/`** 由 `src/pages/index.astro` 生成。从构建时发现的 sheet 列出语言名、版本和指向 `/<id>/` 的普通链接。语言清单随文件的增加、改名或移除而更新。
- **语言页 `/<id>/`** 共用 `src/pages/[id].astro`。用 `getStaticPaths()` 从同一批 sheet 枚举路径，生成 `dist/<id>/index.html`。页面显示一次标题和版本，保留引言、全部章节和示例，并提供章节锚点和返回导览的链接。[Astro 静态路由](https://docs.astro.build/en/guides/routing/#static-ssg-mode)
- **编辑入口** 在每个语言页指向 `https://github.com/<owner>/<repo>/edit/<branch>/sheets/<id>.md`。仓库和默认分支来自统一配置或 Actions 上下文，文件路径来自本页源文件。直接访问、刷新语言页或关闭 JavaScript 时，正文、导航和编辑链接均可用。
- **代码显示** 保留围栏内的缩进、空行、注释和源码字符，例如 `#include <iostream>`、`=>` 和 `CAREFUL:`。按第一个围栏标记选择高亮语言，缺少对应高亮器时显示纯文本。`text stdin` 是上一示例的输入，按原位置展示并标明用途。`norun` 和 `nocheck` 块也完整展示。网页构建只渲染示例，示例执行遵循贡献指南中的检查流程。

## 如何构建和发布

| 时机 | 要求 |
| --- | --- |
| 本地 | 仓库根目录提供 `npm ci`、`npm run dev`、`npm run build`、`npm run preview`，提交与 npm 一致的锁文件。生产构建从当前检出的 Markdown 生成完整的 `dist/`，可用普通静态文件服务器预览。 |
| Pull Request | GitHub Actions 构建站点，自动核对源文件清单、首页链接和实际生成的语言页是否一一对应，并检查目录锚点是否存在。只改 `sheets/*.md` 也要触发。PR 阶段只验证，发布作业限定在主分支。 |
| 合并到 `main` | 为该提交重新构建并检查，成功后将该次构建的 `dist/` 作为 Pages artifact 发布。失败时保留上一次成功部署。生成的 HTML 属于构建产物，贡献者只提交源文件。 |
| 站点地址 | 用仓库的 Actions 变量 `SITE_URL` 和 `BASE_PATH` 决定站点地址，工作流把它们传给 Astro 的 `site` 和 `base`，验收脚本也读取同一个 `BASE_PATH`。绑定自定义域名时 `SITE_URL` 填完整的 HTTPS 域名，不设 `BASE_PATH`（默认 `/`），C++ 页位于 `/cpp/`。没有自定义域名时站点发布在 `https://<owner>.github.io/<repo>/`，设 `SITE_URL=https://<owner>.github.io`、`BASE_PATH=/<repo>`，C++ 页位于 `/<repo>/cpp/`。站内链接和 `public/` 资源一律用 `src/lib/paths.js` 的 `withBase()` 生成，不写死以 `/` 开头的路径。 |

首次上线时，维护者在仓库 **Settings → Pages** 选择 **GitHub Actions**。改用自定义域名时，将 `SITE_URL` 改为该域名、删除 `BASE_PATH`，把主机名填入 **Custom domain**，再按域名类型配置 DNS。证书就绪后启用 **Enforce HTTPS**。后续修改 sheet 只需走正常合并流程。[Astro 部署指南](https://docs.astro.build/en/guides/deploy/github/) · [GitHub 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) · [GitHub 域名设置](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 前端交付验收

以下检查以干净构建的 `dist/` 为准。涉及增删文件的用例在临时副本中运行。

1. **验证自动发现。** 对照当前 `sheets/*.md` 的文件名，首页的语言链接必须逐一对应，每个链接都有可直接访问的 HTML。临时加入一份符合模板的新语言 sheet，只改这一个文件再构建，首页应出现新入口，语言页可打开。删除临时 sheet 再构建，入口和对应产物均应消失。
2. **验证内容更新。** 在临时副本里修改一份 sheet 的版本行和一处示例。重新构建后，首页和语言页都显示新版本，示例出现在对应章节，原网址继续可用。删掉必需的版本行再构建，应明确报出该文件并失败。
3. **验证渲染。** 静态预览 `/cpp/` 和 `/rust/`。C++ 页面中的 `#include <iostream>` 可按原文复制，输入示例保留换行。Rust 的 `Ownership and Borrowing` 出现在原位置，目录链接能跳到对应标题。禁用 JavaScript 后重载，正文、锚点和编辑链接仍可用。
4. **验证发布。** 仅改 Markdown 的 PR 会运行网站检查，部署作业会跳过。首次正式发布后，从实际站点地址直接打开首页和 C++ 页（`<base>/` 和 `<base>/cpp/`），确认页面与静态资源加载成功，编辑链接打开该仓库默认分支的 `sheets/cpp.md`。

分别记录前端验收结果和示例执行结果。只有实际运行过 sheet 检查器，才能报告示例已验证。新增语言的运行适配器按项目的贡献流程单独接入。[贡献指南](../CONTRIBUTING.md)
