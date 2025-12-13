/**
 * Setup .env file with operator configuration
 */

import * as fs from "fs";
import * as path from "path";

function setupEnv() {
  try {
    console.log("⚙️  Setting up environment variables...");
    console.log("━".repeat(64));

    // Load configurations
    const walletPath = path.join(process.cwd(), "Temp", "wallet.json");
    const deployPath = path.join(process.cwd(), "Temp", "deploy-config.json");

    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
    const deployData = JSON.parse(fs.readFileSync(deployPath, "utf-8"));

    // Read existing .env or create new one
    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
      console.log("📝 Updating existing .env.local file...");
    } else {
      console.log("📝 Creating new .env.local file...");
    }

    // Helper function to update or add env variable
    const updateEnvVar = (key: string, value: string) => {
      const regex = new RegExp(`^${key}=.*$`, "m");
      const line = `${key}="${value}"`;

      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, line);
      } else {
        envContent += `\n${line}`;
      }
    };

    // Update/add required variables
    console.log("\n📋 Adding configuration:");
    
    console.log("   • OPERATOR_PKH");
    updateEnvVar("OPERATOR_PKH", deployData.operatorPKH);

    console.log("   • PLATFORM_SEED");
    updateEnvVar("PLATFORM_SEED", walletData.mnemonic.phrase);

    // Add network-specific Blockfrost keys if they don't exist
    if (!envContent.includes("NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD")) {
      console.log("   • NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD (placeholder)");
      updateEnvVar(
        "NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD",
        "preprodXXXXXXXXXXXXXXXX"
      );
    }

    if (!envContent.includes("NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW")) {
      console.log("   • NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW (placeholder)");
      updateEnvVar(
        "NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW",
        "previewXXXXXXXXXXXXXXXX"
      );
    }

    // Write updated .env file
    fs.writeFileSync(envPath, envContent.trim() + "\n");

    console.log("\n✅ Environment configured successfully!");
    console.log(`📄 File: ${envPath}`);
    
    console.log("\n⚠️  IMPORTANT: Get your Blockfrost API keys:");
    console.log("   1. Visit: https://blockfrost.io/");
    console.log("   2. Create a free account");
    console.log("   3. Create projects for Preprod and Preview networks");
    console.log("   4. Copy your API keys");
    console.log("   5. Update NEXT_PUBLIC_BLOCKFROST_API_KEY_* in .env.local");
    
    console.log("\n🔐 SECURITY WARNING:");
    console.log("   • Keep .env.local SECRET!");
    console.log("   • Never commit it to git");
    console.log("   • It contains your wallet seed phrase");

    console.log("\n━".repeat(64));
    console.log("📊 Configuration Summary:");
    console.log("━".repeat(64));
    console.log(`Policy ID:      ${deployData.policyId}`);
    console.log(`Operator PKH:   ${deployData.operatorPKH}`);
    console.log(`Operator Addr:  ${deployData.operatorAddress}`);
    console.log(`Network:        ${deployData.network}`);
    console.log("━".repeat(64));

    console.log("\n🎯 Next Step:");
    console.log("   1. Get Blockfrost API keys (see instructions above)");
    console.log("   2. Update .env.local with your API keys");
    console.log("   3. Restart your Next.js dev server");
    console.log("   4. Run '4-test-minting.ts' to test the platform");

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// Run the script
setupEnv();

