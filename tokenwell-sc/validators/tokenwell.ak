use aiken/collection/dict
use cardano/assets.{PolicyId, tokens}
use cardano/transaction.{Transaction}
use tokenwell/types.{
  Mint, MintParams, decode_mint_redeemer, require_operator_signature,
}

/// TokenWell minting policy (V1).
/// Ensures:
/// - Only the operator (params.operator_pkh) can sign minting transactions.
/// - Exactly one asset is minted under this policy, matching the redeemer.
/// - Quantity must be positive.
/// - TODO: Add delivery checks (recipient receives the minted amount).
validator tokenwell(params: MintParams) {
  mint(redeemer: Data, policy_id: PolicyId, tx: Transaction) {
    // Parse redeemer into a structured type so we can evolve it safely.
    let Mint { token_name, quantity, recipient: _recipient } =
      decode_mint_redeemer(redeemer)

    // Pull relevant transaction fields.
    let Transaction { mint, .. } = tx

    // 1) Operator signature required.
    let operator_signed = require_operator_signature(tx, params.operator_pkh)

    // 2) Quantity must be strictly positive.
    let valid_quantity = quantity > 0

    // 3) Enforce minted assets match redeemer (only one asset under this policy).
    let minted_assets = mint |> tokens(policy_id) |> dict.to_pairs()
    let correct_mint =
      when minted_assets is {
        [] -> False
        [Pair(asset_name, amount)] ->
          asset_name == token_name && amount == quantity
        _ -> False
      }

    // 4) TODO: Ensure the minted amount is sent to `recipient`.
    //    This will require decoding the recipient into an address and
    //    summing outputs for the policy + asset name.
    //    Currently, recipient is extracted but not validated.
    operator_signed && valid_quantity && correct_mint
  }

  else(_) {
    fail
  }
}
