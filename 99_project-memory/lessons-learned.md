# 经验教训

> 本文件记录项目过程中踩过的所有坑，供后续参考。**禁止重复犯已记录的错误。**
> 按日期倒序排列。

---

## 1. patch 工具参数顺序不可颠倒（2026-06-16）

**场景**：修改原型预览 URL 时，调用 `patch(path, new_string, old_string)` 将 `new_string` 和 `old_string` 传反，导致本地文件未被修改，部署到服务器后预览仍指向本地地址。

**教训**：`patch(path, old_string, new_string)` — old_string 在前（待查找），new_string 在后（替换值）。与直觉相反，务必确认。

**对策**：
```python
patch(path,
    "旧的文本",  # 先：待查找的旧内容
    "新的文本")  # 后：替换的新内容
```

## 2. position: sticky 与负 margin 不兼容（2026-06-14）

**场景**：给 `.pj-header` 设置 `position: sticky` 和 `margin-top: -16px` 以抵消父容器 padding，但负 margin 在 sticky 元素上不生效。

**教训**：CSS `position: sticky` 元素的 margin 计算与普通流不同。负 margin 在 sticky 元素上可能被忽略或表现异常。

**对策**：改用父容器的 `padding-top: 0`（通过额外 CSS class 控制），sticky 元素设 `margin: 0`，不依赖负 margin 来定位。

## 3. CSS :has() 选择器 + Tailwind CDN 优先级陷阱（2026-06-14）

**场景**：用 `.modal-box:has(.pj-header) > div:first-child { padding-bottom: 0 }` 控制弹窗标题栏间距，但未生效。

**教训**：Tailwind CDN 注入的样式表在 DOM 加载完成后才加载，且 `:has()` 与 Tailwind 生成的 `.py-4` class 之间的优先级受加载顺序影响。

**对策**：用 JS 添加/移除 CSS class（`pj-modal`），配合 `!important` 或更高优先级选择器，避免依赖 `:has()` 做运行时样式控制。

## 4. 浏览器缓存 JS 文件导致修改不生效（2026-06-14）

**场景**：修改了 `project-archives.js` 后刷新页面，代码未更新。通过 `showProjectArchives.toString()` 检查发现浏览器加载的是旧版本。

**教训**：浏览器会缓存独立 JS 文件，即使 HTML 页面已刷新。HTML 页面因 Tailwind CDN 的进度条提示而实时更新，但 JS 文件不会。

**对策**：修改 JS 文件后，在 `<script src="...">` 中加版本号参数（`?v=2`），或使用 DevTools 禁用缓存。
