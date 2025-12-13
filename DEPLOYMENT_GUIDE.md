# 🚀 TokenWell Deployment Guide

Complete step-by-step guide to deploy and test your TokenWell token minting platform.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Aiken** installed ([Download here](https://aiken-lang.org/installation-instructions))
- ✅ **Node.js 18+** and **pnpm** installed
- ✅ **Operator wallet** created (in `Temp/wallet.json`)
- ✅ **Blockfrost account** ([Sign up here](https://blockfrost.io/))

---

## 🎯 Quick Start (Automated)

Run everything at once:

```bash
chmod +x scripts/*.sh
bash scripts/deploy-all.sh
```

Then follow the on-screen instructions to:
1. Get your Blockfrost API key
2. Update `.env.local`
3. Test minting

---

## 📖 Manual Step-by-Step Guide

### **Step 1: Extract Operator PKH** ✅ (Already Done!)

You already have your operator PKH extracted in `Temp/operator-config.json`:

```json
{
  "operatorPKH": "9cfbcc69853f6f50e05bf624fdf7258016882af9143838888475562a"
}
```

---

### **Step 2: Compile Aiken Smart Contract**

Compile the TokenWell validator with your operator PKH:

```bash
bash scripts/1-compile-contract.sh
```

**What this does:**
- Builds your Aiken smart contract
- Generates `plutus.json` with the compiled validator
- The validator enforces that only your operator wallet can mint tokens

**Output:** `tokenwell-sc/plutus.json`

---

### **Step 3: Get Policy ID**

Generate your unique minting policy ID:

```bash
npx tsx scripts/2-get-policy-id.ts
```

**What this does:**
- Takes the compiled validator from `plutus.json`
- Applies your operator PKH as a parameter
- Calculates the policy ID (hash of the parameterized script)
- Saves configuration to `Temp/deploy-config.json`

**Important:** Minting policies **don't need deployment**! The policy ID is derived from the script itself.

**Output:**
```
Policy ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### **Step 4: Setup Environment Variables**

Configure your `.env.local` file:

```bash
npx tsx scripts/3-setup-env.ts
```

**What this does:**
- Creates/updates `.env.local` with:
  - `OPERATOR_PKH` - Your operator's public key hash
  - `PLATFORM_SEED` - Your 24-word mnemonic (from wallet.json)
  - Blockfrost API key placeholders

**⚠️ IMPORTANT: Get Blockfrost API Keys**

1. Visit [Blockfrost.io](https://blockfrost.io/)
2. Create a free account
3. Create projects for:
   - **Preprod** network
   - **Preview** network (optional)
4. Copy your project API keys
5. Update `.env.local`:

```env
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD="preprodYourActualAPIKeyHere"
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW="previewYourActualAPIKeyHere"
```

---

### **Step 5: Get Test ADA**

Your operator wallet needs test ADA to pay transaction fees:

1. Visit the [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)
2. Select **Preprod** network
3. Enter your operator address:
   ```
   addr_test1qzw0hnrfs5lk758qt0mzfl0hykqpdzp2ly2rswygs364v2nwt8vfren4jluf4vu86m600zxwthfef8pkgw5hkc3tcxlqgd5t0z
   ```
4. Request **1000 test ADA**
5. Wait ~20 seconds for confirmation

---

### **Step 6: Test Minting**

Test the complete minting flow:

```bash
npx tsx scripts/4-test-minting.ts
```

**What this tests:**
- ✅ Connects to Cardano preprod network
- ✅ Loads your operator wallet
- ✅ Checks wallet balance
- ✅ Builds a minting transaction
- ✅ Signs with operator key
- ✅ Submits to blockchain
- ✅ Returns transaction hash

**Expected output:**
```
✅ SUCCESS! Transaction submitted!
TX Hash: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
🔗 View on Cardanoscan: https://preprod.cardanoscan.io/transaction/xxxxx
```

---

### **Step 7: Start Your Platform**

Launch the TokenWell web application:

```bash
pnpm dev
```

Then visit: **http://localhost:3000**

---

## 🧪 Testing Through the UI

1. **Open your browser** to http://localhost:3000
2. **Fill in the form:**
   - Token Name: `TestToken`
   - Quantity: `1000`
   - Recipient Address: Any preprod testnet address
   - Network: **Preprod**
3. **Click "Mint Tokens"**
4. **Wait for confirmation** (~20 seconds)
5. **View transaction** on Cardanoscan

---

## 📊 Configuration Summary

After deployment, you'll have:

| Configuration | Location | Description |
|--------------|----------|-------------|
| **Operator PKH** | `Temp/operator-config.json` | Your operator's public key hash |
| **Policy ID** | `Temp/deploy-config.json` | Your unique minting policy ID |
| **Environment** | `.env.local` | API keys and secrets |
| **Wallet** | `Temp/wallet.json` | ⚠️ **Keep secret!** Contains private keys |
| **Compiled Contract** | `tokenwell-sc/plutus.json` | Your compiled Aiken validator |

---

## 🔐 Security Best Practices

### ⚠️ CRITICAL - Keep These Secret:

1. **`Temp/wallet.json`** - Contains your private keys
2. **`.env.local`** - Contains your seed phrase
3. **Never commit these to Git!**

### ✅ Safe to Share:

- Operator PKH (public key hash)
- Policy ID (publicly visible on-chain)
- Operator address (public)

---

## 🐛 Troubleshooting

### Error: "Blockfrost API key not configured"

**Solution:**
1. Get API key from [Blockfrost.io](https://blockfrost.io/)
2. Update `.env.local`
3. Restart your dev server

### Error: "UTxO Balance Insufficient"

**Solution:**
1. Get test ADA from the [faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)
2. Wait for transaction to confirm
3. Try again

### Error: "Operator signature missing"

**Solution:**
- Check that `OPERATOR_PKH` in `.env.local` matches your wallet
- Make sure `PLATFORM_SEED` is correct

### Transaction Not Confirming

**Normal:**
- Preprod transactions take 20-40 seconds
- Check status on Cardanoscan

**If stuck:**
- Wait 2 minutes
- Check [Preprod Status](https://preprod.cardanoscan.io/)

---

## 🎯 What's Next?

After successful deployment:

1. ✅ **Test extensively** with different token names and quantities
2. ✅ **Monitor transactions** on Cardanoscan
3. ✅ **Add features** like:
   - Token metadata
   - Delivery validation (currently TODO in contract)
   - Rate limiting
   - Admin dashboard

---

## 📚 Additional Resources

- **Aiken Docs:** https://aiken-lang.org/
- **Lucid Evolution:** https://github.com/Anastasia-Labs/lucid-evolution
- **Cardano Docs:** https://docs.cardano.org/
- **Blockfrost Docs:** https://docs.blockfrost.io/

---

## 🆘 Need Help?

Check:
1. This guide
2. Your console logs
3. Cardanoscan transaction details
4. Blockfrost dashboard for API usage

---

**Built with ❤️ for the Cardano community**

