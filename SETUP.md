# TokenWell - Quick Setup Guide 🚀

Follow these steps to get TokenWell running locally.

## ✅ Step 1: Install Dependencies

```bash
cd /home/john/Projects/TokenWell
pnpm install
```

## ✅ Step 2: Create Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

## ✅ Step 3: Get Blockfrost API Keys

1. Visit [https://blockfrost.io](https://blockfrost.io)
2. Create a free account
3. Create two projects:
   - One for "Preview" testnet
   - One for "Preprod" testnet
4. Copy the API keys

## ✅ Step 4: Set Up Platform Wallet

### Option A: Using cardano-cli

```bash
# Generate payment keys
cardano-cli address key-gen \
  --verification-key-file payment.vkey \
  --signing-key-file payment.skey

# Build address (Preview testnet magic: 2)
cardano-cli address build \
  --payment-verification-key-file payment.vkey \
  --testnet-magic 2 \
  --out-file payment.addr

# Get the address
cat payment.addr

# Extract key hash (PKH)
cardano-cli address key-hash \
  --payment-verification-key-file payment.vkey
```

### Option B: Using a Wallet App (Easier)

1. Install **Eternl** or **Nami** wallet extension
2. Switch to testnet mode
3. Create new wallet
4. **IMPORTANT**: Save the 24-word seed phrase
5. Copy your testnet address
6. Extract PKH from address (first 56 chars after `addr_test1`)

## ✅ Step 5: Fund Your Wallet

Get free testnet ADA:

1. Visit [Cardano Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)
2. Select "Preview" or "Preprod"
3. Enter your address
4. Request 10,000 tADA
5. Wait ~20 seconds for confirmation

## ✅ Step 6: Configure .env.local

Edit `.env.local` with your actual values:

```env
# Blockfrost API Keys
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW=preview_abc123...
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD=preprod_xyz789...

# Platform Wallet (KEEP SECRET!)
PLATFORM_SEED=word1 word2 word3 ... word24
OPERATOR_PKH=your_56_character_key_hash_here

# Network
NEXT_PUBLIC_NETWORK=Preview
NEXT_PUBLIC_DEBUG=false
```

## ✅ Step 7: Verify Smart Contract

```bash
cd tokenwell-sc

# Run tests (should see 21/21 pass)
aiken check

# Build validator
aiken build
```

## ✅ Step 8: Start Development Server

```bash
cd /home/john/Projects/TokenWell

# Start the dev server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## ✅ Step 9: Test Minting

1. Open [http://localhost:3000](http://localhost:3000)
2. Fill in the form:
   - **Token Name**: "TestToken"
   - **Quantity**: 1000
   - **Recipient Address**: Your testnet address
   - **Network**: Preview
3. Click "Mint Tokens"
4. Wait ~20 seconds
5. Click "View on Cardanoscan" to see your transaction!

## 🔍 Troubleshooting

### "Blockfrost API key not found"
- Check `.env.local` exists in project root
- Verify API key variable names match exactly
- Restart dev server after changing `.env.local`

### "Platform seed not configured"
- Ensure seed phrase is in `.env.local`
- Check it's 24 words separated by spaces
- No quotes around the seed phrase

### "Failed to mint tokens"
- Verify wallet has testnet ADA (check on Cardanoscan)
- Ensure recipient address is valid testnet address (starts with `addr_test1`)
- Check Blockfrost API key has not exceeded rate limits

### "Invalid recipient address"
- Address must start with `addr_test1`
- Use testnet address, not mainnet
- Copy full address without extra spaces

## 📝 Example .env.local

```env
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW=preview_mK2jL3nM4oP5qR6sT7uV8wX9yZ0aB1cD
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD=preprod_nK3jL4nM5oP6qR7sT8uV9wX0yZ1aB2cD
PLATFORM_SEED=abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
OPERATOR_PKH=1234567890abcdef1234567890abcdef1234567890abcdef12345678
NEXT_PUBLIC_NETWORK=Preview
NEXT_PUBLIC_DEBUG=false
```

## 🎯 Next Steps

Once everything is working:

1. ✅ Test on both Preview and Preprod networks
2. ✅ Try minting different token names
3. ✅ Test with various quantities
4. ✅ Share with other developers
5. ✅ Deploy to Vercel (optional)

## 🚀 Ready for Production?

See [README.md](./README.md) for deployment instructions.

---

**Need help?** Check the [README](./README.md) or [PLAN.md](./Temp/PLAN.md) for more details.

