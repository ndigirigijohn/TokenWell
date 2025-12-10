use aiken/collection/dict
use cardano/assets.{PolicyId, tokens}
use cardano/transaction.{Transaction}
use test_helpers.{
  create_mint_value, create_multi_asset_mint, default_params, mock_operator_pkh,
  mock_policy_id, mock_recipient, mock_token_name, mock_token_name2,
  mock_transaction,
}
use tokenwell/types.{
  Mint, MintParams, decode_mint_redeemer, require_operator_signature,
}

/// Validate mint logic - extracted for testing
/// This function contains the core business logic for validating mints.
fn validate_mint_logic(
  redeemer: Data,
  policy_id: PolicyId,
  tx: Transaction,
  params: MintParams,
) -> Bool {
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

/// TokenWell minting policy (V1).
/// Ensures:
/// - Only the operator (params.operator_pkh) can sign minting transactions.
/// - Exactly one asset is minted under this policy, matching the redeemer.
/// - Quantity must be positive.
/// - TODO: Add delivery checks (recipient receives the minted amount).
validator tokenwell(params: MintParams) {
  mint(redeemer: Data, policy_id: PolicyId, tx: Transaction) {
    validate_mint_logic(redeemer, policy_id, tx, params)
  }

  else(_) {
    fail
  }
}

// =============================================================================
// POSITIVE TESTS - Valid Minting Scenarios
// =============================================================================

/// Test: Operator can mint tokens with valid parameters
test operator_can_mint_tokens() {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 100)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params) == True
}

/// Test: Can mint with quantity = 1 (minimum valid quantity)
test can_mint_single_token() {
  let params = default_params()
  let redeemer =
    Mint { token_name: mock_token_name, quantity: 1, recipient: mock_recipient }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 1)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params) == True
}

/// Test: Can mint large quantities
test can_mint_large_quantity() {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 1_000_000,
      recipient: mock_recipient,
    }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 1_000_000)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params) == True
}

/// Test: Can mint with different token names
test can_mint_different_token_name() {
  let custom_token = #"435553544f4d"
  // "CUSTOM" in hex
  let params = default_params()
  let redeemer =
    Mint { token_name: custom_token, quantity: 50, recipient: mock_recipient }
  let mint = create_mint_value(mock_policy_id, custom_token, 50)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params) == True
}

/// Test: Can mint with empty token name
test can_mint_empty_token_name() {
  let empty_name = #""
  let params = default_params()
  let redeemer =
    Mint { token_name: empty_name, quantity: 10, recipient: mock_recipient }
  let mint = create_mint_value(mock_policy_id, empty_name, 10)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params) == True
}

/// Test: Can mint with very long token name
test can_mint_long_token_name() {
  let long_name =
    #"544f4b454e4e414d45544f4b454e4e414d45544f4b454e4e414d45544f4b454e4e414d45"
  let params = default_params()
  let redeemer =
    Mint { token_name: long_name, quantity: 5, recipient: mock_recipient }
  let mint = create_mint_value(mock_policy_id, long_name, 5)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params) == True
}

/// Test: Can mint with extra signatories (as long as operator is included)
test can_mint_with_extra_signatories() {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 100)
  let extra_pkh1 = #"10000000000000000000000000000000000000000000000000000001"
  let extra_pkh2 = #"20000000000000000000000000000000000000000000000000000002"
  let tx = mock_transaction([extra_pkh1, mock_operator_pkh, extra_pkh2], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params) == True
}

// =============================================================================
// NEGATIVE TESTS - Authorization Failures
// =============================================================================

