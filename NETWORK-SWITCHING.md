# 🔄 Network Switching Guide

Switch between Preview and Preprod networks with **one command**!

---

## 🎯 Quick Switch

### **Switch to Preview:**
```bash
bash scripts/set-network.sh preview
```

### **Switch to Preprod:**
```bash
bash scripts/set-network.sh preprod
```

### **Check Current Network:**
```bash
bash scripts/set-network.sh
```

---

## 📋 How It Works

All deployment scripts read from **one configuration file**:

```
scripts/config.json
```

**Current configuration:**
```json
{
  "network": "preview"
}
```

**To switch networks**, just change `"preview"` to `"preprod"` or use the set-network script!

---

## 🚀 Complete Workflow

### **Deploy to Preview:**

```bash
# 1. Set network
bash scripts/set-network.sh preview

# 2. Deploy everything
bash scripts/deploy-all.sh

# 3. Get Preview test ADA (if needed)
# Visit: https://docs.cardano.org/cardano-testnet/tools/faucet/
# Network: Preview

# 4. Test
npx tsx scripts/4-test-minting.ts

# 5. Launch
pnpm dev
```

### **Deploy to Preprod:**

```bash
# 1. Set network
bash scripts/set-network.sh preprod

# 2. Deploy everything
bash scripts/deploy-all.sh

# 3. Get Preprod test ADA (if needed)
# Visit: https://docs.cardano.org/cardano-testnet/tools/faucet/
# Network: Preprod

# 4. Test
npx tsx scripts/4-test-minting.ts

# 5. Launch
pnpm dev
```

---

## ⚙️ What Changes Automatically

When you switch networks, these scripts **automatically adapt**:

| Script | What It Does |
|--------|--------------|
| **1-compile-contract.sh** | Shows which network you're compiling for |
| **2-get-policy-id.ts** | Uses the correct network endpoint |
| **3-setup-env.ts** | Configures the right API key variables |
| **4-test-minting.ts** | Connects to the selected network |

---

## 🔑 Environment Requirements

Make sure your `.env.local` has **both** API keys (or at least the one you're using):

```env
# Preview Network
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW="previewYourActualKeyHere"

# Preprod Network
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD="preprodYourActualKeyHere"

# Operator Configuration (same for both networks)
OPERATOR_PKH="9cfbcc69853f6f50e05bf624fdf7258016882af9143838888475562a"
PLATFORM_SEED="your 24-word seed phrase here"
```

---

## 💡 Pro Tips

### **1. Test on Preview First**
Preview is faster and perfect for rapid development:
```bash
bash scripts/set-network.sh preview
```

### **2. Final Testing on Preprod**
Before mainnet, always test on Preprod (more stable):
```bash
bash scripts/set-network.sh preprod
```

### **3. Same Contract, Different Networks**
Your smart contract works on **both** networks! The policy ID will be the same because it only depends on your operator PKH.

### **4. Check Before Deploying**
Always verify which network you're on:
```bash
bash scripts/set-network.sh
```

---

## 🔍 Network Comparison

| Feature | Preview | Preprod |
|---------|---------|---------|
| **Block Time** | ~10-20 seconds | ~20-40 seconds |
| **Stability** | Less stable (frequent resets) | More stable |
| **Use Case** | Rapid development | Pre-production testing |
| **Faucet Limits** | More permissive | More permissive |
| **Recommended For** | Daily development | Final testing before mainnet |

---

## 🆘 Troubleshooting

### **Error: "Network mismatch"**

Make sure you've redeployed after switching networks:
```bash
bash scripts/deploy-all.sh
```

### **Error: "Blockfrost API key not found"**

Check your `.env.local` has the correct key for your selected network:
- Preview: `NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW`
- Preprod: `NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD`

### **Error: "No UTxOs"**

Get test ADA from the faucet for the **correct network**:
- Preview: https://docs.cardano.org/cardano-testnet/tools/faucet/ (select Preview)
- Preprod: https://docs.cardano.org/cardano-testnet/tools/faucet/ (select Preprod)

---

## 📁 Files That Control Network

| File | Purpose |
|------|---------|
| **`scripts/config.json`** | Master network configuration |
| **`.env.local`** | API keys for both networks |
| **`Temp/deploy-config.json`** | Generated deployment info (includes active network) |

---

## ✅ Best Practice Workflow

1. **Develop on Preview** (fast iterations)
   ```bash
   bash scripts/set-network.sh preview
   ```

2. **Test thoroughly**

3. **Switch to Preprod** for final validation
   ```bash
   bash scripts/set-network.sh preprod
   bash scripts/deploy-all.sh
   ```

4. **Final testing on Preprod**

5. **Ready for mainnet!**

---

**One config file. Two networks. Zero hassle! 🎉**

