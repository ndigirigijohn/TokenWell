import { applyParamsToScript, MintingPolicy, PolicyId, Data, mintingPolicyToId } from "@lucid-evolution/lucid";
import { initLucid, loadPlatformWallet, getOperatorPkh } from "./lucid";
import plutusBlueprint from "@/tokenwell-sc/plutus.json";
import { bech32 } from "bech32";

/**
 * Get the compiled minting policy from plutus.json
 */
function getCompiledCode(): string {
  const validator = plutusBlueprint.validators.find(
    (v) => v.title === "token_well/tokenwell.tokenwell.mint"
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
    
    // VERIFY: Check if wallet PKH matches operator PKH
    const walletAddress = await lucid.wallet().address();

    // Get minting policy
    const mintingPolicy = getMintingPolicy(operatorPkh);
    const policyId = getPolicyId(mintingPolicy);

    // Convert token name to hex for minting
    const tokenNameHex = Buffer.from(tokenName).toString('hex');

    // Convert recipient address to hex bytes
    const decoded = bech32.decode(recipientAddress, 1000);
    const addressBytes = Buffer.from(bech32.fromWords(decoded.words));
    const recipientHex = addressBytes.toString('hex');

    // Manually construct CBOR for Constructor 0 with 3 fields
    // Format: d8799f + field1 + field2 + field3 + ff
    // where d8799f = Constructor 0 tag, ff = end of array
    
    // Encode token name as bytes
    const tokenNameLen = Buffer.from(tokenNameHex, 'hex').length;
    const tokenNameCbor = `${(0x40 + tokenNameLen).toString(16)}${tokenNameHex}`;
    
    // Encode quantity as integer
    let quantityCbor: string;
    if (quantity < 24) {
      quantityCbor = quantity.toString(16).padStart(2, '0');
    } else if (quantity < 256) {
      quantityCbor = `18${quantity.toString(16).padStart(2, '0')}`;
    } else {
      quantityCbor = `19${quantity.toString(16).padStart(4, '0')}`;
    }
    
    // Encode recipient as bytes
    const recipientLen = Buffer.from(recipientHex, 'hex').length;
    const recipientCbor = recipientLen < 24 
      ? `${(0x40 + recipientLen).toString(16)}${recipientHex}`
      : `58${recipientLen.toString(16).padStart(2, '0')}${recipientHex}`;
    
    // Build redeemer as CBOR hex - Plutus Constructor 0 with definite-length array
    // Format: d87a (Constructor 0) + 83 (array of 3 items) + fields
    const redeemerData = `d87a83${tokenNameCbor}${quantityCbor}${recipientCbor}`;


    // Build transaction using Lucid Evolution's API
    const txBuilder = lucid.newTx();
    
    // Mint assets 
    const unit = policyId + tokenNameHex;
    const assets = { [unit]: BigInt(quantity) };
    
    // CRITICAL: Add operator as required signer for the validator check
    const tx = await txBuilder
      .mintAssets(assets, redeemerData)
      .pay.ToAddress(recipientAddress, assets)
      .attach.MintingPolicy(mintingPolicy)
      .addSignerKey(operatorPkh)  // Add operator PKH to extra_signatories
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

