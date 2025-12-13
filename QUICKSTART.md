# ⚡ TokenWell Quick Start

## 🚀 Deploy in 5 Minutes

### Option 1: Automated (Recommended)

```bash
bash scripts/deploy-all.sh
```

### Option 2: Step by Step

```bash
# 1. Compile contract
bash scripts/1-compile-contract.sh

# 2. Get policy ID
npx tsx scripts/2-get-policy-id.ts

# 3. Setup environment
npx tsx scripts/3-setup-env.ts

# 4. Test minting (after getting API key & test ADA)
npx tsx scripts/4-test-minting.ts
```

---

## 📝 Before Testing - Required Setup

### 1. Get Blockfrost API Key (2 minutes)

1. Go to: https://blockfrost.io/
2. Create free account
3. Create "Preprod" project
4. Copy API key
5. Edit `.env.local`:
   ```env
   NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD="preprodYourRealKeyHere"
   ```

### 2. Get Test ADA (1 minute)

1. Visit: https://docs.cardano.org/cardano-testnet/tools/faucet/
2. Network: **Preprod**
3. Address: `addr_test1qzw0hnrfs5lk758qt0mzfl0hykqpdzp2ly2rswygs364v2nwt8vfren4jluf4vu86m600zxwthfef8pkgw5hkc3tcxlqgd5t0z`
4. Request 1000 ADA
5. Wait 20 seconds

---

## 🧪 Test It

```bash
npx tsx scripts/4-test-minting.ts
```

Expected output:
```
✅ SUCCESS! Transaction submitted!
TX Hash: xxxxxxxxxxxxx
```

---

## 🌐 Launch Platform

```bash
pnpm dev
```

Visit: **http://localhost:3000**

---

## ✅ Your Configuration

| Item | Value |
|------|-------|
| **Operator PKH** | `9cfbcc69853f6f50e05bf624fdf7258016882af9143838888475562a` |
| **Network** | Preprod |
| **Operator Address** | `addr_test1qzw0hnrfs5lk758qt0mzfl0hykqpdzp2ly2rswygs364v2nwt8vfren4jluf4vu86m600zxwthfef8pkgw5hkc3tcxlqgd5t0z` |

---

## 📚 Full Guide

See: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**That's it! 🎉**

