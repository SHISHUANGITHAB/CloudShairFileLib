#!/bin/bash
# 原型系统部署前打包备份
# 每次部署前调用，备份 protosystem/ 工作文件（排除备份目录自身）
# 保留最近 5 份，自动清理更早的备份

set -e

PROJECT_DIR="/mnt/c/SSDATA/望城经开区/CloudShairFileLib"
PROTO_DIR="$PROJECT_DIR/protosystem"
BACKUP_DIR="$PROTO_DIR/backups"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/protosystem-backup-$TIMESTAMP.tar.gz"

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

# 打包（排除 backups 目录自身以及 .bak/.keep/.v* 备份文件）
cd "$PROJECT_DIR"
tar czf "$BACKUP_FILE" \
  --exclude="protosystem/backups" \
  --exclude="protosystem/*.bak" \
  --exclude="protosystem/*.keep" \
  --exclude="protosystem/index.html.v*" \
  --exclude="protosystem/js/*.bak" \
  --exclude="protosystem/js/*.v*" \
  protosystem/ 2>/dev/null

echo "✅ 备份创建: $(basename "$BACKUP_FILE") ($(du -h "$BACKUP_FILE" | cut -f1))"

# 只保留最近 5 份
ls -1t "$BACKUP_DIR"/protosystem-backup-*.tar.gz 2>/dev/null | tail -n +6 | while read old; do
  rm -f "$old"
  echo "  删除旧备份: $(basename "$old")"
done

COUNT=$(ls -1 "$BACKUP_DIR"/protosystem-backup-*.tar.gz 2>/dev/null | wc -l)
echo "📊 当前备份数: $COUNT"
