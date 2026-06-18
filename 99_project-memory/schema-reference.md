# 数据结构速查

> 当前为原型 Mock 数据阶段，无真实数据库。以下为原型中使用的 Mock 数据结构和业务对象定义。

## 1. 档案（Archive）

原型中 `mockData.archives` 数组包含约 140 条档案记录。

```javascript
{
  id: 'DA-2026-0001',    // 档案编号
  fileType: 'PDF',       // 文件类型: PDF / Word / Excel / Image
  title: '立项批复文件', // 文件名称
  project: '年产1000万套智能终端生产线建设项目',  // 项目名称
  company: '湖南比亚迪电子有限公司',  // 企业名称
  category: '规划资料',  // 一级分类
  subCategory: '立项备案', // 二级分类
  tags: ['重点项目'],    // 标签数组
  status: '已归档',      // 状态: 已归档 / 审核中
  uploader: '李强',      // 上传人
  uploadTime: '2026-02-02', // 上传时间
  views: 156,            // 查看次数
  downloads: 89          // 下载次数
}
```

### 文件类型枚举

| fileType | 对应示例文件 |
|----------|-------------|
| PDF | `demo/demo.pdf` |
| Word | `demo/demo.docx` |
| Excel | `demo/demo.xlsx` |
| Image | `demo/demo.png` |

### 状态枚举

| 状态 | 含义 | 标签颜色 |
|------|------|----------|
| 已归档 | 审批通过 | 绿色（`.tag-success`） |
| 审核中 | 待处理/审批中 | 橙色（`.tag-warning`） |

## 2. 分类体系

原型中 `mockData.categoryTree` 定义：

```javascript
{
  '规划资料': ['立项备案', '用地许可', '总图', '规划许可'],
  '建设资料': ['施工图审查', '施工许可', '其他']
}
```

## 3. 企业

原型中 `mockData.companies` 包含企业列表，用于搜索下拉和 Mock 数据生成。示例：

```javascript
['湖南比亚迪电子有限公司', '长沙晟通科技有限公司', ...]
```

## 4. 项目

原型中 `mockData.projects` 包含项目列表，用于搜索筛选。示例：

```javascript
['年产1000万套智能终端生产线建设项目', ...]
```

## 5. 标签

原型中 `mockData.tags` 包含全局标签列表。示例：

```javascript
['重点项目', '招商引资', '政府投资', '企业自筹', 'PPP项目', '高新技术', '节能环保', '产业升级']
```

## 6. 文件格式映射

预览功能中文件类型到示例文件的映射：

```javascript
const fileMap = { 'PDF': 'demo.pdf', 'Word': 'demo.docx', 'Excel': 'demo.xlsx' };
const fallback = 'demo.png';  // Image 或其他格式
```

## 7. 弹窗组件

| 弹窗 | 组件文件 | 触发函数 |
|------|----------|----------|
| 项目档案一览 | `js/project-archives.js` | `showProjectArchives(projectName)` |
| 推送 | `js/push-dialog.js` | `showPushModal(archiveId)` |
| 预览 | 内联在 `index.html` | `showPreview(archiveId)` / `showPreviewList(archive)` |
| 通用 | 全局 modal | `openModal(title, bodyHtml, width, height)` |

### 弹窗 CSS 结构

```html
<div class="modal-overlay" id="global-modal">
  <div class="modal-box p-0">
    <div class="flex ... px-6 py-4 border-b ...">  <!-- 标题栏（固定） -->
      <h3 id="modal-title">标题</h3>
      <button onclick="closeModal()">×</button>
    </div>
    <div class="px-6 py-4" id="modal-body">  <!-- 内容区（滚动） -->
      ...bodyHtml...
    </div>
  </div>
</div>
```
