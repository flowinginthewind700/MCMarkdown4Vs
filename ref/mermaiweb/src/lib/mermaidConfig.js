"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleTemplates = exports.defaultMermaidCode = exports.initializeMermaid = exports.mermaidThemes = void 0;
const mermaid_1 = __importDefault(require("mermaid"));
exports.mermaidThemes = [
    {
        name: 'modern-blue',
        config: {
            theme: 'base',
            themeVariables: {
                primaryColor: '#60a5fa',
                primaryTextColor: '#1e3a8a',
                primaryBorderColor: '#3b82f6',
                lineColor: '#64748b',
                secondaryColor: '#38bdf8',
                secondaryTextColor: '#0c4a6e',
                secondaryBorderColor: '#0ea5e9',
                tertiaryColor: '#a78bfa',
                tertiaryTextColor: '#4c1d95',
                tertiaryBorderColor: '#8b5cf6',
                background: '#ffffff',
                mainBkg: '#dbeafe',
                secondBkg: '#bfdbfe',
                tertiaryBkg: '#93c5fd',
                nodeBorder: '#2563eb',
                clusterBkg: '#eff6ff',
                clusterBorder: '#3b82f6',
                defaultLinkColor: '#475569',
                titleColor: '#1e293b',
                edgeLabelBackground: '#ffffff',
                actorBorder: '#2563eb',
                actorBkg: '#dbeafe',
                actorTextColor: '#1e3a8a',
                actorLineColor: '#64748b',
                signalColor: '#1e293b',
                signalTextColor: '#1e293b',
                labelBoxBkgColor: '#dbeafe',
                labelBoxBorderColor: '#2563eb',
                labelTextColor: '#1e3a8a',
                noteTextColor: '#1e3a8a',
                noteBkgColor: '#dbeafe',
                noteBorderColor: '#2563eb',
                fontSize: '16px',
            },
        },
    },
    {
        name: 'vibrant-purple',
        config: {
            theme: 'base',
            themeVariables: {
                primaryColor: '#c084fc',
                primaryTextColor: '#581c87',
                primaryBorderColor: '#a855f7',
                lineColor: '#64748b',
                secondaryColor: '#f0abfc',
                secondaryTextColor: '#831843',
                secondaryBorderColor: '#ec4899',
                tertiaryColor: '#fbbf24',
                tertiaryTextColor: '#78350f',
                tertiaryBorderColor: '#f59e0b',
                background: '#ffffff',
                mainBkg: '#f3e8ff',
                secondBkg: '#e9d5ff',
                tertiaryBkg: '#d8b4fe',
                nodeBorder: '#9333ea',
                clusterBkg: '#faf5ff',
                clusterBorder: '#a855f7',
                defaultLinkColor: '#475569',
                titleColor: '#1e293b',
                edgeLabelBackground: '#ffffff',
                actorBorder: '#9333ea',
                actorBkg: '#f3e8ff',
                actorTextColor: '#581c87',
                actorLineColor: '#64748b',
                signalColor: '#1e293b',
                signalTextColor: '#1e293b',
                labelBoxBkgColor: '#f3e8ff',
                labelBoxBorderColor: '#9333ea',
                labelTextColor: '#581c87',
                noteTextColor: '#581c87',
                noteBkgColor: '#f3e8ff',
                noteBorderColor: '#9333ea',
                fontSize: '16px',
            },
        },
    },
    {
        name: 'emerald-green',
        config: {
            theme: 'base',
            themeVariables: {
                primaryColor: '#6ee7b7',
                primaryTextColor: '#064e3b',
                primaryBorderColor: '#10b981',
                lineColor: '#64748b',
                secondaryColor: '#5eead4',
                secondaryTextColor: '#134e4a',
                secondaryBorderColor: '#14b8a6',
                tertiaryColor: '#7dd3fc',
                tertiaryTextColor: '#0c4a6e',
                tertiaryBorderColor: '#0ea5e9',
                background: '#ffffff',
                mainBkg: '#d1fae5',
                secondBkg: '#a7f3d0',
                tertiaryBkg: '#6ee7b7',
                nodeBorder: '#059669',
                clusterBkg: '#ecfdf5',
                clusterBorder: '#10b981',
                defaultLinkColor: '#475569',
                titleColor: '#1e293b',
                edgeLabelBackground: '#ffffff',
                actorBorder: '#059669',
                actorBkg: '#d1fae5',
                actorTextColor: '#064e3b',
                actorLineColor: '#64748b',
                signalColor: '#1e293b',
                signalTextColor: '#1e293b',
                labelBoxBkgColor: '#d1fae5',
                labelBoxBorderColor: '#059669',
                labelTextColor: '#064e3b',
                noteTextColor: '#064e3b',
                noteBkgColor: '#d1fae5',
                noteBorderColor: '#059669',
                fontSize: '16px',
            },
        },
    },
    {
        name: 'sunset-orange',
        config: {
            theme: 'base',
            themeVariables: {
                primaryColor: '#fdba74',
                primaryTextColor: '#7c2d12',
                primaryBorderColor: '#f97316',
                lineColor: '#64748b',
                secondaryColor: '#fca5a5',
                secondaryTextColor: '#7f1d1d',
                secondaryBorderColor: '#ef4444',
                tertiaryColor: '#fde047',
                tertiaryTextColor: '#713f12',
                tertiaryBorderColor: '#eab308',
                background: '#ffffff',
                mainBkg: '#fed7aa',
                secondBkg: '#fdba74',
                tertiaryBkg: '#fb923c',
                nodeBorder: '#ea580c',
                clusterBkg: '#fff7ed',
                clusterBorder: '#f97316',
                defaultLinkColor: '#475569',
                titleColor: '#1e293b',
                edgeLabelBackground: '#ffffff',
                actorBorder: '#ea580c',
                actorBkg: '#fed7aa',
                actorTextColor: '#7c2d12',
                actorLineColor: '#64748b',
                signalColor: '#1e293b',
                signalTextColor: '#1e293b',
                labelBoxBkgColor: '#fed7aa',
                labelBoxBorderColor: '#ea580c',
                labelTextColor: '#7c2d12',
                noteTextColor: '#7c2d12',
                noteBkgColor: '#fed7aa',
                noteBorderColor: '#ea580c',
                fontSize: '16px',
            },
        },
    },
    {
        name: 'dark-mode',
        config: {
            theme: 'dark',
            themeVariables: {
                primaryColor: '#1e40af',
                primaryTextColor: '#e0e7ff',
                primaryBorderColor: '#3b82f6',
                lineColor: '#94a3b8',
                secondaryColor: '#6d28d9',
                secondaryTextColor: '#ede9fe',
                secondaryBorderColor: '#8b5cf6',
                tertiaryColor: '#0e7490',
                tertiaryTextColor: '#cffafe',
                tertiaryBorderColor: '#06b6d4',
                background: '#0f172a',
                mainBkg: '#1e293b',
                secondBkg: '#334155',
                tertiaryBkg: '#475569',
                nodeBorder: '#60a5fa',
                clusterBkg: '#1e293b',
                clusterBorder: '#3b82f6',
                defaultLinkColor: '#94a3b8',
                titleColor: '#f1f5f9',
                edgeLabelBackground: '#1e293b',
                actorBorder: '#60a5fa',
                actorBkg: '#1e293b',
                actorTextColor: '#e0e7ff',
                actorLineColor: '#94a3b8',
                signalColor: '#e2e8f0',
                signalTextColor: '#e2e8f0',
                labelBoxBkgColor: '#1e293b',
                labelBoxBorderColor: '#60a5fa',
                labelTextColor: '#e0e7ff',
                noteTextColor: '#e0e7ff',
                noteBkgColor: '#1e293b',
                noteBorderColor: '#60a5fa',
                fontSize: '16px',
            },
        },
    },
    {
        name: 'minimal-gray',
        config: {
            theme: 'base',
            themeVariables: {
                primaryColor: '#cbd5e1',
                primaryTextColor: '#1e293b',
                primaryBorderColor: '#64748b',
                lineColor: '#94a3b8',
                secondaryColor: '#e2e8f0',
                secondaryTextColor: '#334155',
                secondaryBorderColor: '#94a3b8',
                tertiaryColor: '#f1f5f9',
                tertiaryTextColor: '#475569',
                tertiaryBorderColor: '#cbd5e1',
                background: '#ffffff',
                mainBkg: '#f1f5f9',
                secondBkg: '#e2e8f0',
                tertiaryBkg: '#cbd5e1',
                nodeBorder: '#475569',
                clusterBkg: '#f8fafc',
                clusterBorder: '#64748b',
                defaultLinkColor: '#64748b',
                titleColor: '#1e293b',
                edgeLabelBackground: '#ffffff',
                actorBorder: '#475569',
                actorBkg: '#f1f5f9',
                actorTextColor: '#1e293b',
                actorLineColor: '#94a3b8',
                signalColor: '#1e293b',
                signalTextColor: '#1e293b',
                labelBoxBkgColor: '#f1f5f9',
                labelBoxBorderColor: '#475569',
                labelTextColor: '#1e293b',
                noteTextColor: '#1e293b',
                noteBkgColor: '#f1f5f9',
                noteBorderColor: '#475569',
                fontSize: '16px',
            },
        },
    },
];
const initializeMermaid = (themeName = 'modern-blue') => {
    const selectedTheme = exports.mermaidThemes.find((t) => t.name === themeName) || exports.mermaidThemes[0];
    mermaid_1.default.initialize({
        startOnLoad: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        theme: selectedTheme.config.theme,
        securityLevel: 'loose',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        themeVariables: selectedTheme.config.themeVariables,
        flowchart: {
            curve: 'basis',
            padding: 20,
            nodeSpacing: 80,
            rankSpacing: 80,
            diagramPadding: 20,
            useMaxWidth: true,
            htmlLabels: true,
        },
    });
};
exports.initializeMermaid = initializeMermaid;
exports.defaultMermaidCode = `graph TD
    A[Start] --> B{Need Help?}
    B -->|Yes| C[Read Docs]
    B -->|No| D[Start Using]
    C --> E[Create Diagram]
    D --> E
    E --> F[Export Image]
    F --> G[Done]`;
