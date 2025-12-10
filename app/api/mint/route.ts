import { NextRequest, NextResponse } from "next/server";
import { mintTestTokens } from "@/lib/minting";
import { isValidCardanoAddress } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenName, quantity, recipientAddress, network } = body;

    // Validation
    if (!tokenName || typeof tokenName !== 'string') {
      return NextResponse.json(
        { error: "Token name is required and must be a string" },
        { status: 400 }
      );
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    if (!recipientAddress || !isValidCardanoAddress(recipientAddress)) {
      return NextResponse.json(
        { error: "Valid Cardano testnet address is required" },
        { status: 400 }
      );
    }

    if (network !== 'Preview' && network !== 'Preprod') {
      return NextResponse.json(
        { error: "Network must be either Preview or Preprod" },
        { status: 400 }
      );
    }

    // Mint tokens
    const txHash = await mintTestTokens({
      tokenName,
      quantity,
      recipientAddress,
      network,
    });

    return NextResponse.json({
      success: true,
      txHash,
      message: "Tokens minted successfully!",
    });

  } catch (error) {
    console.error("API error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to mint tokens",
        success: false
      },
      { status: 500 }
    );
  }
}

