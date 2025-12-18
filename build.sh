#!/bin/bash

# MC Markdown Preview - 构建脚本

echo "🚀 开始构建 MC Markdown Preview 插件..."

# 检查是否需要修复 npm 权限
if [ ! -w ~/.npm ]; then
    echo "⚠️  检测到 npm 权限问题，请先运行："
    echo "   sudo chown -R \$(whoami) ~/.npm"
    echo ""
    read -p "是否现在尝试修复权限？(需要输入密码) [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo chown -R $(whoami) ~/.npm
    else
        echo "请手动修复权限后重新运行此脚本"
        exit 1
    fi
fi

# 步骤 1: 安装依赖
echo "📦 步骤 1/4: 安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 步骤 2: 编译 TypeScript
echo "🔨 步骤 2/4: 编译 TypeScript..."
npm run compile
if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi

# 步骤 3: 检查 vsce
echo "📋 步骤 3/4: 检查打包工具..."
if ! command -v vsce &> /dev/null; then
    echo "   安装 vsce..."
    npm install -g @vscode/vsce
fi

# 步骤 4: 打包
echo "📦 步骤 4/4: 打包插件..."
vsce package
if [ $? -ne 0 ]; then
    echo "❌ 打包失败"
    exit 1
fi

echo ""
echo "✅ 构建完成！"
echo ""
echo "📦 生成的插件文件："
ls -lh mc-markdown-preview-*.vsix 2>/dev/null || echo "   未找到 .vsix 文件"
echo ""
echo "📥 在 Cursor 中安装："
echo "   1. 按 Cmd+Shift+P (Mac) 或 Ctrl+Shift+P (Windows/Linux)"
echo "   2. 输入: Extensions: Install from VSIX..."
echo "   3. 选择生成的 .vsix 文件"








