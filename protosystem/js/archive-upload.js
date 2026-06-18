// 上传档案弹窗组件
// 档案管理页面中点击"上传文件"时触发

function showArchiveUploadModal(company, project, category, subCategory) {
    var tagList = mockData.tags || ['重点项目','招商引资','政府投资','企业自筹','PPP项目','高新技术','节能环保','产业升级'];
    var bodyHtml = '<div class="space-y-4"><div class="bg-white rounded-lg shadow-sm border border-gray-100 p-5">';
    bodyHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

    // 企业名称（只读）
    bodyHtml += '<div><label class="text-xs text-gray-500 block mb-1">企业名称 <span class="text-red-500">*</span></label>';
    bodyHtml += '<input class="form-input text-sm bg-gray-100" value="' + company + '" readonly></div>';

    // 项目名称（只读）
    bodyHtml += '<div><label class="text-xs text-gray-500 block mb-1">项目名称 <span class="text-red-500">*</span></label>';
    bodyHtml += '<input class="form-input text-sm bg-gray-100" value="' + project + '" readonly></div>';

    // 一级分类（只读）
    bodyHtml += '<div><label class="text-xs text-gray-500 block mb-1">一级分类 <span class="text-red-500">*</span></label>';
    bodyHtml += '<input class="form-input text-sm bg-gray-100" value="' + category + '" readonly></div>';

    // 二级分类（只读）
    bodyHtml += '<div><label class="text-xs text-gray-500 block mb-1">二级分类 <span class="text-red-500">*</span></label>';
    bodyHtml += '<input class="form-input text-sm bg-gray-100" value="' + subCategory + '" readonly></div>';

    // 档案标签
    bodyHtml += '<div><label class="text-xs text-gray-500 block mb-1">档案标签</label>';
    bodyHtml += '<div class="flex flex-wrap gap-1.5">' + tagList.map(function(t) { return '<label class="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-50"><input type=checkbox> ' + t + '</label>'; }).join('') + '</div></div>';

    // 文件上传
    bodyHtml += '<div><label class="text-xs text-gray-500 block mb-1">文件上传 <span class="text-red-500">*</span></label>';
    bodyHtml += '<div class="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-300">';
    bodyHtml += '<i class="fa-solid fa-cloud-arrow-up text-2xl text-gray-300"></i>';
    bodyHtml += '<p class="text-xs text-gray-400 mt-1">点击或拖拽上传</p></div></div>';

    bodyHtml += '</div>'; // end grid

    // 已上传文件列表
    bodyHtml += '<div class="mt-4 space-y-1.5">';
    bodyHtml += '<div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-xs">';
    bodyHtml += '<div class="flex items-center gap-2"><i class="fa-regular fa-file-pdf text-red-400"></i><span>模拟文件.pdf</span><span class="text-gray-400">1.2MB</span></div>';
    bodyHtml += '<div class="flex items-center gap-3">';
    bodyHtml += '<select class="text-xs border border-gray-200 rounded px-1 py-0.5"><option>所有人可见</option><option>仅管理员</option><option>指定用户</option></select>';
    bodyHtml += '<button class="text-red-400 hover:text-red-600"><i class="fa-solid fa-xmark"></i></button></div></div></div>';

    // 按钮（居中对齐）
    bodyHtml += '<div class="mt-5 flex justify-center gap-3">';
    bodyHtml += '<button class="btn-primary px-6"><i class="fa-solid fa-upload mr-1"></i>提交</button>';
    bodyHtml += '<button class="btn-default" onclick="closeModal()"><i class="fa-solid fa-times mr-1"></i>取消</button>';
    bodyHtml += '</div></div></div>';

    openModal('上传档案', bodyHtml, '780px', '482px');
}
