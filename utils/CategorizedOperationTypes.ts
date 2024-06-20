const categorizedOperationTypes = [
    {
      name: "Posting",
      types: [
        "comment_operation",
        "delete_comment_operation",
        "comment_options_operation",
        "ineffective_delete_comment_operation",
        "author_reward_operation",
        "comment_reward_operation",
        "comment_payout_update_operation",
        "comment_benefactor_reward_operation",
      ],
    },
    {
      name: "Curation",
      types: [
        "vote_operation",
        "effective_comment_vote_operation",
        "curation_reward_operation",
        "claim_reward_balance_operation",
      ],
    },
    {
      name: "Transfer",
      types: [
        "transfer_operation",
        "recurrent_transfer_operation",
        "fill_recurrent_transfer_operation",
        "failed_recurrent_transfer_operation",
        "transfer_to_savings_operation",
        "transfer_from_savings_operation",
        "cancel_transfer_from_savings_operation",
        "fill_transfer_from_savings_operation",
      ],
    },
    {
      name: "Market",
      types: [
        "interest_operation",
        "limit_order_create_operation",
        "limit_order_create2_operation",
        "limit_order_cancel_operation",
        "limit_order_cancelled_operation",
        "fill_order_operation",
        "liquidity_reward_operation",
        "convert_operation",
        "fill_convert_request_operation",
        "collateralized_convert_operation",
        "collateralized_convert_immediate_conversion_operation",
        "fill_collateralized_convert_request_operation",
        "escrow_transfer_operation",
        "escrow_approve_operation",
        "escrow_approved_operation",
        "escrow_rejected_operation",
        "escrow_dispute_operation",
        "escrow_release_operation",
      ],
    },
    {
      name: "Vesting",
      types: [
        "transfer_to_vesting_operation",
        "transfer_to_vesting_completed_operation",
        "withdraw_vesting_operation",
        "fill_vesting_withdraw_operation",
        "set_withdraw_vesting_route_operation",
        "delegate_vesting_shares_operation",
        "return_vesting_delegation_operation",
      ],
    },
    {
      name: "Account management",
      types: [
        "account_create_operation",
        "claim_account_operation",
        "create_claimed_account_operation",
        "account_create_with_delegation_operation",
        "account_created_operation",
        "account_update_operation",
        "account_update2_operation",
        "request_account_recovery_operation",
        "recover_account_operation",
        "change_recovery_account_operation",
        "changed_recovery_account_operation",
        "set_reset_account_operation",
        "reset_account_operation",
      ],
    },
    {
      name: "Witness management",
      types: [
        "feed_publish_operation",
        "witness_update_operation",
        "witness_set_properties_operation",
        "shutdown_witness_operation",
        "producer_reward_operation",
        "pow_operation",
        "pow2_operation",
        "pow_reward_operation",
        "producer_missed_operation",
        "witness_block_approve_operation",
      ],
    },
    {
      name: "Witness voting",
      types: [
        "account_witness_vote_operation",
        "account_witness_proxy_operation",
        "proxy_cleared_operation",
        "delayed_voting_operation",
        "expired_account_notification_operation",
        "decline_voting_rights_operation",
        "declined_voting_rights_operation",
      ],
    },
    {
      name: "Proposals",
      types: [
        "update_proposal_votes_operation",
        "create_proposal_operation",
        "proposal_fee_operation",
        "remove_proposal_operation",
        "update_proposal_operation",
        "proposal_pay_operation",
      ],
    },
    {
      name: "Custom",
      types: [
        "custom_operation",
        "custom_json_operation",
        "custom_binary_operation",
      ],
    },
    {
      name: "Other",
      types: [
        "hardfork_operation",
        "hardfork_hive_operation",
        "hardfork_hive_restore_operation",
        "clear_null_account_balance_operation",
        "consolidate_treasury_balance_operation",
        "dhf_funding_operation",
        "dhf_conversion_operation",
        "vesting_shares_split_operation",
        "system_warning_operation",
      ],
    },
  ];

export default categorizedOperationTypes;
