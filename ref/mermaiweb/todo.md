# Mermaid 图表编辑器开发计划

## 需要创建的文件列表

1. **src/pages/Index.tsx** - 主页面组件
   - 包含编辑器和预览区域的布局
   - 集成 Mermaid 渲染功能
   - 实现缩放和导出功能

2. **src/components/MermaidEditor.tsx** - Mermaid 代码编辑器组件
   - 使用 Textarea 组件
   - 提供代码输入区域
   - 包含示例模板按钮

3. **src/components/MermaidPreview.tsx** - Mermaid 预览组件
   - 渲染 Mermaid 图表
   - 支持缩放和平移
   - 处理渲染错误

4. **src/components/ExportButton.tsx** - 导出按钮组件
   - 实现 PNG 导出功能
   - 使用 html2canvas 或类似库

5. **src/lib/mermaidConfig.ts** - Mermaid 配置文件
   - 配置 Mermaid 主题和样式

6. **index.html** - 更新页面标题和描述

## 依赖项
- mermaid: Mermaid 图表渲染库
- html-to-image: 用于导出 PNG 图片
- react-icons: 图标库

## 实现策略
- 使用简单的 MVP 方式实现
- 左右分栏布局：左侧编辑器，右侧预览
- 使用 shadcn-ui 组件保持一致的设计风格
- 实现实时预览功能
- 添加缩放控制按钮和导出按钮