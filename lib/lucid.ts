import { Lucid, Blockfrost, Network } from "@lucid-evolution/lucid";

/**
 * Initialize Lucid instance with Blockfrost provider
 */
export async function initLucid(network: 'Preview' | 'Preprod'): Promise<Lucid> {
  const networkEnum = network === 'Preview' ? 'Preview' : 'Preprod';
  
  const apiKey = network === 'Preview' 
    ? process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY_PREVIEW
    : process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD;

  if (!apiKey) {
    throw new Error(`Blockfrost API key for ${network} not found`);
  }

  const blockfrostUrl = `https://cardano-${network.toLowerCase()}.blockfrost.io/api/v0`;

  const lucid = await Lucid(
    new Blockfrost(blockfrostUrl, apiKey),
    networkEnum as Network
  );

  return lucid;
}

/**
 * Load platform wallet from seed phrase (server-side only!)
 */
export async function loadPlatformWallet(lucid: Lucid): Promise<Lucid> {
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

