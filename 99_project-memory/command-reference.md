# 常用命令速查

> ⚠️ **两阶段命令分离**：第一阶段（原型）和第二阶段的命令互不通用。
> 正式系统开发启动后，在下方区域新增正式系统命令。

---

## 🔵 第一阶段：原型开发（当前）

### 文件服务器
```bash
# 启动原型 HTTP 服务器（端口 9901）
cd /mnt/c/SSDATA/望城经开区/CloudShairFileLib
python3 -m http.server 9901 --bind 0.0.0.0

# 启动文件预览源服务器（端口 9000）
cd /mnt/c/SSDATA/望城经开区/CloudShairFileLib/protosystem
python3 -m http.server 9000 --bind 0.0.0.0
```

### Docker 容器
```bash
# KKFileView（本地）
docker run -d --name kkfileview --restart unless-stopped \
  -p 8012:8012 keking/kkfileview:latest

# 查看状态
docker ps | grep kkfileview
docker logs kkfileview --tail 20
```

### 浏览器访问
```
原型页面：     http://localhost:9901/protosystem/index.html
KKFileView：   http://localhost:8012/
```

## 服务器部署（183.215.41.66:8028）

### SSH 连接
```bash
ssh -p 8028 wongxin@183.215.41.66
# 密码：Wx2a9Svr
```

### 原型容器管理
```bash
# 重启 nginx（文件更新后）
docker restart protosystem

# 查看日志
docker logs -f protosystem

# 直接检查文件
ls -la /home/wongxin/protosystem/
```

### KKFileView 管理
```bash
docker restart kkfileview
docker logs -f kkfileview --tail 20
curl -s -o /dev/null -w '%{http_code}' http://localhost:8012/
```

### 文件上传（本地 → 服务器）
```bash
# 单个文件
scp -P 8028 protosystem/index.html wongxin@183.215.41.66:~/protosystem/
```

### 预览验证
```bash
# 测试预览链：KKFileView 抓文件
# 编码文件URL为 base64
echo -n "http://183.215.41.66:9598/demo/demo.pdf" | base64
# 测试
curl -s -o /dev/null -w '%{http_code}' \
  'http://localhost:8012/onlinePreview?url={base64_url}'
```

## Git

```bash
# 提交（允许空消息）
cd /mnt/c/SSDATA/望城经开区/CloudShairFileLib
git add .
git commit --allow-empty-message -m ""
git push
```

---

## 🟢 第二阶段：正式系统命令（待补充）

> 正式系统开发启动后，在此区域补充构建、部署、运维等命令。
> 参考信用数智系统的命令模式：Maven 编译、Vite 打包、Docker 构建镜像、scp 上传部署包等。
