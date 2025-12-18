# MC Markdown Preview (中文版)

一款优雅的 VSCode/Cursor Markdown 预览增强插件，完美支持数学公式 (KaTeX) 和交互式 Mermaid 图表。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.2.3-green.svg)

## ✨ 功能特性

- 🎨 **优雅的界面**：参考 Cherry Markdown 的设计，完美适配 VSCode 的**浅色**、**深色**及**高对比度**主题。
- 📐 **数学公式**：支持行内 ($...$) 和块级公式，使用 **KaTeX** 高性能渲染。
- 🌊 **交互式 Mermaid**：
    - 支持流程图、序列图、甘特图等所有 Mermaid 类型。
    - **内置缩放和平移**：无需弹窗！直接在预览区通过 `Ctrl/Cmd + 滚轮` 缩放或点击拖拽平移。
    - **工具栏**：每个图表右上角均有内置的放大、缩小和重置按钮。
- 💻 **增强代码块**：
    - **语法高亮**：基于 `highlight.js`，支持自动语言识别。
    - **语言标签**：清晰展示代码语言类型。
    - **一键复制**：代码块右上角内置快速复制按钮。
- 🌍 **国际化支持**：界面支持中英文自动切换。

## 🚀 安装方法

### 手动安装 (.vsix)

1. 从 [Releases](https://github.com/flowinginthewind700/MCMarkdown4Vs/releases) 页面下载最新的 `mc-markdown-preview-x.x.x.vsix` 文件。
2. 在 VSCode/Cursor 中按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)。
3. 输入并选择 `Extensions: Install from VSIX...`。
4. 选择下载的 `.vsix` 文件进行安装。
5. **重要**：安装完成后，请执行 `Developer: Reload Window` 以激活插件。

### Remote SSH 环境安装

如果你在远程服务器上工作：
1. 连接到 Remote SSH 会话。
2. 打开扩展视图 (`Cmd+Shift+X`)。
3. 点击右上角 `...` 菜单，选择 `Install from VSIX...`。
4. 从**本地电脑**选择 `.vsix` 文件，VSCode 会自动将其上传并安装到远程。
5. 或者，如果本地已安装，可以在扩展列表中点击“在 SSH 中安装”按钮。

## 📖 使用指南

- **打开预览**：在 Markdown 文件编辑器或文件管理器中右键，选择 **"Open MC Markdown Preview"** 或 **"打开 MC Markdown 预览"**。
- **命令面板**：按 `Cmd+Shift+P` 输入 `MC Markdown` 即可找到预览命令。
- **Mermaid 操作**：
    - **缩放**：按住 `Ctrl` 滚动滑轮，或使用右上角的 `+`/`-` 按钮。
    - **平移**：在图表区域点击并拖拽。
    - **重置**：点击 `⟲` 按钮恢复初始大小和位置。

## 🛠 开发相关

```bash
# 1. 安装依赖
npm install

# 2. 编译 TypeScript
npm run compile

# 3. 打包插件
# 需要全局安装 @vscode/vsce: npm install -g @vscode/vsce
vsce package
```

## 📜 许可证

本项目采用 [MIT 许可证](./LICENSE)。

