import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const provider = new MCMarkdownPreviewProvider(context.extensionUri, context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'mcMarkdownPreview',
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    )
  );

  const disposable = vscode.commands.registerCommand(
    'mcMarkdown.openPreview',
    () => {
      MCMarkdownPreviewPanel.createOrShow(context.extensionUri);
    }
  );

  context.subscriptions.push(disposable);

  // 监听活动编辑器变化，自动更新预览
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === 'markdown') {
        provider.updatePreview(editor.document);
      }
    })
  );

  // 监听文档变化
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.languageId === 'markdown') {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document === e.document) {
          provider.updatePreview(e.document);
        }
      }
    })
  );
}

class MCMarkdownPreviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'mcMarkdownPreview';

  private _view?: vscode.WebviewView;
  private _disposables: vscode.Disposable[] = [];

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // 初始化时更新预览
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.languageId === 'markdown') {
      this.updatePreview(activeEditor.document);
    }

    // 监听主题变化
    this._disposables.push(
      vscode.window.onDidChangeActiveColorTheme(() => {
        if (this._view) {
          this._view.webview.html = this._getHtmlForWebview(this._view.webview);
          const activeEditor = vscode.window.activeTextEditor;
          if (activeEditor && activeEditor.document.languageId === 'markdown') {
            this.updatePreview(activeEditor.document);
          }
        }
      })
    );
  }

  public dispose() {
    this._disposables.forEach(d => d.dispose());
  }

  public updatePreview(document: vscode.TextDocument) {
    if (this._view) {
      this._view.webview.postMessage({
        command: 'update',
        content: document.getText(),
      });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // 获取 VSCode 主题
    const theme = vscode.window.activeColorTheme;
    const isDark = theme.kind === vscode.ColorThemeKind.Dark || theme.kind === vscode.ColorThemeKind.HighContrast;
    
    // 获取资源路径
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css')
    );
    const katexCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'katex.min.css')
    );
    const katexJsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'katex.min.js')
    );
    const mermaidUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'mermaid.min.js')
    );
    const markdownItUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'markdown-it.min.js')
    );
    const highlightJsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'highlight.min.js')
    );
    const highlightCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', isDark ? 'highlight-github-dark.min.css' : 'highlight-github.min.css')
    );

    // 使用非缩进 HTML 字符串
    return `<!DOCTYPE html>
<html lang="zh-CN" class="${isDark ? 'vscode-dark' : 'vscode-light'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${katexCssUri}" rel="stylesheet">
    <link href="${highlightCssUri}" rel="stylesheet">
    <link href="${styleUri}" rel="stylesheet">
    <title>MC Markdown Preview</title>
</head>
<body class="${isDark ? 'vscode-dark' : 'vscode-light'}">
    <div id="app" class="markdown-body"></div>
    <script src="${mermaidUri}"></script>
    <script src="${katexJsUri}"></script>
    <script src="${markdownItUri}"></script>
    <script src="${highlightJsUri}"></script>
    <script src="${scriptUri}"></script>
</body>
</html>`;
  }
}

class MCMarkdownPreviewPanel {
  public static currentPanel: MCMarkdownPreviewPanel | undefined;
  public static readonly viewType = 'mcMarkdownPreview';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (MCMarkdownPreviewPanel.currentPanel) {
      MCMarkdownPreviewPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      MCMarkdownPreviewPanel.viewType,
      vscode.l10n.t('preview.title'),
      column || vscode.ViewColumn.Two,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri],
        retainContextWhenHidden: true,
      }
    );

    MCMarkdownPreviewPanel.currentPanel = new MCMarkdownPreviewPanel(
      panel,
      extensionUri
    );
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // 监听文档变化
    vscode.workspace.onDidChangeTextDocument(
      (e) => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document === e.document) {
          this._update();
        }
      },
      null,
      this._disposables
    );

    // 监听主题变化
    vscode.window.onDidChangeActiveColorTheme(
      () => {
        this._update();
      },
      null,
      this._disposables
    );
  }

  private _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const activeEditor = vscode.window.activeTextEditor;
    const content = activeEditor?.document.getText() || '';

    // 获取 VSCode 主题
    const theme = vscode.window.activeColorTheme;
    const isDark = theme.kind === vscode.ColorThemeKind.Dark || theme.kind === vscode.ColorThemeKind.HighContrast;

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css')
    );
    const katexCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'katex.min.css')
    );
    const katexJsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'katex.min.js')
    );
    const mermaidUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'mermaid.min.js')
    );
    const markdownItUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'markdown-it.min.js')
    );
    const highlightJsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'highlight.min.js')
    );
    const highlightCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', isDark ? 'highlight-github-dark.min.css' : 'highlight-github.min.css')
    );

    return `<!DOCTYPE html>
<html lang="zh-CN" class="${isDark ? 'vscode-dark' : 'vscode-light'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${katexCssUri}" rel="stylesheet">
    <link href="${highlightCssUri}" rel="stylesheet">
    <link href="${styleUri}" rel="stylesheet">
    <title>MC Markdown Preview</title>
</head>
<body class="${isDark ? 'vscode-dark' : 'vscode-light'}">
    <div id="app" class="markdown-body"></div>
    <script>
        window.initialContent = ${JSON.stringify(content)};
    </script>
    <script src="${mermaidUri}"></script>
    <script src="${katexJsUri}"></script>
    <script src="${markdownItUri}"></script>
    <script src="${highlightJsUri}"></script>
    <script src="${scriptUri}"></script>
</body>
</html>`;
  }

  public dispose() {
    MCMarkdownPreviewPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
