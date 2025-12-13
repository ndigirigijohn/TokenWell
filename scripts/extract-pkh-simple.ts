/**
 * Simple PKH extractor - decodes Cardano address to extract payment credential hash
 * No network connection required!
 */

import * as fs from "fs";
import * as path from "path";
import { bech32 } from "bech32";
import * as crypto from "crypto";

function decodeBech32Address(address: string): string {
  try {
    // Decode the bech32 address
    const decoded = bech32.decode(address, 1000);
    const words = decoded.words;
    
    // Convert from 5-bit to 8-bit
    const data = Buffer.from(bech32.fromWords(words));
    
    // For base addresses:
    // Byte 0: Header (network + address type)
    // Bytes 1-28: Payment credential hash (28 bytes)
    // Bytes 29-56: Stake credential hash (28 bytes)
    
    // Skip the first byte (header) and extract the next 28 bytes (payment credential)
    const paymentCredentialHash = data.slice(1, 29);
    
    return paymentCredentialHash.toString('hex');
  } catch (error) {
    throw new Error(`Failed to decode address: ${error}`);
  }
}

function hashVerificationKey(vkey: string): string {
  // Remove the "ed25519_pk" prefix if present
  const cleanVKey = vkey.replace('ed25519_pk1', '');
  
  // Decode from bech32
  try {
    const decoded = bech32.decode(vkey, 1000);
    const vkeyBytes = Buffer.from(bech32.fromWords(decoded.words));
    
    // Hash with BLAKE2b-224 (28 bytes / 224 bits)
    const hash = crypto.createHash('blake2b512').update(vkeyBytes).digest();
    // Take first 28 bytes for BLAKE2b-224
    return hash.slice(0, 28).toString('hex');
  } catch (error) {
    console.log("Note: Could not decode verification key, using address decoding instead");
    return "";
  }
}

async function extractPKH() {
  try {
    // Read wallet JSON
    const walletPath = path.join(process.cwd(), "Temp", "wallet.json");
    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));

    console.log("🔐 Extracting Operator PKH...\n");

    // Get the base address
    const baseAddress = walletData.addresses.base;
    console.log("Base Address:", baseAddress);

    // Decode address to extract PKH
    const operatorPKH = decodeBech32Address(baseAddress);

    console.log("\n✅ OPERATOR PKH (for Aiken contract):");
    console.log("━".repeat(64));
    console.log(operatorPKH);
    console.log("━".repeat(64));

    // Also show the payment verification key
    const paymentVKey = walletData.keys.payment.verificationKey;
    console.log("\nPayment Verification Key:", paymentVKey);

    // Save to a config file for easy access
    const config = {
      network: walletData.network,
      operatorPKH: operatorPKH,
      operatorAddress: baseAddress,
      paymentVerificationKey: paymentVKey,
      generatedAt: new Date().toISOString(),
    };

    const configPath = path.join(process.cwd(), "Temp", "operator-config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log(`\n📝 Configuration saved to: ${configPath}`);
    console.log("\n🎯 Next steps:");
    console.log("1. Use this PKH to compile your Aiken smart contract:");
    console.log(`   MintParams { operator_pkh: #"${operatorPKH}" }`);
    console.log("\n2. The contract will only allow this operator to mint tokens");
    console.log("3. Keep your wallet.json safe - it contains the signing keys!");

    return operatorPKH;
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// Run the script
extractPKH().catch(console.error);

