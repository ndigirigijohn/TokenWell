import { Lucid, Blockfrost, Network } from "@lucid-evolution/lucid";

/**
 * Initialize Lucid instance with Blockfrost provider
 */
export async function initLucid(network: 'Preview' | 'Preprod'): Promise<Awaited<ReturnType<typeof Lucid>>> {
  try {
    const networkEnum = network === 'Preview' ? 'Preview' : 'Preprod';
    
    const apiKey = network === 'Preview' 
      ? process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW
      : process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD;

    if (!apiKey) {
      throw new Error(`Blockfrost API key for ${network} not found`);
    }

    const blockfrostUrl = `https://cardano-${network.toLowerCase()}.blockfrost.io/api/v0`;
    const provider = new Blockfrost(blockfrostUrl, apiKey);
    
    // Verify provider is working by fetching protocol parameters
    await provider.getProtocolParameters();
    
    const lucid = await Lucid(provider, networkEnum as Network);
    
    return lucid;
  } catch (error) {
    console.error("Error initializing Lucid:", error);
    throw error;
  }
}

/**
 * Load platform wallet from seed phrase (server-side only!)
 */
export async function loadPlatformWallet(lucid: Awaited<ReturnType<typeof Lucid>>): Promise<Awaited<ReturnType<typeof Lucid>>> {
  const seed = process.env.PLATFORM_SEED;
  
  if (!seed) {
    throw new Error('Platform seed not configured');
  }

  lucid.selectWallet.fromSeed(seed);
  return lucid;
}

/**
 * Get operator public key hash from environment
 */
export function getOperatorPkh(): string {
  const pkh = process.env.OPERATOR_PKH;
  
  if (!pkh) {
    throw new Error('Operator PKH not configured');
  }

  return pkh;
}

