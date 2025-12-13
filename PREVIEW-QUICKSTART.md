# ⚡ TokenWell Preview Network Quick Start

## 🚀 Deploy to Preview Network

Since you already have your **Blockfrost Preview API key** configured, let's deploy!

---

## 📝 Quick Deploy (3 Steps)

### **Step 1: Compile Contract**

```bash
bash scripts/1-compile-contract.sh
```

### **Step 2: Get Policy ID**

```bash
npx tsx scripts/2-get-policy-id.ts
```

### **Step 3: Setup Environment**

```bash
npx tsx scripts/3-setup-env.ts
```

Your `.env.local` will be updated with:
- ✅ `OPERATOR_PKH` (your operator public key hash)
- ✅ `PLATFORM_SEED` (your wallet mnemonic)
- ✅ `NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW` (already set!)

---

## 💰 Get Test ADA

Before testing, you need test ADA on **Preview** network:

1. **Visit Faucet:** https://docs.cardano.org/cardano-testnet/tools/faucet/
2. **Select Network:** Preview
3. **Your Address:**
   ```
   addr_test1qzw0hnrfs5lk758qt0mzfl0hykqpdzp2ly2rswygs364v2nwt8vfren4jluf4vu86m600zxwthfef8pkgw5hkc3tcxlqgd5t0z
   ```
4. **Request:** 1000 test ADA
5. **Wait:** ~20 seconds for confirmation

---

## 🧪 Test Minting

```bash
npx tsx scripts/4-test-minting.ts
```

**Expected output:**
```
✅ SUCCESS! Transaction submitted!
TX Hash: xxxxxxxxxxxxx
🔗 View on Cardanoscan: https://preview.cardanoscan.io/transaction/xxxxx
```

---

## 🌐 Launch Your Platform

```bash
pnpm dev
```

Visit: **http://localhost:3000**

**Test with UI:**
1. Token Name: `TestToken`
2. Quantity: `1000`
3. Network: **Preview** ← Make sure to select Preview!
4. Recipient: Any preview testnet address
5. Click "Mint Tokens"

---

## ✅ Your Configuration

| Item | Value |
|------|-------|
| **Network** | **Preview** |
| **Operator PKH** | `9cfbcc69853f6f50e05bf624fdf7258016882af9143838888475562a` |
| **Operator Address** | `addr_test1qzw0hnrfs5lk758qt0mzfl0hykqpdzp2ly2rswygs364v2nwt8vfren4jluf4vu86m600zxwthfef8pkgw5hkc3tcxlqgd5t0z` |

---

## 🔄 Adding Preprod Later

When you're ready to add Preprod support:

1. **Get Preprod API key** from Blockfrost
2. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD="preprodYourKeyHere"
   ```
3. **Get Preprod test ADA** (same faucet, different network)
4. **Use either network** in your UI!

The same deployed contract works on **both** Preview and Preprod networks!

---

## 📊 Preview vs Preprod

| Feature | Preview | Preprod |
|---------|---------|---------|
| **Speed** | Faster (~10-20 sec) | Slower (~20-40 sec) |
| **Stability** | Less stable | More stable |
| **Use Case** | Quick testing | Pre-production testing |
| **Faucet** | More permissive | More permissive |

**Recommendation:** 
- Use **Preview** for rapid development and testing
- Use **Preprod** before mainnet deployment

---

## 🎯 Ready to Go!

Run these commands:

```bash
# 1. Deploy
bash scripts/1-compile-contract.sh
npx tsx scripts/2-get-policy-id.ts
npx tsx scripts/3-setup-env.ts

# 2. Get test ADA (use faucet)

# 3. Test
npx tsx scripts/4-test-minting.ts

# 4. Launch
pnpm dev
```

---

**You're all set for Preview! 🎉**