exports.exampleTemplates = [
    {
        name: '流程图', // Key used for translation lookup
        code: `graph TD
    A[Start] --> B{Condition}
    B -->|Yes| C[Action A]
    B -->|No| D[Action B]
    C --> E[End]
    D --> E`,
    },
    {
        name: '序列图',
        code: `sequenceDiagram
    participant User
    participant System
    participant Database
    User->>System: Send Request
    System->>Database: Query Data
    Database-->>System: Return Results
    System-->>User: Show Data`,
    },
    {
        name: '类图',
        code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
    },
    {
        name: '状态图',
        code: `stateDiagram-v2
    [*] --> Pending
    Pending --> Processing: Start
    Processing --> Completed: Success
    Processing --> Failed: Error
    Failed --> Pending: Retry
    Completed --> [*]`,
    },
    {
        name: '甘特图',
        code: `gantt
    title Project Plan
    dateFormat YYYY-MM-DD
    section Design
    Requirements      :a1, 2024-01-01, 7d
    UI Design         :a2, after a1, 5d
    section Development
    Frontend          :b1, after a2, 10d
    Backend           :b2, after a2, 12d
    section Testing
    Functional        :c1, after b1, 5d
    Integration       :c2, after b2, 3d`,
    },
];
//# sourceMappingURL=mermaidConfig.js.map