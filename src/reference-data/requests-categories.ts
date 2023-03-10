import { KeychainRequestTypes } from "hive-keychain-commons";

export const requestCategories = [
  {
    category: "Authority",
    items: [
      {
        name: "Add Account Authority",
        requestType: KeychainRequestTypes.addAccountAuthority,
      },
      {
        name: "Remove Account Authority",
        requestType: KeychainRequestTypes.removeAccountAuthority,
      },
      {
        name: "Add Key Authority",
        requestType: KeychainRequestTypes.addKeyAuthority,
      },
      {
        name: "Remove Key Authority",
        requestType: KeychainRequestTypes.removeKeyAuthority,
      },
    ],
  },
  {
    category: "Governance",
    items: [
      {
        name: "Witness Vote",
        requestType: KeychainRequestTypes.witnessVote,
      },
      {
        name: "Proxy",
        requestType: KeychainRequestTypes.proxy,
      },
      {
        name: "Create Proposal",
        requestType: KeychainRequestTypes.createProposal,
      },
      {
        name: "Remove Proposal",
        requestType: KeychainRequestTypes.removeProposal,
      },
      {
        name: "Update Proposal",
        requestType: KeychainRequestTypes.updateProposalVote,
      },
    ],
  },
  {
    category: "Accounts",
    items: [
      {
        name: "Add Account",
        requestType: KeychainRequestTypes.addAccount,
      },
      {
        name: "Create Claimed Account",
        requestType: KeychainRequestTypes.createClaimedAccount,
      },
    ],
  },
  {
    category: "Encode/Decode/Crypto",
    items: [
      {
        name: "Decode/Verify Key",
        requestType: KeychainRequestTypes.decode,
      },
      {
        name: "Encode Message",
        requestType: KeychainRequestTypes.encode,
      },
      {
        name: "Sign Buffer",
        requestType: KeychainRequestTypes.signBuffer,
      },
    ],
  },
  {
    category: "Operations",
    items: [
      {
        name: "Generic Broadcast",
        requestType: KeychainRequestTypes.broadcast,
      },
      {
        name: "Sign Tx",
        requestType: KeychainRequestTypes.signTx,
      },

      { name: "Custom Json", requestType: KeychainRequestTypes.custom },

      { name: "Conversion", requestType: KeychainRequestTypes.convert },
    ],
  },
  {
    category: "Hive Engine",
    items: [
      {
        name: "Send Token",
        requestType: KeychainRequestTypes.sendToken,
      },
    ],
  },
  {
    category: "Utilities",
    items: [
      {
        name: "Login",
        requestType: "login",
      },
    ],
  },
  {
    category: "Blogging",
    items: [
      {
        name: "Post",
        requestType: KeychainRequestTypes.post,
      },
      { name: "Vote", requestType: KeychainRequestTypes.vote },
    ],
  },
  {
    category: "Transfer",
    items: [
      { name: "Transfer", requestType: KeychainRequestTypes.transfer },
      {
        name: "Recurrent Transfer",
        requestType: KeychainRequestTypes.recurrentTransfer,
      },
    ],
  },
  {
    category: "HP(HIVE power)",
    items: [
      { name: "Delegation", requestType: KeychainRequestTypes.delegation },
      { name: "Power Up", requestType: KeychainRequestTypes.powerUp },
      { name: "Power Down", requestType: KeychainRequestTypes.powerDown },
    ],
  },
];
