// 望城经开区组织架构树（推送范围选择用）
const _orgTree = [
  {id:'bgs',name:'办公室',children:[]},
  {id:'cyfzj',name:'产业发展局',children:[
    {id:'cyghk',name:'产业规划科'},
    {id:'jyyxk',name:'经济运行科'}
  ]},
  {id:'ghjsj',name:'规划建设局',children:[
    {id:'ghglk',name:'规划管理科'},
    {id:'jsglk',name:'建设管理科'}
  ]},
  {id:'czjrj',name:'财政金融局',children:[
    {id:'ysk',name:'预算科'},
    {id:'gkk',name:'国库科'}
  ]},
  {id:'jjhzj',name:'经济合作局（招商局）',children:[]},
  {id:'xzspj',name:'行政审批局',children:[]},
  {id:'shswj',name:'社会事务局',children:[]},
  {id:'scjdglj',name:'市场监督管理局',children:[]},
  {id:'swj',name:'税务局',children:[]},
  {id:'xxzx',name:'信息中心',children:[]},
  {id:'zhzf',name:'综合执法局',children:[]}
];
let _pushTargetDepts = [];

function _renderTreeHtml(nodes, depth) {
  let html = '';
  const indent = depth * 20;
  nodes.forEach(function(n) {
    html += '<div style="padding-left:'+indent+'px" class="flex items-center gap-1 py-0.5">';
    html += '<input type="checkbox" class="dept-check" data-dept-id="'+n.id+'" data-dept-name="'+n.name+'">';
    html += '<span class="text-sm text-gray-700">'+n.name+'</span>';
    html += '</div>';
    if (n.children && n.children.length > 0) {
      html += _renderTreeHtml(n.children, depth + 1);
    }
  });
  return html;
}
function _renderPushRightPanel() {
  if (_pushTargetDepts.length === 0) {
    return '<div class="text-xs text-gray-400 text-center py-4">暂无选择</div>';
  }
  let html = '';
  _pushTargetDepts.forEach(function(d) {
    html += '<div class="flex items-center justify-between py-1.5 px-2 bg-blue-50 rounded mb-1">';
    html += '<span class="text-sm text-gray-700">'+d.name+'</span>';
    html += '<span class="push-remove-btn" onclick="_removePushDept(\''+d.id+'\')">✕</span>';
    html += '</div>';
  });
  return html;
}
function _removePushDept(id) {
  _pushTargetDepts = _pushTargetDepts.filter(function(d) { return d.id !== id; });
  const el = document.getElementById('push-right-panel');
  if (el) el.innerHTML = _renderPushRightPanel();
}
function _moveToPushTarget() {
  const checks = document.querySelectorAll('.dept-check:checked');
  checks.forEach(function(c) {
    const id = c.getAttribute('data-dept-id');
    const name = c.getAttribute('data-dept-name');
    let found = false;
    for (let i = 0; i < _pushTargetDepts.length; i++) {
      if (_pushTargetDepts[i].id === id) { found = true; break; }
    }
    if (!found) _pushTargetDepts.push({id:id, name:name});
    c.checked = false;
  });
  const el = document.getElementById('push-right-panel');
  if (el) el.innerHTML = _renderPushRightPanel();
}
function _renderPushSelector() {
  return '<div class="push-selector">' +
    '<div class="push-left">' + _renderTreeHtml(_orgTree, 0) + '</div>' +
    '<div class="push-middle"><button class="push-arrow-btn" onclick="_moveToPushTarget()">→</button></div>' +
    '<div class="push-right" id="push-right-panel">' + _renderPushRightPanel() + '</div>' +
    '</div>';
}
function _renderPushBottomBar() {
  return '<div class="pt-3 border-t border-gray-100 flex items-center justify-between">' +
    '<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked><span class="text-sm text-gray-600">是否短信推送</span></label>' +
    '<div class="flex gap-2"><button class="btn-primary" onclick="closeModal()">推送</button><button class="btn-default" onclick="closeModal()">取消</button></div>' +
    '</div>';
}
function _buildPushDialogHtml(selectedHtml) {
  _pushTargetDepts = [];
  return (selectedHtml || '') +
    '<p class="text-sm font-medium mb-2 mt-3">推送范围：</p>' +
    _renderPushSelector() +
    _renderPushBottomBar();
}

// 批量推送弹窗
function showBatchPushModal() {
    const count = selectedPushArchives.size;
    if (count === 0) { alert('请先勾选需要推送的档案'); return; }
    const selected = mockData.archives.filter(a => selectedPushArchives.has(a.id));
    const listHtml = selected.map(a => '<div class="text-xs py-1 border-b border-gray-50">' + a.title + '（' + a.company + '）</div>').join('');
    const selectedHtml = '<p class="text-sm font-medium mb-2">已选择 <span class="text-blue-500">' + count + '</span> 条档案信息推送：</p><div class="max-h-32 overflow-y-auto bg-gray-50 rounded p-2 mb-3">' + listHtml + '</div>';
    const wh = Math.min(window.innerHeight * 0.78, 720);
    const wd = Math.round(Math.min(wh * 1.618, 700));
    openModal('批量推送', _buildPushDialogHtml(selectedHtml), wd + 'px', wh + 'px');
}

// 单条推送弹窗
function showPushModal(id) {
    const wh = Math.min(window.innerHeight * 0.78, 720);
    const wd = Math.round(Math.min(wh * 1.618, 700));
    var selectedHtml = '';
    if (id) {
        var a = mockData.archives.find(function(x) { return x.id === id; });
        if (a) selectedHtml = '<p class="text-sm font-medium mb-2">已选择 <span class="text-blue-500">1</span> 条档案信息推送：</p><div class="max-h-32 overflow-y-auto bg-gray-50 rounded p-2 mb-3"><div class="text-xs py-1 border-b border-gray-50">' + a.title + '（' + a.company + '）</div></div>';
    }
    openModal('推送档案', _buildPushDialogHtml(selectedHtml), wd + 'px', wh + 'px');
}
