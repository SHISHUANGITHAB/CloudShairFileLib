# 构建规则

> ⚠️ **两阶段说明**：第一阶段（原型系统）的构建规则仅适用于 HTML 原型阶段。
> 第二阶段（正式系统）将使用完全不同的技术栈和构建流程，
> **原型阶段的知识和规则不直接适用于第二阶段**。

---

## 第一阶段：原型构建（当前阶段）

原型为纯前端 HTML 文件，无构建工具链，可直接修改浏览器刷新。

### 原型文件结构

```
protosystem/
├── index.html                 # 主页面（内联 CSS + 页面渲染函数 + Mock 数据）
├── js/
│   ├── project-archives.js    # 项目档案一览弹窗组件
│   └── push-dialog.js         # 推送弹窗组件
└── demo/
    └── demo.pdf / .docx / .xlsx / .png
```

### 原型修改规范

#### HTML 编写

- `onClick` 属性中禁止嵌入 `renderXxx(a)` 的 HTML 输出，改用辅助函数传 ID
- 弹窗使用全局 `openModal(title, bodyHtml, width, height)` / `closeModal()` 函数
- 弹窗滚动由 `#modal-body` 控制（CSS: `overflow-y: auto; flex: 1; min-height: 0`）
- `.modal-box` 使用 flex 布局（`display: flex; flex-direction: column`）
- 标题栏固定在弹窗顶部，不参与滚动

#### 外部依赖

| 资源 | 用途 | ⚠️ 注意 |
|------|------|----------|
| Tailwind CSS（CDN） | UI 样式 | **禁止用于正式系统** |
| FontAwesome 6.4（CDN） | 图标 | 正式系统应替换为本地资源 |

#### 弹窗组件开发

- 独立 JS 文件放 `js/` 目录，通过 `<script src="...">` 引用
- 必要时加版本号参数（`?v=2`）绕过浏览器缓存
- 关闭弹窗时需清理额外添加的 CSS class（如 `pj-modal`）

### 备份策略

- 修改前备份：`cp index.html index.html.v{N}`
- 所有备份文件（`.bak`、`.keep`、`.v*`、`js/*.bak`、`js/*.v*`）均在 `.gitignore` 中排除
- 备份**不提交到 GitHub**，仅本地保留
- **部署前整体打包**：运行 `bash protosystem/backup.sh`，全量备份 `protosystem/` 工作文件至 `backups/` 目录，保留最近 5 份

### 本地开发服务器

```bash
# 原型页面（端口 9901）
cd /mnt/c/SSDATA/望城经开区/CloudShairFileLib
python3 -m http.server 9901

# 文件预览源（端口 9000，供 KKFileView 拉取文件）
cd /mnt/c/SSDATA/望城经开区/CloudShairFileLib/protosystem
python3 -m http.server 9000
```

---

## 第二阶段：正式系统构建（规划中）

> 正式系统开发启动后，此文件将增加正式的构建规则。
> 构建方式参考信用数智系统（`credit_system_admin` 的 Maven 构建 + `credit_system_pc` 的 Vite 构建）。

### 预期构建流程

```bash
# 后端构建（参考信用数智系统）
cd 第二阶段源码/credit_archive_admin
mvn clean package -DskipTests -pl ruoyi-admin -am

# 前端构建（参考信用数智系统）
cd 第二阶段源码/credit_archive_pc
npm run build:prod
# 产物: dist/
```

### 原型与正式系统的关键区别

| 维度 | 原型系统 | 正式系统 |
|------|----------|----------|
| 构建方式 | 无（直接改 HTML） | Maven + Vite |
| 语言 | HTML / JS | Java 8 + Vue 3 |
| 框架 | 原生 | RuoYi 3.9.1 + Spring Boot 2.5.x |
| 数据 | Mock 数据（硬编码） | 达梦 / MySQL + 后端 API |
| 依赖管理 | CDN 外链 | npm + Maven 本地仓库 |
| 部署产物 | 单 HTML 文件 | JAR + dist 目录 |
| 修改生效 | 浏览器 F5 刷新 | 需重新构建 + 部署容器 |

> 两阶段的构建方式完全不同，**原型阶段的修改经验不能直接套用到正式系统上**。
