# AI Agent 使用报告 · 许希楷

一个单页个人报告站点：白色底 + DeepSeek 蓝（`#4D6BFE`）点缀，纯静态、零依赖、不需要构建。

## 文件结构

```
agent-report/
├─ index.html    报告正文（整站只有一个页面，CSS/JS 全部内联）
├─ 404.html      404 页面（GitHub Pages 会自动使用）
├─ preview.png   整页预览图（同时作为社交分享封面 og:image）
├─ robots.txt    爬虫规则
├─ .nojekyll     告诉 GitHub Pages 跳过 Jekyll 处理，直接发布静态文件
├─ server.js     本地预览用的极简静态服务器（Node，无依赖）
└─ README.md
```

## 本地预览

直接双击 `index.html` 就能看。想要 http:// 地址（更接近线上环境，404 页也能测）：

```bash
node server.js          # 打开 http://127.0.0.1:4318/
PORT=8080 node server.js # 换端口（PowerShell 里用 $env:PORT=8080; node server.js）
```

## 发布到 GitHub Pages

### 方式一：网页上传（不用装任何工具）

1. 打开 <https://github.com/new>，仓库名填 `my-ai-agent-report`，选 **Public**，创建。
2. 进入仓库 → **Add file → Upload files**，把本目录下**所有文件**拖进去（注意是文件本身，不要上传外层文件夹），提交。
3. 仓库 **Settings → Pages** → Source 选 `Deploy from a branch` → 分支 `main`、目录 `/ (root)` → **Save**。
4. 等 1 分钟左右，访问 `https://<你的用户名>.github.io/my-ai-agent-report/`。

### 方式二：命令行

```bash
cd agent-report
git init -b main
git add .
git commit -m "AI Agent 使用报告"
git remote add origin https://github.com/<你的用户名>/my-ai-agent-report.git
git push -u origin main
```

推送之后同样到 Settings → Pages 打开 Pages 即可。

## 改内容时看这里

| 想改什么 | 去哪里 |
| --- | --- |
| 首屏标题、副标题、四个数据胶囊 | `index.html` 里 `<!-- HERO -->` 区块 |
| 主力 Agent 的描述与标签 | `<!-- 01 工具足迹 -->` 里的 `.agent` 卡片 |
| 插件卡片（现在是 6 张） | `<!-- 02 插件生态 -->` 里的 `.plugins`，增删 `.card` 即可，栅格会自动重排 |
| 五条心得 | `<!-- 03 心得 -->` 里的 `.rules` |
| 主色 | CSS 变量 `--blue` 与 `--blue-deep` |
| 署名与年份 | 导航 `.brand`、页脚；年份由 JS 自动取当前年份 |

改动后如需更新预览图，在浏览器里整页截图覆盖 `preview.png` 即可。

## 已知设计取舍

- 入场动画在**加载时**依次淡入，而不是滚动到视口才出现——这样整页截图、打印、无 JS 环境下都不会出现空白区块。
- 打印时导航会取消吸顶、隐藏光斑，直接 `Ctrl+P` 存 PDF 也能用。
