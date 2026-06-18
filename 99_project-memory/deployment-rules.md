# 部署规则

> ⚠️ 第一阶段（原型系统）和第二阶段的部署环境、架构完全不同，两阶段部署规则**互不适用**。

---

## 第一阶段：原型系统部署（当前）

原型已部署到演示服务器，仅供展示和需求确认。

### 演示服务器信息

| 项目 | 值 |
|------|-----|
| 地址 | 183.215.41.66 |
| SSH 端口 | **8028** |
| 用户 | wongxin |
| 密码 | Wx2a9Svr |
| **用途** | ⚠️ 仅原型演示，不是正式系统 |

### 容器架构

```
原型 Nginx (protosystem) :9598       ← 纯静态文件
  └── /usr/share/nginx/html/ ← /home/wongxin/protosystem/
       ├── index.html        # 原型主页
       ├── js/               # JS 组件
       └── demo/             # 示例文件

KKFileView (kkfileview) :8012         ← 文件预览引擎
  └── keking/kkfileview:latest
```

### 部署流程

```bash
# 1. SSH 连接
ssh -p 8028 wongxin@183.215.41.66

# 2. 上传文件（仅 protosystem/ 下工作文件，不含备份）
scp -P 8028 protosystem/index.html wongxin@183.215.41.66:~/protosystem/

# 3. 重启 nginx 使新文件生效
docker restart protosystem

# 4. 验证
curl -s -o /dev/null -w '%{http_code}' http://localhost:9598/index.html
```

### 预览地址配置说明

原型中有 3 处硬编码的预览 URL，部署前必须全部更新为对应服务器地址：

| 位置 | 原型本地 | 演示服务器 |
|------|----------|------------|
| `showPreview()` 文件 URL | `host.docker.internal:9000` | `183.215.41.66:9598` |
| `showPreview()` KKFileView | `localhost:8012` | `183.215.41.66:8012` |
| 内联预览按钮 | 同上 | 同上 |

### 容器管理命令

```bash
# 启动原型 nginx
docker run -d --name protosystem --restart unless-stopped \
  -p 9598:80 \
  -v /home/wongxin/protosystem:/usr/share/nginx/html:ro \
  nginx:alpine

# 启动 KKFileView
docker run -d --name kkfileview --restart unless-stopped \
  -p 8012:8012 \
  keking/kkfileview:latest

# 查看日志
docker logs -f protosystem
docker logs -f kkfileview --tail 20
docker stats --no-stream kkfileview  # 查看内存占用（约 814MB）
```

### 原型部署注意事项

- 上传时**排除备份文件**（.bak / .keep / .v\* / js/\*.bak / js/\*.v\*）
- 更新 index.html 后 nginx 自动生效（无需重启容器）
- JS 文件更新后浏览器可能缓存，加版本号参数刷新（`?v=2`）
- KKFileView 是独立服务，不需随原型重启

---

## 第二阶段：正式系统部署（规划中）

> ⚠️ **正式系统的部署方式与第一阶段完全不同**，以下仅为预期方向。

### 预期差异对比

| 项目 | 第一阶段（原型） | 第二阶段（正式系统） |
|------|-----------------|---------------------|
| **部署服务器** | 183.215.41.66（演示用） | **待定**（不同服务器） |
| **架构** | 纯静态文件（nginx） | 后端 JAR + 前端 dist + Docker |
| **构建流程** | 无构建，直接改 HTML | Maven 编译 + Vite 打包 |
| **数据库** | 无（Mock 数据） | 达梦 / MySQL / PostgreSQL |
| **预览方式** | KKFileView:8012 | KKFileView（端口待定） |
| **SSL** | 无（HTTP） | 需要（HTTPS） |
| **部署方式** | scp 上传文件 | 参考信用数智系统：Docker build + docker-compose |

### 正式系统部署启动条件

- [ ] 第一阶段原型设计完成并通过确认
- [ ] 技术选型确定（含数据库选择）
- [ ] 确定正式生产服务器信息
- [ ] 域名与 SSL 证书准备
- [ ] 部署方案设计（基于信用数智系统经验）

> 正式系统部署方案确定后，将创建独立的部署文档（如 `deployment-prod.md`），不会混在原型部署规则中。
