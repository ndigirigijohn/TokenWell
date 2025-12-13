/**
 * Get Policy ID from compiled smart contract
 * Note: Policy ID calculation doesn't require network access!
 */

import { applyParamsToScript } from "@lucid-evolution/lucid";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import plutusBlueprint from "../tokenwell-sc/plutus.json";

// Calculate policy ID without network connection
function calculatePolicyId(scriptCbor: string): string {
  // Decode CBOR hex to bytes
  const scriptBytes = Buffer.from(scriptCbor, "hex");
  
  // Create script hash: hash(0x02 + script)
  // 0x02 is the tag for PlutusV3 scripts
  const taggedScript = Buffer.concat([Buffer.from([0x02]), scriptBytes]);
  
  // Hash with blake2b-224 (28 bytes)
  const hash = crypto.createHash("blake2b512").update(taggedScript).digest();
  const policyId = hash.slice(0, 28).toString("hex");
  
  return policyId;
}

async function getPolicyId() {
  try {
    console.log("🔑 Generating Policy ID...");
    console.log("━".repeat(64));

    // Load network config
    const networkConfigPath = path.join(process.cwd(), "scripts", "config.json");
    const networkConfig = JSON.parse(fs.readFileSync(networkConfigPath, "utf-8"));
    const network = networkConfig.network as "preview" | "preprod";
    const networkCapitalized = network.charAt(0).toUpperCase() + network.slice(1);

    // Load operator config
    const configPath = path.join(process.cwd(), "Temp", "operator-config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const operatorPKH = config.operatorPKH;

    console.log(`📡 Network: ${networkCapitalized}`);
    console.log(`📋 Operator PKH: ${operatorPKH}`);
    console.log("");

    // Get the compiled validator (looking for the mint endpoint)
    const validator = plutusBlueprint.validators.find(
      (v) => v.title.includes("tokenwell") && v.title.includes("mint")
    );

    if (!validator) {
      console.error("Available validators:", plutusBlueprint.validators.map(v => v.title));
      throw new Error("TokenWell minting validator not found in plutus.json");
    }

    console.log(`📜 Validator: ${validator.title}`);
    console.log(`🔗 Validator Hash: ${validator.hash}`);
    console.log("");

    // Apply parameters to the script
    console.log("⚙️  Applying operator PKH parameter...");
    const appliedScript = applyParamsToScript(validator.compiledCode, [
      operatorPKH,
    ]);

    // Calculate policy ID (no network needed!)
    const policyId = calculatePolicyId(appliedScript);

    console.log("✅ Policy ID Generated!");
    console.log("━".repeat(64));
    console.log(policyId);
    console.log("━".repeat(64));

    // Save deployment config
    const deployConfig = {
      network: network,
      operatorPKH: operatorPKH,
      operatorAddress: config.operatorAddress,
      policyId: policyId,
      validatorHash: validator.hash,
      appliedScriptCbor: appliedScript,
      compiledAt: new Date().toISOString(),
    };

    const deployPath = path.join(process.cwd(), "Temp", "deploy-config.json");
    fs.writeFileSync(deployPath, JSON.stringify(deployConfig, null, 2));

    console.log("");
    console.log(`📝 Configuration saved to: ${deployPath}`);
    console.log("");
    console.log("🎯 Next Steps:");
    console.log("1. Copy your policy ID (shown above)");
    console.log("2. Update your .env file with:");
    console.log(`   OPERATOR_PKH=${operatorPKH}`);
    console.log(`   PLATFORM_SEED="your 24-word seed phrase"`);
    console.log("");
    console.log("3. Run script 3 to setup your environment");
    console.log("");
    console.log("━".repeat(64));

    return {
      policyId,
      operatorPKH,
      validatorHash: validator.hash,
    };
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// Run the script
getPolicyId().catch(console.error);
