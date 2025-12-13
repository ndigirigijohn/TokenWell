#!/bin/bash
# View the latest deployment log

LATEST_LOG=$(ls -t Temp/deployment_*.log 2>/dev/null | head -n 1)

if [ -z "$LATEST_LOG" ]; then
    echo "❌ No deployment logs found in Temp/"
    echo ""
    echo "Run deployment first:"
    echo "  bash scripts/deploy-all.sh"
    exit 1
fi

echo "📄 Viewing latest deployment log:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File: $LATEST_LOG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat "$LATEST_LOG"

