#!/bin/bash
# Script to compile the Aiken smart contract with operator PKH parameter

set -e  # Exit on error

echo "🔨 Compiling TokenWell Smart Contract..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Load network from config
NETWORK=$(node -pe "require('./scripts/config.json').network")
NETWORK_CAPITALIZED="$(tr '[:lower:]' '[:upper:]' <<< ${NETWORK:0:1})${NETWORK:1}"

# Load operator PKH from config
OPERATOR_PKH=$(node -pe "require('./Temp/operator-config.json').operatorPKH")

echo "📋 Configuration:"
echo "   Network:      $NETWORK_CAPITALIZED"
echo "   Operator PKH: $OPERATOR_PKH"
echo ""

# Navigate to smart contract directory
cd tokenwell-sc

# Run Aiken build
echo "⚙️  Building contract..."
aiken build

# Check if build was successful
if [ -f "plutus.json" ]; then
    echo "✅ Contract compiled successfully!"
    echo "📄 Output: tokenwell-sc/plutus.json"
    
    # Show validator info
    echo ""
    echo "📊 Validator Information:"
    cat plutus.json | jq '.validators[] | {title: .title, hash: .hash}'
else
    echo "❌ Build failed - plutus.json not found"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Step 1 Complete: Contract compiled!"
echo "   Next: Run '2-deploy-and-get-policy.ts' to get your policy ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

