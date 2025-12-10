use aiken/collection/dict
use aiken/interval
use cardano/assets.{AssetName, PolicyId, Value, add, from_asset}
use cardano/transaction.{Transaction}
use tokenwell/types.{MintParams}

// ← Add this import

/// Create a mock Transaction for testing purposes
pub fn mock_transaction(
  extra_signatories: List<ByteArray>,
  mint: Value,
) -> Transaction {
  Transaction {
    inputs: [],
    reference_inputs: [],
    outputs: [],
    fee: 0,
    mint,
    certificates: [],
    withdrawals: [],
    validity_range: create_interval(0, 1000),
    extra_signatories,
    redeemers: [],
    datums: dict.empty,
    id: #"",
    votes: [],
    proposal_procedures: [],
    current_treasury_amount: None,
    treasury_donation: None,
  }
}

/// Helper to create a single-asset mint value
pub fn create_mint_value(
  policy: PolicyId,
  asset_name: AssetName,
  amount: Int,
) -> Value {
  from_asset(policy, asset_name, amount)
}

/// Helper to create multi-asset mint value
pub fn create_multi_asset_mint(
  policy: PolicyId,
  asset1: AssetName,
  amount1: Int,
  asset2: AssetName,
  amount2: Int,
) -> Value {
  let mint1 = from_asset(policy, asset1, amount1)
  add(mint1, policy, asset2, amount2)
}

/// Mock interval for transaction validity
fn create_interval(lower: Int, upper: Int) -> interval.Interval {
  interval.Interval {
    lower_bound: interval.IntervalBound {
      bound_type: interval.Finite(lower),
      is_inclusive: True,
    },
    upper_bound: interval.IntervalBound {
      bound_type: interval.Finite(upper),
      is_inclusive: True,
    },
  }
}

/// Mock operator public key hash for testing
pub const mock_operator_pkh: ByteArray =
  #"00000000000000000000000000000000000000000000000000000001"

/// Mock recipient address for testing
pub const mock_recipient: ByteArray =
  #"00000000000000000000000000000000000000000000000000000002"

/// Mock policy ID for testing
pub const mock_policy_id: PolicyId =
  #"00000000000000000000000000000000000000000000000000000003"

/// Mock token name (hex for "TOKEN")
pub const mock_token_name: AssetName = #"544f4b454e"

/// Another mock token name for multi-asset tests (hex for "TOKEN2")
pub const mock_token_name2: AssetName = #"544f4b454e32"

/// Helper to create default test parameters
pub fn default_params() -> MintParams {
  // ← Fixed: Use imported type name
  MintParams { operator_pkh: mock_operator_pkh }
  // ← Fixed: Use short name
}
