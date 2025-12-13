#!/bin/bash
# Script to easily switch between Preview and Preprod networks

NETWORK=$1

if [ -z "$NETWORK" ]; then
    # Show current network if no argument provided
    CURRENT=$(node -pe "require('./scripts/config.json').network")
    echo "📡 Current network: $CURRENT"
    echo ""
    echo "Usage: bash scripts/set-network.sh [preview|preprod]"
    echo ""
    echo "Examples:"
    echo "  bash scripts/set-network.sh preview"
    echo "  bash scripts/set-network.sh preprod"
    exit 0
fi

# Validate network
if [ "$NETWORK" != "preview" ] && [ "$NETWORK" != "preprod" ]; then
    echo "❌ Invalid network: $NETWORK"
    echo "   Must be 'preview' or 'preprod'"
    exit 1
fi

# Update config
node -e "
const fs = require('fs');
const config = {
  network: '${NETWORK}',
  description: 'Change network to preview or preprod to deploy to that network'
};
fs.writeFileSync('./scripts/config.json', JSON.stringify(config, null, 2));
console.log('✅ Network set to: ${NETWORK}');
"

NETWORK_CAP="$(tr '[:lower:]' '[:upper:]' <<< ${NETWORK:0:1})${NETWORK:1}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Configuration Updated"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📡 Active Network: $NETWORK_CAP"
echo ""
echo "🔧 Required Configuration:"
echo "   1. Make sure NEXT_PUBLIC_BLOCKFROST_API_KEY_${NETWORK_CAP^^} is set in .env.local"
echo "   2. Get test ADA for $NETWORK_CAP network from faucet"
echo ""
echo "🚀 Next Steps:"
echo "   bash scripts/deploy-all.sh"
echo ""

