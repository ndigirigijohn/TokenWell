import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format token quantity with commas
 */
export function formatTokenQuantity(quantity: number): string {
  return quantity.toLocaleString();
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars = 8): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Get Cardanoscan URL for transaction
 */
export function getCardanoscanUrl(txHash: string, network: 'Preview' | 'Preprod'): string {
  const subdomain = network.toLowerCase();
  return `https://${subdomain}.cardanoscan.io/transaction/${txHash}`;
}

/**
 * Validate Cardano address format
 */
export function isValidCardanoAddress(address: string): boolean {
  // Basic validation for testnet addresses
  return /^addr_test1[a-z0-9]{53,}$/i.test(address);
}

/**
 * Convert hex string to ASCII
 */
export function hexToAscii(hex: string): string {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

/**
 * Convert ASCII to hex string
 */
export function asciiToHex(str: string): string {
  return Array.from(str)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

