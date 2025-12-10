"use client";

import { useState } from "react";
import { getCardanoscanUrl, formatTokenQuantity } from "@/lib/utils";

type Network = 'Preview' | 'Preprod';

interface MintFormData {
  tokenName: string;
  quantity: number;
  recipientAddress: string;
  network: Network;
}

export default function MintForm() {
  const [formData, setFormData] = useState<MintFormData>({
    tokenName: "",
    quantity: 1000,
    recipientAddress: "",
    network: "Preview",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setTxHash(data.txHash);
      } else {
        setError(data.error || "Failed to mint tokens");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Name Input */}
        <div className="space-y-2">
          <label htmlFor="tokenName" className="block text-sm font-semibold text-gray-200">
            Token Name
          </label>
          <input
            type="text"
            id="tokenName"
            value={formData.tokenName}
            onChange={(e) =>
              setFormData({ ...formData, tokenName: e.target.value })
            }
            placeholder="e.g., tUSDM, TestToken"
            className="w-full px-4 py-3.5 bg-secondary-dark/50 border border-gray-700/50 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-primary/50 focus:border-primary/50 focus:bg-secondary-dark/70
                     hover:border-gray-600/50 transition-all duration-200"
            required
          />
          <p className="text-xs text-gray-500">
            Choose any name for your test token
          </p>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <label htmlFor="quantity" className="block text-sm font-semibold text-gray-200">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
            }
            min="1"
            placeholder="1000"
            className="w-full px-4 py-3.5 bg-secondary-dark/50 border border-gray-700/50 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-primary/50 focus:border-primary/50 focus:bg-secondary-dark/70
                     hover:border-gray-600/50 transition-all duration-200"
            required
          />
          <p className="text-xs text-gray-500">
            You'll receive {formatTokenQuantity(formData.quantity)} tokens
          </p>
        </div>

        {/* Recipient Address */}
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-semibold text-gray-200">
            Recipient Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.recipientAddress}
            onChange={(e) =>
              setFormData({ ...formData, recipientAddress: e.target.value })
            }
            placeholder="addr_test1..."
            className="w-full px-4 py-3.5 bg-secondary-dark/50 border border-gray-700/50 rounded-xl 
                     text-white placeholder-gray-500 font-mono text-sm focus:outline-none 
                     focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-secondary-dark/70
                     hover:border-gray-600/50 transition-all duration-200"
            required
          />
          <p className="text-xs text-gray-500">
            Testnet address where tokens will be sent
          </p>
        </div>

        {/* Network Selector */}
        <div className="space-y-2">
          <label htmlFor="network" className="block text-sm font-semibold text-gray-200">
            Network
          </label>
          <div className="flex gap-3">
            {(['Preview', 'Preprod'] as Network[]).map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => setFormData({ ...formData, network: net })}
                className={`flex-1 px-4 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                  formData.network === net
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 scale-[1.02]"
                    : "bg-secondary-dark/50 text-gray-300 hover:bg-secondary-dark/70 border border-gray-700/50 hover:border-gray-600/50"
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full px-6 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl
                   hover:shadow-lg hover:shadow-primary/40 transform hover:scale-[1.02] transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   flex items-center justify-center gap-2 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <span className="relative flex items-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Minting Tokens...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Mint Tokens
              </>
            )}
          </span>
        </button>
      </form>

      {/* Success Message */}
      {txHash && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-green-400 font-semibold mb-1">
                Tokens Minted Successfully! 🎉
              </h3>
              <p className="text-sm text-gray-300 mb-2">
                Your {formatTokenQuantity(formData.quantity)} {formData.tokenName} tokens 
                have been minted and sent to your address.
              </p>
              <a
                href={getCardanoscanUrl(txHash, formData.network)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-light hover:text-primary 
                         transition-colors duration-200 text-sm font-medium"
              >
                View on Cardanoscan
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-red-400 font-semibold mb-1">
                Minting Failed
              </h3>
              <p className="text-sm text-gray-300">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

