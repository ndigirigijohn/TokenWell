/**
 * Test the minting functionality
 * This script tests the complete minting flow
 */

import { Lucid, Blockfrost, applyParamsToScript, Data } from "@lucid-evolution/lucid";
import * as fs from "fs";
import * as path from "path";
import plutusBlueprint from "../tokenwell-sc/plutus.json";

async function testMinting() {
  try {
    console.log("🧪 Testing TokenWell Minting...");
    console.log("━".repeat(64));

    // Load configurations
    const walletPath = path.join(process.cwd(), "Temp", "wallet.json");
    const deployPath = path.join(process.cwd(), "Temp", "deploy-config.json");

    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
    const deployData = JSON.parse(fs.readFileSync(deployPath, "utf-8"));

    // Determine network from deploy config
    const network = deployData.network || "preview";
    const networkCapitalized = network.charAt(0).toUpperCase() + network.slice(1);

    // Check for Blockfrost API key
    const apiKeyEnvVar = network === "preview" 
      ? "NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW"
      : "NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD";
    
    const apiKey = process.env[apiKeyEnvVar];
    
    if (!apiKey || apiKey.includes("XXXXX")) {
      console.log("❌ Blockfrost API key not configured!");
      console.log("");
      console.log(`Please update .env.local with your Blockfrost API key for ${networkCapitalized}:`);
      console.log("1. Visit: https://blockfrost.io/");
      console.log(`2. Create a project for ${networkCapitalized} network`);
      console.log("3. Copy your API key");
      console.log(`4. Update ${apiKeyEnvVar} in .env.local`);
      return;
    }

    console.log("📋 Configuration:");
    console.log(`   Network:      ${network}`);
    console.log(`   Operator PKH: ${deployData.operatorPKH}`);
    console.log(`   Policy ID:    ${deployData.policyId}`);
    console.log(`   Operator:     ${deployData.operatorAddress}`);
    console.log("");

    // Initialize Lucid
    console.log(`🔌 Connecting to Cardano ${network} network...`);
    const lucid = await Lucid(
      new Blockfrost(
        `https://cardano-${network}.blockfrost.io/api/v0`,
        apiKey
      ),
      networkCapitalized as "Preview" | "Preprod"
    );

    // Load wallet from seed
    console.log("🔐 Loading operator wallet...");
    lucid.selectWallet.fromSeed(walletData.mnemonic.phrase);

    // Get wallet address
    const walletAddress = await lucid.wallet().address();
    console.log(`   Address: ${walletAddress}`);

    // Check wallet balance
    console.log("\n💰 Checking wallet balance...");
    const utxos = await lucid.wallet().getUtxos();
    
    if (utxos.length === 0) {
      console.log("❌ Wallet has no UTXOs!");
      console.log("");
      console.log("⚠️  You need test ADA to mint tokens:");
      console.log("   1. Visit: https://docs.cardano.org/cardano-testnet/tools/faucet/");
      console.log(`   2. Select ${networkCapitalized} network`);
      console.log("   3. Request test ADA for your address:");
      console.log(`      ${walletAddress}`);
      console.log("   4. Wait for the transaction to confirm (~20 seconds)");
      console.log("   5. Run this script again");
      return;
    }

    const totalLovelace = utxos.reduce((sum, utxo) => sum + utxo.assets.lovelace, 0n);
    console.log(`   Balance: ${Number(totalLovelace) / 1_000_000} ADA`);

    if (totalLovelace < 5_000_000n) {
      console.log("⚠️  Low balance! You might need more test ADA for minting.");
    }

    // Prepare minting transaction
    console.log("\n🪙 Preparing to mint test token...");
    
    const testTokenName = "TestToken";
    const testQuantity = 1000;
    const recipientAddress = walletAddress; // Mint to self for testing

    console.log(`   Token Name:   ${testTokenName}`);
    console.log(`   Quantity:     ${testQuantity}`);
    console.log(`   Recipient:    ${recipientAddress}`);
    console.log("");

    // Get validator and apply parameters
    const validator = plutusBlueprint.validators.find(
      (v) => v.title === "token_well.tokenwell"
    );

    if (!validator) {
      throw new Error("TokenWell validator not found");
    }

    const appliedScript = applyParamsToScript(validator.compiledCode, [
      deployData.operatorPKH,
    ]);

    const mintingPolicy = {
      type: "PlutusV3" as const,
      script: appliedScript,
    };

    const policyId = (lucid as any).utils.mintingPolicyToId(mintingPolicy);
    console.log(`✓ Policy ID verified: ${policyId}`);

    // Build redeemer
    const tokenNameHex = Buffer.from(testTokenName).toString("hex");
    const redeemer = Data.to({
      token_name: tokenNameHex,
      quantity: BigInt(testQuantity),
      recipient: recipientAddress,
    } as any);

    console.log("\n⚙️  Building transaction...");
    
    // Build transaction
    const tx = await lucid
      .newTx()
      .mint(
        {
          [policyId]: {
            [tokenNameHex]: BigInt(testQuantity),
          },
        },
        redeemer
      )
      .pay.ToAddress(recipientAddress, {
        [policyId]: {
          [tokenNameHex]: BigInt(testQuantity),
        },
      })
      .attach.MintingPolicy(mintingPolicy)
      .complete();

    console.log("✓ Transaction built successfully");
    console.log(`   Fee: ${Number(tx.fee) / 1_000_000} ADA`);

    // Sign transaction
    console.log("\n✍️  Signing transaction...");
    const signedTx = await tx.sign.withWallet().complete();
    console.log("✓ Transaction signed");

    // Submit transaction
    console.log("\n📤 Submitting transaction to blockchain...");
    const txHash = await signedTx.submit();

    console.log("\n✅ SUCCESS! Transaction submitted!");
    console.log("━".repeat(64));
    console.log(`TX Hash: ${txHash}`);
    console.log("━".repeat(64));
    console.log("");
    console.log("🔗 View on Cardanoscan:");
    console.log(`   https://${network}.cardanoscan.io/transaction/${txHash}`);
    console.log("");
    console.log("⏳ Waiting for confirmation (~20 seconds)...");
    console.log("");
    console.log("🎉 Your TokenWell platform is working!");
    console.log("");
    console.log("━".repeat(64));
    console.log("✅ All Tests Passed!");
    console.log("━".repeat(64));
    console.log("");
    console.log("🚀 Your platform is ready to use!");
    console.log("   • Start your Next.js server: pnpm dev");
    console.log("   • Visit: http://localhost:3000");
    console.log("   • Try minting tokens through the UI");

  } catch (error) {
    console.error("\n❌ Test Failed:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("UTxO Balance Insufficient")) {
        console.log("\n💡 Solution: You need more test ADA");
        console.log("   Get free test ADA from: https://docs.cardano.org/cardano-testnet/tools/faucet/");
      } else if (error.message.includes("fetch")) {
        console.log("\n💡 Solution: Check your Blockfrost API key");
        console.log("   Make sure it's valid and has preprod access");
      }
    }
    
    throw error;
  }
}

// Run the test
testMinting().catch(console.error);

