# TokenWell 🌊

> Your source for Cardano testnet tokens

TokenWell is a modern, developer-friendly platform for minting custom test tokens on Cardano Preview and Preprod networks. Built with Next.js, Aiken, and Lucid Evolution.

![TokenWell](./public/9ccbc00c-09e1-4d62-9649-83f4fc75ac38.jpg)

## ✨ Features

- ⚡ **Instant Minting** - Create test tokens in seconds
- 🔒 **Secure** - Smart contract validated with comprehensive tests
- 🎨 **Modern UI** - Beautiful, responsive interface with purple theme
- 🌐 **Dual Network** - Support for Preview and Preprod testnets
- 🆓 **Free to Use** - No fees, no limits (testnet only)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Blockfrost API keys (free at [blockfrost.io](https://blockfrost.io))
- Testnet wallet with seed phrase

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd TokenWell

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# Run development server
pnpm dev
```

### Environment Setup

1. **Get Blockfrost API Keys:**
   - Visit [blockfrost.io](https://blockfrost.io)
   - Create free account
   - Create projects for Preview and Preprod
   - Copy API keys to `.env.local`

2. **Set Up Platform Wallet:**
   - Generate new testnet wallet
   - Save seed phrase to `.env.local`
   - Extract public key hash (PKH)
   - Fund wallet with testnet ADA from [faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)

3. **Configure `.env.local`:**
   ```env
   NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW=preview_your_key
   NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD=preprod_your_key
   PLATFORM_SEED=your 24 word seed phrase
   OPERATOR_PKH=your_public_key_hash
   NEXT_PUBLIC_NETWORK=Preview
   ```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
- **Smart Contracts**: Aiken (Plutus V3)
- **Blockchain Library**: Lucid Evolution
- **API Provider**: Blockfrost

### Project Structure

```
TokenWell/
├── app/                    # Next.js app directory
│   ├── api/mint/          # Minting API endpoint
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── MintForm.tsx       # Main minting form
├── lib/                   # Utilities and logic
│   ├── lucid.ts          # Lucid initialization
│   ├── minting.ts        # Minting transaction logic
│   └── utils.ts          # Helper functions
├── tokenwell-sc/         # Aiken smart contracts
│   ├── validators/       # Validator scripts
│   ├── lib/             # Contract libraries
│   └── plutus.json      # Compiled blueprint
└── .env.local           # Environment variables (not committed)
```

## 🔐 Smart Contract

The TokenWell minting policy is a simple, secure Plutus V3 validator that:

- ✅ Requires operator signature for minting
- ✅ Validates token name and quantity
- ✅ Ensures correct mint amount
- ✅ Prevents unauthorized minting

**Testing:**
```bash
cd tokenwell-sc
aiken check  # Run 21 comprehensive tests
aiken build  # Compile validator
```

All tests pass ✅ (21/21)

## 🎨 Design

TokenWell features a modern, tech-forward design with:

- **Purple Theme** - Vibrant electric purple (#8B5CF6)
- **Dark Mode** - Easy on the eyes
- **Smooth Animations** - Glow effects and transitions
- **Responsive** - Works on all devices
- **Accessible** - WCAG compliant

See [THEME.md](./Temp/THEME.md) for complete design system.

## 📝 Usage

1. **Visit the app** (http://localhost:3000)
2. **Enter token details:**
   - Token name (e.g., "tUSDM")
   - Quantity (e.g., 10000)
   - Recipient address (testnet)
   - Network (Preview/Preprod)
3. **Click "Mint Tokens"**
4. **Receive transaction hash**
5. **View on Cardanoscan**

## 🛠️ Development

### Run Development Server

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
pnpm start
```

### Smart Contract Development

```bash
cd tokenwell-sc
aiken check     # Run tests
aiken build     # Compile
aiken docs      # Generate docs
```

### Code Quality

```bash
pnpm lint       # Run ESLint
pnpm format     # Format with Prettier
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW=***
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD=***
PLATFORM_SEED=***  # Keep secret!
OPERATOR_PKH=***
NEXT_PUBLIC_NETWORK=Preview
```

⚠️ **Security**: Never commit `.env.local` or expose `PLATFORM_SEED`!

## 📚 API Reference

### POST /api/mint

Mint test tokens.

**Request:**
```json
{
  "tokenName": "tUSDM",
  "quantity": 10000,
  "recipientAddress": "addr_test1...",
  "network": "Preview"
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "abc123...",
  "message": "Tokens minted successfully!"
}
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [Aiken](https://aiken-lang.org/) - Smart contract language
- [Lucid Evolution](https://github.com/Anastasia-Labs/lucid-evolution) - Cardano library
- [Blockfrost](https://blockfrost.io/) - Blockchain API
- [Cardano](https://cardano.org/) - The blockchain platform

## 🔗 Links

- **Website**: [Your deployment URL]
- **Documentation**: [PLAN.md](./Temp/PLAN.md)
- **Design System**: [THEME.md](./Temp/THEME.md)
- **Smart Contract**: [tokenwell-sc/](./tokenwell-sc/)

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Join Cardano developer community
- Check [Aiken Discord](https://discord.gg/aiken)

---

Built with ❤️ for the Cardano community • Testnet only • Not for production use
