// 项目档案一览弹窗组件
// 点击档案查询列表中项目名称时触发

function showProjectArchives(projectName) {
    var projectArchives = mockData.archives.filter(function(a) { return a.project === projectName; });
    var catTree = mockData.categoryTree;
    var count = projectArchives.length;
    if (count === 0) { alert('该项目暂无档案'); return; }

    // 确定企业名称（取第一条）
    var company = projectArchives[0].company;
    // 统计已归档数
    var archivedCount = projectArchives.filter(function(a) { return a.status === '已归档'; }).length;
    var statusText = archivedCount === count ? '已归档' : (archivedCount > 0 ? '部分归档' : '未归档');
    var statusClass = archivedCount === count ? 'pj-archived' : (archivedCount > 0 ? 'pj-partial' : 'pj-nofile');

    // 按一级分类渲染
    var cats = Object.keys(catTree);
    var bodyHtml = '';

    // 头部信息
    bodyHtml += '<div class="pj-header">';
    bodyHtml += '  <div class="pj-header-row"><span class="pj-label">企业名称</span><span class="pj-value">' + company + '</span><span class="pj-status-tag ' + statusClass + '">' + statusText + '</span></div>';
    bodyHtml += '  <div class="pj-header-row" style="margin-top:6px"><span class="pj-label">项目名称</span><span class="pj-value font-bold">' + projectName + '</span></div>';
    bodyHtml += '</div>';

    for (var ci = 0; ci < cats.length; ci++) {
        var cat = cats[ci];
        var subs = catTree[cat];
        // 检查该分类下是否有档案
        var hasItems = false;
        for (var si = 0; si < subs.length; si++) {
            var sub = subs[si];
            var items = projectArchives.filter(function(a) { return a.subCategory === sub; });
            if (items.length > 0) { hasItems = true; break; }
        }
        if (!hasItems) continue;

        bodyHtml += '<div class="pj-section-title">' + cat + '</div>';
        bodyHtml += '<table class="pj-table">';
        bodyHtml += '<thead><tr>';
        bodyHtml += '<th style="width:14%">分类</th>';
        bodyHtml += '<th style="width:26%">文件名</th>';
        bodyHtml += '<th style="width:14%">标签</th>';
        bodyHtml += '<th style="width:16%">历史版本记录</th>';
        bodyHtml += '<th style="width:16%">更新时间</th>';
        bodyHtml += '<th style="width:14%">权限</th>';
        bodyHtml += '</tr></thead><tbody>';

        for (var si = 0; si < subs.length; si++) {
            var sub = subs[si];
            var items = projectArchives.filter(function(a) { return a.subCategory === sub; });
            if (items.length === 0) {
                // 空分类显示一行
                bodyHtml += '<tr><td>' + sub + '</td><td colspan="5" class="pj-empty">暂无档案</td></tr>';
            } else {
                for (var ii = 0; ii < items.length; ii++) {
                    var a = items[ii];
                    bodyHtml += '<tr>';
                    if (ii === 0) {
                        bodyHtml += '<td rowspan="' + items.length + '" class="pj-subcat-cell">' + sub + '</td>';
                    }
                    // 文件名（可点击预览）
                    bodyHtml += '<td><a class="pj-link" href="javascript:void(0)" onclick="event.stopPropagation();showPreview(\'' + a.id + '\')">' + a.title + '</a></td>';
                    // 标签
                    bodyHtml += '<td>' + _pjTag(a) + '</td>';
                    // 历史版本记录
                    bodyHtml += '<td class="pj-history">' + _pjHistory(a) + '</td>';
                    // 更新时间
                    bodyHtml += '<td class="pj-time">' + (a.uploadTime || '-') + '</td>';
                    // 权限按钮
                    bodyHtml += '<td>' + _pjPermBtn(a) + '</td>';
                    bodyHtml += '</tr>';
                }
            }
        }
        bodyHtml += '</tbody></table>';
    }

    currentManageCompany = company;
    currentManageProject = projectName;
    bodyHtml += '<div class="pj-footer"><button class="btn-primary" onclick="closeModal();setTimeout(function(){navigate(\'archive-manage\')},100)" style="margin-right:8px">档案管理</button><button class="btn-default" onclick="closeModal()">关闭</button></div>';

    var wh = Math.min(window.innerHeight * 0.88, 680);
    var wd = Math.round(Math.min(wh * 1.618, 860));
    document.querySelector('.modal-box').classList.add('pj-modal');
    openModal('项目档案一览 - ' + projectName, bodyHtml, wd + 'px', wh + 'px');
}

// ---- 辅助函数 ----

function _pjTag(a) {
    if (a.status === '已归档') {
        // 从tags中取第一个有意义标签，或默认
        var t = a.tags && a.tags.length > 0 ? a.tags[0] : '批复成果';
        return '<span class="tag tag-success">' + t + '</span>';
    }
    return '<span class="tag tag-warning">申报材料</span>';
}

function _pjHistory(a) {
    // 模拟：部分文件有历史版本
    if (a.downloads > 50 || (a.id && parseInt(a.id.replace(/[^0-9]/g,'')) % 3 === 0)) {
        return '<a class="pj-link" href="javascript:void(0)" onclick="event.stopPropagation();alert(\'模拟：查看历史版本\')">查看</a>';
    }
    return '-';
}

function _pjPermBtn(a) {
    if (a.status === '已归档') {
        return '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();showPreview(\'' + a.id + '\')">查看</button>';
    }
    return '<button class="btn btn-orange btn-sm" onclick="event.stopPropagation();alert(\'模拟：申请权限\')">申请权限</button>';
}
