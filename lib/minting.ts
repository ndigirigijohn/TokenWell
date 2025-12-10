import { Lucid, applyParamsToScript, MintingPolicy, PolicyId, Data } from "@lucid-evolution/lucid";
import { initLucid, loadPlatformWallet, getOperatorPkh } from "./lucid";
import plutusBlueprint from "@/tokenwell-sc/plutus.json";

/**
 * Get the compiled minting policy from plutus.json
 */
function getCompiledCode(): string {
  const validator = plutusBlueprint.validators.find(
    (v) => v.title === "token_well.tokenwell"
  );
  
  if (!validator) {
    throw new Error("TokenWell validator not found in plutus.json");
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
export function getPolicyId(mintingPolicy: MintingPolicy, lucid: Lucid): PolicyId {
  return lucid.utils.mintingPolicyToId(mintingPolicy);
}

/**
 * Build minting redeemer
 */
export function buildMintRedeemer(
  tokenName: string,
  quantity: number,
  recipient: string
): string {
  // Convert token name to hex
  const tokenNameHex = Buffer.from(tokenName).toString('hex');
  
  // Build redeemer matching the Mint type from types.ak
  // Mint { token_name: ByteArray, quantity: Int, recipient: ByteArray }
  const redeemer = Data.to({
    token_name: tokenNameHex,
    quantity: BigInt(quantity),
    recipient: recipient,
  });

  return redeemer;
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
    const policyId = getPolicyId(mintingPolicy, lucid);

    // Build redeemer
    const redeemer = buildMintRedeemer(tokenName, quantity, recipientAddress);

    // Convert token name to hex for minting
    const tokenNameHex = Buffer.from(tokenName).toString('hex');

    // Build transaction
    const tx = await lucid
      .newTx()
      .mint(
        {
          [policyId]: {
            [tokenNameHex]: BigInt(quantity),
          },
        },
        redeemer
      )
      .pay.ToAddress(recipientAddress, {
        [policyId]: {
          [tokenNameHex]: BigInt(quantity),
        },
      })
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

