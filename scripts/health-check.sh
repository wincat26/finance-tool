#!/bin/bash
# 健康檢查腳本
echo "=== 財務工具健康檢查 ==="
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "檢查前端..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://finance-tool-sage.vercel.app)
[ "$FRONTEND_STATUS" = "200" ] && echo -e "${GREEN}✓ 前端正常${NC}" || echo -e "${RED}✗ 前端異常${NC}"

echo "檢查後端..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://finance-reddoor.zeabur.app/health)
[ "$BACKEND_STATUS" = "200" ] && echo -e "${GREEN}✓ 後端正常${NC}" || echo -e "${RED}✗ 後端異常${NC}"

for endpoint in "/api/dashboard?year=2025" "/api/customers?year=2025" "/api/finance/annual-report?year=2025"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://finance-reddoor.zeabur.app$endpoint")
    [ "$STATUS" = "200" ] && echo -e "${GREEN}✓ $endpoint${NC}" || echo -e "${RED}✗ $endpoint${NC}"
done