/// Test: Unauthorized user cannot mint tokens
test unauthorized_user_cannot_mint() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 100)
  // Wrong signer
  let wrong_pkh = #"99999999999999999999999999999999999999999999999999999999"
  let tx = mock_transaction([wrong_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

/// Test: Minting fails with no signatories
test minting_fails_no_signatories() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 100)
  let tx = mock_transaction([], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

/// Test: Minting fails when operator signature is missing from multiple signatories
test minting_fails_operator_not_in_list() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 100)
  // Multiple signatures but operator not included
  let other_pkh1 = #"10000000000000000000000000000000000000000000000000000010"
  let other_pkh2 = #"20000000000000000000000000000000000000000000000000000020"
  let tx = mock_transaction([other_pkh1, other_pkh2], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

// =============================================================================
// NEGATIVE TESTS - Invalid Quantity
// =============================================================================

/// Test: Cannot mint zero tokens
test cannot_mint_zero_quantity() fail {
  let params = default_params()
  let redeemer =
    Mint { token_name: mock_token_name, quantity: 0, recipient: mock_recipient }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 0)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

/// Test: Cannot mint negative tokens
test cannot_mint_negative_quantity() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: -100,
      recipient: mock_recipient,
    }
  let mint = create_mint_value(mock_policy_id, mock_token_name, -100)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

// =============================================================================
// NEGATIVE TESTS - Mint Integrity Failures
// =============================================================================

/// Test: Minting fails when token name doesn't match redeemer
test minting_fails_wrong_token_name() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  // Transaction mints different token than redeemer specifies
  let mint = create_mint_value(mock_policy_id, mock_token_name2, 100)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

/// Test: Minting fails when quantity doesn't match redeemer
test minting_fails_wrong_quantity() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  // Transaction mints different quantity than redeemer specifies
  let mint = create_mint_value(mock_policy_id, mock_token_name, 50)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

/// Test: Minting fails when no assets are minted
test minting_fails_no_assets_minted() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  // No assets minted in transaction
  let tx = mock_transaction([mock_operator_pkh], assets.zero)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

/// Test: Minting fails when multiple assets are minted (only single asset allowed)
test minting_fails_multiple_assets() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  // Transaction tries to mint two different assets
  let mint =
    create_multi_asset_mint(
      mock_policy_id,
      mock_token_name,
      100,
      mock_token_name2,
      50,
    )
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

/// Test: Minting fails when asset name matches but quantity is higher
test minting_fails_quantity_too_high() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  // Transaction mints more than redeemer specifies
  let mint = create_mint_value(mock_policy_id, mock_token_name, 200)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

/// Test: Minting fails when asset name matches but quantity is lower
test minting_fails_quantity_too_low() fail {
  let params = default_params()
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  // Transaction mints less than redeemer specifies
  let mint = create_mint_value(mock_policy_id, mock_token_name, 99)
  let tx = mock_transaction([mock_operator_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

// =============================================================================
// NEGATIVE TESTS - Combined Failures
// =============================================================================

/// Test: Minting fails with multiple validation violations
test minting_fails_multiple_violations() fail {
  let params = default_params()
  let redeemer =
    Mint { token_name: mock_token_name, quantity: 0, recipient: mock_recipient }
  // Multiple failures: wrong quantity, wrong token, and wrong signer
  let mint = create_mint_value(mock_policy_id, mock_token_name2, 50)
  let wrong_pkh = #"99999999999999999999999999999999999999999999999999999999"
  let tx = mock_transaction([wrong_pkh], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params)
}

// =============================================================================
// EDGE CASES
// =============================================================================

/// Test: Different recipient addresses are accepted (not validated in V1)
test different_recipients_accepted() {
  let params = default_params()
  let recipient1 = #"a0000000000000000000000000000000000000000000000000000001"
  let redeemer1 =
    Mint { token_name: mock_token_name, quantity: 100, recipient: recipient1 }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 100)
  let tx = mock_transaction([mock_operator_pkh], mint)
  let result1 = validate_mint_logic(redeemer1, mock_policy_id, tx, params)
  let recipient2 = #"b0000000000000000000000000000000000000000000000000000002"
  let redeemer2 =
    Mint { token_name: mock_token_name, quantity: 100, recipient: recipient2 }
  let result2 = validate_mint_logic(redeemer2, mock_policy_id, tx, params)
  result1 && result2
}

/// Test: Can use different operator public key hash
test different_operator_can_mint() {
  let different_operator =
    #"a0000000000000000000000000000000000000000000000000000099"
  let params = MintParams { operator_pkh: different_operator }
  let redeemer =
    Mint {
      token_name: mock_token_name,
      quantity: 100,
      recipient: mock_recipient,
    }
  let mint = create_mint_value(mock_policy_id, mock_token_name, 100)
  let tx = mock_transaction([different_operator], mint)
  validate_mint_logic(redeemer, mock_policy_id, tx, params) == True
}
