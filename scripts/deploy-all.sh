#!/bin/bash
# Master deployment script - runs all deployment steps

set -e  # Exit on error

# Create log file with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="Temp/deployment_${TIMESTAMP}.log"

# Function to log and display
log() {
    echo "$@" | tee -a "$LOG_FILE"
}

log "🚀 TokenWell Complete Deployment"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📝 Logging to: $LOG_FILE"
log ""

# Check if Aiken is installed
if ! command -v aiken &> /dev/null; then
    log "❌ Aiken is not installed!"
    log "   Install it from: https://aiken-lang.org/installation-instructions"
    exit 1
fi

# Check if wallet.json exists
if [ ! -f "Temp/wallet.json" ]; then
    log "❌ Temp/wallet.json not found!"
    log "   Please create your operator wallet first"
    exit 1
fi

# Check if operator config exists
if [ ! -f "Temp/operator-config.json" ]; then
    log "⚠️  Operator config not found. Extracting PKH..."
    npx tsx scripts/extract-pkh-simple.ts 2>&1 | tee -a "$LOG_FILE"
fi

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📋 STEP 1 of 4: Compiling Smart Contract"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash scripts/1-compile-contract.sh 2>&1 | tee -a "$LOG_FILE"

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📋 STEP 2 of 4: Getting Policy ID"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx tsx scripts/2-get-policy-id.ts 2>&1 | tee -a "$LOG_FILE"

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📋 STEP 3 of 4: Setting Up Environment"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx tsx scripts/3-setup-env.ts 2>&1 | tee -a "$LOG_FILE"

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "✅ Deployment Complete!"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log ""
log "⚠️  BEFORE TESTING:"
log "   1. Get a Blockfrost API key from: https://blockfrost.io/"
log "   2. Update .env.local with your API key"
log "   3. Get test ADA from the faucet (if needed)"
log ""
log "🧪 TO TEST:"
log "   npx tsx scripts/4-test-minting.ts"
log ""
log "🚀 TO START THE PLATFORM:"
log "   pnpm dev"
log "   Open: http://localhost:3000"
log ""
log "📄 Full deployment log saved to: $LOG_FILE"

