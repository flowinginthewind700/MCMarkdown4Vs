#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const mediaDir = path.join(__dirname, '..', 'media');

// 确保 media 目录存在
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const files = [
  {
    url: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js',
    filename: 'mermaid.min.js',
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
    filename: 'katex.min.js',
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
    filename: 'katex.min.css',
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/markdown-it@14/dist/markdown-it.min.js',
    filename: 'markdown-it.min.js',
  },
  {
    url: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js',
    filename: 'highlight.min.js',
  },
  {
    url: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css',
    filename: 'highlight-github.min.css',
  },
  {
    url: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css',
    filename: 'highlight-github-dark.min.css',
  },
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 处理重定向
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('开始下载依赖文件...\n');

  for (const file of files) {
    const filepath = path.join(mediaDir, file.filename);
    console.log(`下载 ${file.filename}...`);
    try {
      await downloadFile(file.url, filepath);
      console.log(`✓ ${file.filename} 下载完成\n`);
    } catch (err) {
      console.error(`✗ ${file.filename} 下载失败:`, err.message, '\n');
    }
  }

  console.log('所有文件下载完成！');
}

main().catch(console.error);






