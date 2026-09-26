#!/bin/bash
# Backup diario do banco. Cron sugerido: 0 4 * * * /home/lucasdarela/mineira-master/backup-db.sh
set -e
DIR=/home/lucasdarela/mineira-master/backups; mkdir -p "$DIR"
docker exec mineira-db pg_dump -U mineira -d mineira | gzip > "$DIR/mineira-$(date +%F).sql.gz"
docker exec mineira-app tar czf - -C /app storage > "$DIR/storage-$(date +%F).tar.gz"
find "$DIR" -type f -mtime +7 -delete   # guarda 7 dias
