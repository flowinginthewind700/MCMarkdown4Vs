// MC Markdown Preview - 主脚本

(function() {
  'use strict';

  const vscode = acquireVsCodeApi();
  const app = document.getElementById('app');
  let md;

  // 初始化 markdown-it
  function initMarkdownIt() {
    if (typeof markdownit === 'undefined') {
      console.error('markdown-it not loaded');
      return;
    }

    md = markdownit({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      highlight: function (str, lang) {
        if (lang && typeof hljs !== 'undefined') {
          try {
            if (hljs.getLanguage(lang)) {
              return hljs.highlight(str, { language: lang }).value;
            } else {
              // 自动检测
              return hljs.highlightAuto(str).value;
            }
          } catch (__) {}
        }
        return ''; // 使用默认转义
      }
    });

    // 添加数学公式和 Mermaid 支持
    const originalFenceRender = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.fence = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        const info = token.info ? token.info.trim() : '';
        const langName = info ? info.split(/\s+/g)[0] : '';

        // 处理数学公式
        if (langName === 'math' || langName === 'katex') {
          try {
            if (typeof katex !== 'undefined') {
              return '<div class="katex-display">' + katex.renderToString(token.content, {
                displayMode: true,
                throwOnError: false,
              }) + '</div>';
            }
          } catch (e) {
            console.error('KaTeX render error:', e);
            return '<pre><code>' + token.content + '</code></pre>';
          }
        }

        // 处理 Mermaid 图表
        if (langName === 'mermaid') {
          const id = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          const escapedCode = escapeHtml(token.content);
          
          // 安全地获取高亮代码
          let highlightedCode = escapedCode;
          if (typeof hljs !== 'undefined') {
            try {
              if (hljs.getLanguage('mermaid')) {
                highlightedCode = hljs.highlight(token.content, { language: 'mermaid' }).value;
              } else {
                highlightedCode = hljs.highlightAuto(token.content).value;
              }
            } catch (e) {
              console.error('Highlight.js error for mermaid source:', e);
            }
          }
          
          return `<div class="mermaid-wrapper" data-mermaid-id="${id}" data-mermaid-code="${escapedCode}">
            <div class="mermaid-toolbar">
              <button class="mermaid-toolbar-btn view-source" title="View Source Code">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25zm6.56 0a.75.75 0 1 0-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06l-4.25-4.25z"></path></svg>
              </button>
              <div class="toolbar-separator"></div>
              <button class="mermaid-toolbar-btn zoom-in" title="Zoom In">+</button>
              <button class="mermaid-toolbar-btn zoom-out" title="Zoom Out">-</button>
              <button class="mermaid-toolbar-btn reset-zoom" title="Reset">⟲</button>
            </div>
            <div class="mermaid-container-actual">
              <div class="mermaid" id="${id}">${token.content}</div>
              <div class="mermaid-source hidden">
                <pre data-lang="mermaid"><code class="language-mermaid">${highlightedCode}</code></pre>
              </div>
            </div>
          </div>`;
        }

        // 默认代码块 - 使用原始渲染器并增加语言标签
        const rawContent = tokens[idx].content;
        const highlighted = options.highlight(rawContent, langName) || escapeHtml(rawContent);
        return `<pre data-lang="${langName}"><code class="language-${langName}">${highlighted}</code></pre>`;
      };

    // 处理行内数学公式
    const originalInlineRender = md.renderer.rules.code_inline || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.code_inline = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        const content = token.content;

        // 检测行内数学公式 $...$ 或 \(...\)
        if (content.startsWith('$') && content.endsWith('$') && content.length > 2) {
          try {
            if (typeof katex !== 'undefined') {
              const mathContent = content.slice(1, -1);
              return katex.renderToString(mathContent, {
                displayMode: false,
                throwOnError: false,
              });
            }
          } catch (e) {
            console.error('KaTeX inline render error:', e);
          }
        }

        return originalInlineRender(tokens, idx, options, env, self);
      };
  }

  // HTML 转义
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 添加代码块复制按钮
  function addCopyButtons() {
    const codeBlocks = app.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;

      // 如果父容器是隐藏的，可能需要特殊处理或者等显示后再添加，但 querySelectorAll 依然能找到
      
      // 检查是否已有复制按钮
      if (pre.querySelector('.copy-button')) return;

      // 获取语言类型
      const langMatch = codeBlock.className.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : '';
      if (lang) {
        pre.setAttribute('data-lang', lang);
      }

      // 创建复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-button';
      copyBtn.textContent = 'Copy';
      copyBtn.title = 'Copy Code';

      // 复制功能
      copyBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const text = codeBlock.textContent;
        try {
          await navigator.clipboard.writeText(text);
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        } catch (err) {
          // 降级方案
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = 'Copy';
            }, 2000);
          } catch (e) {
            copyBtn.textContent = 'Failed';
            setTimeout(() => {
              copyBtn.textContent = 'Copy';
            }, 2000);
          }
          document.body.removeChild(textarea);
        }
      });

      pre.appendChild(copyBtn);
    });
  }

  // 初始化 Mermaid
  function initMermaid() {
    if (typeof mermaid === 'undefined') {
      console.error('mermaid not loaded');
      return;
    }

    const isDark = document.body.classList.contains('vscode-dark');
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        // 线条颜色
        lineColor: isDark ? '#e0e0e0' : '#333333',
        edgeColor: isDark ? '#e0e0e0' : '#333333',
        // 节点边框颜色
        nodeBorder: isDark ? '#888888' : '#333333',
        // 文本颜色
        primaryTextColor: isDark ? '#ffffff' : '#333333',
        // 箭头颜色
        mainBkg: isDark ? '#2d2d2d' : '#ffffff',
      },
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      flowchart: {
        curve: 'basis',
        padding: 30,
        nodeSpacing: 60,
        rankSpacing: 60,
        diagramPadding: 30,
        useMaxWidth: false,
        htmlLabels: true,
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        addMessages: true,
        useMaxWidth: false,
      },
      gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        barGap: 4,
        topPadding: 50,
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        numberSectionStyles: 4,
        axisFormat: '%Y-%m-%d',
        useMaxWidth: false,
      }
    });
  }

  // 渲染 Mermaid 图表
  async function renderMermaidDiagrams() {
    const wrappers = document.querySelectorAll('.mermaid-wrapper');
    
    for (const wrapper of wrappers) {
      if (wrapper.classList.contains('rendered')) continue;
      
      const mermaidDiv = wrapper.querySelector('.mermaid');
      if (!mermaidDiv) continue;

      let code = wrapper.getAttribute('data-mermaid-code');
      if (!code) {
        code = mermaidDiv.textContent.trim();
      } else {
        const div = document.createElement('div');
        div.innerHTML = code;
        code = div.textContent || div.innerText || code;
      }
      
      if (!code) continue;

      // 使用一个新的 ID 进行渲染，避免与现有 DOM 冲突
      const renderId = 'render-' + mermaidDiv.id;
      
      try {
        const { svg } = await mermaid.render(renderId, code);
        mermaidDiv.innerHTML = svg;
        wrapper.classList.add('rendered');
        
        const svgElement = mermaidDiv.querySelector('svg');
        if (svgElement) {
          svgElement.removeAttribute('width');
          svgElement.removeAttribute('height');
          svgElement.style.width = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.maxWidth = 'none'; // 允许缩放
          
          // 设置初始缩放和位置
          setupMermaidInteractivity(wrapper, svgElement);
        }
      } catch (err) {
        mermaidDiv.innerHTML = `<div style="padding: 20px; color: #d73a49; background: #ffeef0; border-radius: 6px; font-size: 14px;">
          <strong>Mermaid Render Error:</strong><br>${escapeHtml(err.message)}
        </div>`;
        console.error('Mermaid render error:', err);
      }
    }
  }

  // 设置 Mermaid 交互（缩放和拖拽）
  function setupMermaidInteractivity(wrapper, svgElement) {
    let scale = 1;
    let position = { x: 0, y: 0 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    const updateTransform = () => {
      svgElement.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;
    };

    // 工具栏按钮
    const btnZoomIn = wrapper.querySelector('.zoom-in');
    const btnZoomOut = wrapper.querySelector('.zoom-out');
    const btnReset = wrapper.querySelector('.reset-zoom');
    const btnSource = wrapper.querySelector('.view-source');
    const mermaidDiv = wrapper.querySelector('.mermaid');
    const sourceDiv = wrapper.querySelector('.mermaid-source');

    if (btnSource) {
      btnSource.addEventListener('click', (e) => {
        e.stopPropagation();
        const isSourceVisible = !sourceDiv.classList.contains('hidden');
        if (isSourceVisible) {
          sourceDiv.classList.add('hidden');
          mermaidDiv.classList.remove('hidden');
          btnSource.classList.remove('active');
          btnSource.title = 'View Source Code';
          // 重新显示缩放按钮
          if (btnZoomIn) btnZoomIn.style.display = '';
          if (btnZoomOut) btnZoomOut.style.display = '';
          if (btnReset) btnReset.style.display = '';
        } else {
          sourceDiv.classList.remove('hidden');
          mermaidDiv.classList.add('hidden');
          btnSource.classList.add('active');
          btnSource.title = 'View Diagram';
          // 隐藏不相关的缩放按钮
          if (btnZoomIn) btnZoomIn.style.display = 'none';
          if (btnZoomOut) btnZoomOut.style.display = 'none';
          if (btnReset) btnReset.style.display = 'none';
          
          // 确保代码块有复制按钮
          addCopyButtons();
        }
      });
    }

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.min(scale + 0.2, 5);
        updateTransform();
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.max(scale - 0.2, 0.2);
        updateTransform();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = 1;
        position = { x: 0, y: 0 };
        updateTransform();
      });
    }

    // 拖拽逻辑
    const mermaidArea = wrapper.querySelector('.mermaid');
    if (mermaidArea) {
      mermaidArea.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          isDragging = true;
          dragStart = { x: e.clientX - position.x, y: e.clientY - position.y };
          mermaidArea.classList.add('panning');
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (isDragging) {
          position = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
          updateTransform();
        }
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
        mermaidArea.classList.remove('panning');
      });

      // 滚轮缩放
      mermaidArea.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY < 0 ? 0.1 : -0.1;
          scale = Math.max(0.2, Math.min(5, scale + delta));
          updateTransform();
        }
      }, { passive: false });
    }
  }

  // 渲染 Markdown
  function renderMarkdown(content) {
    if (!md) {
      initMarkdownIt();
    }

    if (!md) {
      app.innerHTML = '<p>Markdown renderer not initialized</p>';
      return;
    }

    try {
      const html = md.render(content);
      app.innerHTML = html;

      // 添加代码块复制功能
      addCopyButtons();

      // 渲染 Mermaid 图表
      if (typeof mermaid !== 'undefined') {
        renderMermaidDiagrams();
      }

      // 处理数学公式块
      const mathBlocks = app.querySelectorAll('pre code[class*="language-math"], pre code[class*="language-katex"]');
      mathBlocks.forEach(block => {
        try {
          if (typeof katex !== 'undefined') {
            const mathContent = block.textContent.trim();
            const displayDiv = document.createElement('div');
            displayDiv.className = 'katex-display';
            displayDiv.innerHTML = katex.renderToString(mathContent, {
              displayMode: true,
              throwOnError: false,
            });
            block.parentElement.replaceWith(displayDiv);
          }
        } catch (e) {
          console.error('KaTeX block render error:', e);
        }
      });
    } catch (err) {
      console.error('Markdown render error:', err);
      app.innerHTML = `<p style="color: #d73a49;">Render Error: ${escapeHtml(err.message)}</p>`;
    }
  }

  // 监听来自扩展的消息
  window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
      case 'update':
        renderMarkdown(message.content);
        break;
    }
  });

  // 初始化
  function init() {
    initMarkdownIt();
    initMermaid();

    // 如果有初始内容，渲染它
    if (window.initialContent) {
      renderMarkdown(window.initialContent);
    }
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

