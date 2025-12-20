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
        let highlighted = '';
        if (lang && typeof hljs !== 'undefined') {
          try {
            if (hljs.getLanguage(lang)) {
              highlighted = hljs.highlight(str, { language: lang }).value;
            } else {
              highlighted = hljs.highlightAuto(str).value;
            }
          } catch (__) {
            highlighted = escapeHtml(str);
          }
        } else {
          highlighted = escapeHtml(str);
        }

        // 不再默认包装空格，只在用户点击显示空格按钮时才添加
        return highlighted;
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

  // 添加代码块工具栏（复制按钮和显示空格切换）
  function addCodeBlockToolbars() {
    const codeBlocks = app.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE' || pre.closest('.mermaid-source')) return;

      // 检查是否已有工具栏
      if (pre.querySelector('.code-toolbar')) return;

      // 获取语言类型
      const langMatch = codeBlock.className.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : '';
      if (lang) {
        pre.setAttribute('data-lang', lang);
      }

      // 创建工具栏容器
      const toolbar = document.createElement('div');
      toolbar.className = 'code-toolbar';

      // 1. 显示/隐藏空格按钮
      const wsBtn = document.createElement('button');
      wsBtn.className = 'toolbar-btn ws-toggle';
      wsBtn.innerHTML = '¶'; // 段落符号，常用于表示显示隐藏字符
      wsBtn.title = 'Toggle Whitespace';
      
      // 动态添加/移除空格标记的函数
      const toggleWhitespace = (show) => {
        if (show) {
          // 添加空格标记：将空格和制表符包装在 span 中
          const walker = document.createTreeWalker(
            codeBlock,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
            // 跳过已经在 span 中的文本节点
            if (node.parentElement && (node.parentElement.classList.contains('ws-space') || node.parentElement.classList.contains('ws-tab'))) {
              continue;
            }
            textNodes.push(node);
          }
          
          textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const parent = textNode.parentNode;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            
            // 处理空格和制表符
            for (let i = 0; i < text.length; i++) {
              if (text[i] === ' ') {
                if (lastIndex < i) {
                  fragment.appendChild(document.createTextNode(text.substring(lastIndex, i)));
                }
                const span = document.createElement('span');
                span.className = 'ws-space';
                span.textContent = ' ';
                fragment.appendChild(span);
                lastIndex = i + 1;
              } else if (text[i] === '\t') {
                if (lastIndex < i) {
                  fragment.appendChild(document.createTextNode(text.substring(lastIndex, i)));
                }
                const span = document.createElement('span');
                span.className = 'ws-tab';
                span.textContent = '\t';
                fragment.appendChild(span);
                lastIndex = i + 1;
              }
            }
            
            if (lastIndex < text.length) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            }
            
            if (fragment.childNodes.length > 0) {
              parent.replaceChild(fragment, textNode);
            }
          });
        } else {
          // 移除空格标记：将 span 中的内容还原为普通文本
          const wsSpans = codeBlock.querySelectorAll('.ws-space, .ws-tab');
          wsSpans.forEach(span => {
            const textNode = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(textNode, span);
          });
          
          // 合并相邻的文本节点
          const walker = document.createTreeWalker(
            codeBlock,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
            textNodes.push(node);
          }
          
          // 合并相邻的文本节点
          for (let i = textNodes.length - 1; i > 0; i--) {
            const prev = textNodes[i - 1];
            const curr = textNodes[i];
            if (prev.nextSibling === curr && prev.parentNode === curr.parentNode) {
              prev.textContent += curr.textContent;
              curr.parentNode.removeChild(curr);
            }
          }
        }
      };
      
      // 默认不显示空格，所以不需要 active 类
      wsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShowing = pre.classList.toggle('show-whitespace');
        wsBtn.classList.toggle('active', isShowing);
        toggleWhitespace(isShowing);
      });

      // 2. 复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'toolbar-btn copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.title = 'Copy Code';

      copyBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        // 复制时需要处理掉我们添加的 span，直接取 textContent 即可
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

      toolbar.appendChild(wsBtn);
      toolbar.appendChild(copyBtn);
      pre.appendChild(toolbar);
    });
  }

  // 修改原来的 addCopyButtons 调用
  function addCopyButtons() {
    addCodeBlockToolbars();
  }

  // 初始化 Mermaid
  // 增强 Mermaid 文字可读性
  function enhanceMermaidTextReadability(svgElement, isDark) {
    if (!svgElement) return;
    
    // 获取所有文本元素
    const textElements = svgElement.querySelectorAll('text, tspan');
    const isDarkMode = isDark || document.body.classList.contains('vscode-dark');
    
    textElements.forEach(textEl => {
      // 获取当前字体大小
      const currentFontSize = parseFloat(textEl.getAttribute('font-size') || window.getComputedStyle(textEl).fontSize || '14');
      
      // 如果字体小于 14px，增大到至少 14px
      if (currentFontSize < 14) {
        textEl.setAttribute('font-size', Math.max(14, currentFontSize * 1.2));
      } else if (currentFontSize < 16) {
        // 如果字体在 14-16px 之间，适当增大
        textEl.setAttribute('font-size', currentFontSize * 1.15);
      }
      
      // 增强文字对比度
      const currentFill = textEl.getAttribute('fill') || textEl.style.fill || (isDarkMode ? '#ffffff' : '#1a1a1a');
      
      // 确保文字颜色有足够的对比度
      if (isDarkMode) {
        // 深色模式：使用更亮的白色
        if (currentFill === '#ffffff' || currentFill === '#fff' || !currentFill) {
          textEl.setAttribute('fill', '#ffffff');
        } else {
          // 对于其他颜色，确保亮度足够
          textEl.setAttribute('fill', currentFill);
        }
        // 添加文字阴影以提高可读性
        textEl.setAttribute('filter', 'url(#text-shadow-dark)');
      } else {
        // 浅色模式：使用更深的黑色
        if (currentFill === '#333333' || currentFill === '#333' || currentFill === '#000000' || currentFill === '#000' || !currentFill) {
          textEl.setAttribute('fill', '#1a1a1a');
        } else {
          textEl.setAttribute('fill', currentFill);
        }
        // 添加文字阴影以提高可读性
        textEl.setAttribute('filter', 'url(#text-shadow-light)');
      }
      
      // 设置字体粗细以提高可读性
      const fontWeight = textEl.getAttribute('font-weight') || textEl.style.fontWeight || 'normal';
      if (fontWeight === 'normal' || !fontWeight) {
        textEl.setAttribute('font-weight', '500');
      }
    });
    
    // 添加文字阴影滤镜定义（如果不存在）
    let defs = svgElement.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgElement.insertBefore(defs, svgElement.firstChild);
    }
    
    // 深色模式文字阴影
    if (!defs.querySelector('#text-shadow-dark')) {
      const darkFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      darkFilter.setAttribute('id', 'text-shadow-dark');
      darkFilter.setAttribute('x', '-50%');
      darkFilter.setAttribute('y', '-50%');
      darkFilter.setAttribute('width', '200%');
      darkFilter.setAttribute('height', '200%');
      
      const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
      feGaussianBlur.setAttribute('in', 'SourceAlpha');
      feGaussianBlur.setAttribute('stdDeviation', '1');
      
      const feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
      feOffset.setAttribute('dx', '0.5');
      feOffset.setAttribute('dy', '0.5');
      feOffset.setAttribute('result', 'offsetBlur');
      
      const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
      feFlood.setAttribute('flood-color', '#000000');
      feFlood.setAttribute('flood-opacity', '0.3');
      
      const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
      feComposite.setAttribute('in2', 'offsetBlur');
      feComposite.setAttribute('operator', 'in');
      
      const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
      const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
      const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
      feMergeNode2.setAttribute('in', 'SourceGraphic');
      
      feMerge.appendChild(feMergeNode1);
      feMerge.appendChild(feMergeNode2);
      
      darkFilter.appendChild(feGaussianBlur);
      darkFilter.appendChild(feOffset);
      darkFilter.appendChild(feFlood);
      darkFilter.appendChild(feComposite);
      darkFilter.appendChild(feMerge);
      defs.appendChild(darkFilter);
    }
    
    // 浅色模式文字阴影
    if (!defs.querySelector('#text-shadow-light')) {
      const lightFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      lightFilter.setAttribute('id', 'text-shadow-light');
      lightFilter.setAttribute('x', '-50%');
      lightFilter.setAttribute('y', '-50%');
      lightFilter.setAttribute('width', '200%');
      lightFilter.setAttribute('height', '200%');
      
      const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
      feGaussianBlur.setAttribute('in', 'SourceAlpha');
      feGaussianBlur.setAttribute('stdDeviation', '0.5');
      
      const feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
      feOffset.setAttribute('dx', '0.3');
      feOffset.setAttribute('dy', '0.3');
      feOffset.setAttribute('result', 'offsetBlur');
      
      const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
      feFlood.setAttribute('flood-color', '#ffffff');
      feFlood.setAttribute('flood-opacity', '0.5');
      
      const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
      feComposite.setAttribute('in2', 'offsetBlur');
      feComposite.setAttribute('operator', 'in');
      
      const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
      const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
      const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
      feMergeNode2.setAttribute('in', 'SourceGraphic');
      
      feMerge.appendChild(feMergeNode1);
      feMerge.appendChild(feMergeNode2);
      
      lightFilter.appendChild(feGaussianBlur);
      lightFilter.appendChild(feOffset);
      lightFilter.appendChild(feFlood);
      lightFilter.appendChild(feComposite);
      lightFilter.appendChild(feMerge);
      defs.appendChild(lightFilter);
    }
  }

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
        // 文本颜色 - 增强对比度
        primaryTextColor: isDark ? '#ffffff' : '#1a1a1a',
        secondaryTextColor: isDark ? '#e0e0e0' : '#2a2a2a',
        tertiaryTextColor: isDark ? '#d0d0d0' : '#3a3a3a',
        textColor: isDark ? '#ffffff' : '#1a1a1a',
        // 箭头颜色
        mainBkg: isDark ? '#2d2d2d' : '#ffffff',
        // 字体大小 - 增大以提高可读性
        fontSize: '16px',
        primaryFontSize: '16px',
        secondaryFontSize: '14px',
        tertiaryFontSize: '13px',
      },
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
        fontSize: 14,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        numberSectionStyles: 4,
        axisFormat: '%Y-%m-%d',
        useMaxWidth: false,
      }
    });
  }

  // 渲染 Mermaid 图表
  async function renderMermaidDiagrams() {
    const wrappers = document.querySelectorAll('.mermaid-wrapper');
    const isDark = document.body.classList.contains('vscode-dark');
    
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
          
          // 优化文字可读性：增大字体、增强对比度
          enhanceMermaidTextReadability(svgElement, isDark);
          
          // 设置初始缩放和位置
          setupMermaidInteractivity(wrapper, svgElement);
        }
      } catch (err) {
        // 改进错误提示，显示更详细的信息
        const errorMsg = err.message || 'Unknown error';
        const errorLine = errorMsg.match(/line (\d+)/i);
        const lineInfo = errorLine ? ` (Line ${errorLine[1]})` : '';
        mermaidDiv.innerHTML = `<div style="padding: 20px; color: #d73a49; background: #ffeef0; border-radius: 6px; font-size: 14px; line-height: 1.6;">
          <strong>Mermaid Render Error:</strong><br>
          ${escapeHtml(errorMsg)}${lineInfo}<br><br>
          <details style="margin-top: 10px;">
            <summary style="cursor: pointer; color: #0366d6;">查看源代码</summary>
            <pre style="margin-top: 10px; padding: 10px; background: #fff; border: 1px solid #e1e4e8; border-radius: 4px; overflow-x: auto; font-size: 12px;">${escapeHtml(code)}</pre>
          </details>
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

