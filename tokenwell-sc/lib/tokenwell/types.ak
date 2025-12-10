use aiken/collection/list
use cardano/transaction.{Transaction}

/// Parameters applied to the minting policy at compile time.
/// - `operator_pkh`: public key hash that must sign V1 mints.
pub type MintParams {
  MintParams { operator_pkh: ByteArray }
}

/// Redeemer used by the V1 minting policy.
/// Kept structured so we can evolve without breaking the interface.
pub type MintRedeemer {
  Mint { token_name: ByteArray, quantity: Int, recipient: ByteArray }
}

/// Decode raw redeemer data into the typed V1 redeemer.
/// TODO: Add field-level validation (e.g., non-empty name, positive quantity).
pub fn decode_mint_redeemer(redeemer: Data) -> MintRedeemer {
  // Expect the on-chain redeemer to match the MintRedeemer shape.
  // Fails validation if the caller provides an unexpected data layout.
  expect mint_redeemer: MintRedeemer = redeemer
  mint_redeemer
}

/// Verify the operator signature for V1.
pub fn require_operator_signature(
  tx: Transaction,
  operator_pkh: ByteArray,
) -> Bool {
  // Succeeds only if the operator's key hash is in the extra signatories list.
  list.has(tx.extra_signatories, operator_pkh)
}
