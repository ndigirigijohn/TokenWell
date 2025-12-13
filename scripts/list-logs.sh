#!/bin/bash
# List all deployment logs

echo "📋 Deployment Logs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ls Temp/deployment_*.log 1> /dev/null 2>&1; then
    ls -lht Temp/deployment_*.log | awk '{
        size=$5
        date=$6" "$7" "$8
        file=$9
        printf "%-20s  %-15s  %s\n", date, size, file
    }'
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "To view a log: cat Temp/deployment_TIMESTAMP.log"
    echo "Latest log:    bash scripts/view-latest-log.sh"
else
    echo "No deployment logs found in Temp/"
    echo ""
    echo "Run deployment first:"
    echo "  bash scripts/deploy-all.sh"
fi

