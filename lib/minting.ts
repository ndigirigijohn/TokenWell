import { Lucid, applyParamsToScript, MintingPolicy, PolicyId, Data, mintingPolicyToId } from "@lucid-evolution/lucid";
import { initLucid, loadPlatformWallet, getOperatorPkh } from "./lucid";
import plutusBlueprint from "@/tokenwell-sc/plutus.json";
import { bech32 } from "bech32";

/**
 * Get the compiled minting policy from plutus.json
 */
function getCompiledCode(): string {
  const validator = plutusBlueprint.validators.find(
    (v) => v.title.includes("tokenwell") && v.title.includes("mint")
  );
  
  if (!validator) {
    throw new Error("TokenWell minting validator not found in plutus.json");
  }

  return validator.compiledCode;
}

/**
 * Apply parameters to the minting policy
 */
export function getMintingPolicy(operatorPkh: string): MintingPolicy {
  const compiledCode = getCompiledCode();
  
  // Apply the operator PKH parameter to the validator
  const appliedScript = applyParamsToScript(compiledCode, [operatorPkh]);

  return {
    type: "PlutusV3",
    script: appliedScript,
  };
}

/**
 * Get policy ID from the minting policy
 * Note: In Lucid Evolution 0.4.x, mintingPolicyToId is a standalone function
 */
export function getPolicyId(mintingPolicy: MintingPolicy): PolicyId {
  return mintingPolicyToId(mintingPolicy);
}

/**
 * Mint test tokens
 */
export async function mintTestTokens(params: {
  tokenName: string;
  quantity: number;
  recipientAddress: string;
  network: 'Preview' | 'Preprod';
}): Promise<string> {
  const { tokenName, quantity, recipientAddress, network } = params;

  try {
    // Initialize Lucid
    const lucid = await initLucid(network);
    
    // Load platform wallet (server-side only!)
    await loadPlatformWallet(lucid);

    // Get operator PKH
    const operatorPkh = getOperatorPkh();

    // Get minting policy
    const mintingPolicy = getMintingPolicy(operatorPkh);
    const policyId = getPolicyId(mintingPolicy);

    // Convert token name to hex for minting
    const tokenNameHex = Buffer.from(tokenName).toString('hex');

    // Convert bech32 address to hex bytes for the redeemer
    const decoded = bech32.decode(recipientAddress, 1000);
    const addressBytes = Buffer.from(bech32.fromWords(decoded.words));
    const recipientHex = addressBytes.toString('hex');

    // Build redeemer as Constructor (not Array!)
    // The Aiken Mint type expects: Constr(0, [token_name, quantity, recipient])
    const mintRedeemer = {
      index: 0,
      fields: [tokenNameHex, BigInt(quantity), recipientHex]
    };
    
    const redeemerData = Data.to(mintRedeemer);

    // Build transaction using Lucid Evolution's API
    const txBuilder = lucid.newTx();
    
    // Mint assets using the correct format for Lucid Evolution
    // Assets should be: { [unit]: amount } where unit = policyId + assetName
    const unit = policyId + tokenNameHex;
    const assets = { [unit]: BigInt(quantity) };
    
    const tx = await txBuilder
      .mintAssets(assets, redeemerData)
      .pay.ToAddress(recipientAddress, assets)
      .attach.MintingPolicy(mintingPolicy)
      .complete();

    // Sign transaction
    const signedTx = await tx.sign.withWallet().complete();

    // Submit transaction
    const txHash = await signedTx.submit();

    return txHash;
  } catch (error) {
    console.error("Minting error:", error);
    throw new Error(`Failed to mint tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

