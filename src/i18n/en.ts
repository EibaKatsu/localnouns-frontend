import languages from "@/i18n/languages";
import { prefecture_en as prefecture } from "@/i18n/prefectures";

const lang = {
  nav: {
    top: "Top",
    mint: "Mint",
    list: "List",
    owner: "MyPage",
    p2pSale: "P2PSale",
    p2pTrade: "P2PTrade",
    goods: "Goods",
    about: "About",
    terms: "Terms",
    tokushoho: "Tokushoho",
    explanation: "Explanation",
    privacy: "Privacy Policy",
  },
  menu: {
    connect: "Connect",
    connected: "Sign In",
    signedIn: "Sign Out",
    nometamask: "No Metamask",
    useMetamask:
      "If you are on a mobile phone, please access it through the MetaMask app browser",
    switch: "Switch",
    form: "Submission Form",
    switchNetwork: "Change the network to which the wallet is connected",
  },
  mint: {
    saleLock: "Mint Sale is not available",
    publicSale: "Now On Sale For Public",
    alSale: "Now On Sale For Specific NFT Holders",
    total: "Total",
    mint: "Mint",
    price: "Price",
    connectWallet: "Connect Wallet from above right button.",
    notHasSpecificNFT: "This address does not have the NFT for AL Sale",
    overMintLimit: "The maximum number of mints has been reached",
    recentlyMinted: "Recently minted LocalNouns.⌐◨-◨",
    finishMint: "Mint Finished!!",
    terms: "Agree to the `Terms`",
    tokushoho: "Agree to the `Tokushoho`",
    explanation: "Agree to the `Explanation`",
    privacy: "Agree to the `Privacy Policy`",
  },
  finishMintDialog: {
    message: "Mint Finished!!",
    message2: "It may take some time for the NFT to appear on this site",
  },
  errorDialog: {
    message: "Error has occurred. Please wait a moment and try again.",
    message2:
      "If you see“missing revert data”, your ETH balance may be insufficient.",
  },
  list: {
    description: "You can parchace Local Nouns here.",
    purchace: "Buy",
    trade: "Trade",
    onTrade: "onTrade",
    onSale: "onSale",
    manage: "Owner",
  },
  owner: {
    description: "These are your local Nouns that you own.",
  },
  prefectures: {
    prefectures: "Prefecture",
  },
  listSortOrder: {
    sortOrder: "Sort order",
    lower: "Price lower",
    higher: "Price higher",
    older: "Older",
    newer: "Newer",
  },
  numOfMint: {
    numOfMint: "Quantity",
  },
  tokenDetail: {
    owner: "Owner",
  },
  tokenManagement: {
    sale: "Sales condition",
    saleDescription:
      "please set the P2P Sale price. the royalty 5% is included.",
    setSalePrice: "Set a price greater than 0 ETH to be listed for sale",
    setPriceButton: "Set Price",
    stopSaleButton: "Stop Sale",
    trade: "Trade condition",
    tradeDescription: "Select the prefecture trade for.",
    setTrade:
      "please set the prefectures trade for. the commission is 0.002ETH.(Gas cost is not included.)",
    setTradeButton: "Offer for trade",
    stopTradeButton: "Stop Trade",
    close: "Close",
    finishSetSalePrice: "Finished setting sale price!",
    finishRemoveSalePrice: "removed setting sale price!",
    validSelectPrefectures:
      "select `not specified` or at least one prefectureat least one prefecture",
    finishSetTrade: "Finished setting trade condition!",
    finishStopTrade: "Finished removing trade condition!",
  },
  TokenSaleOrTrade: {
    sale: "Sale",
    saleDescription:
      "Only Nouns for which the owner has set a selling price can be purchased.",
    buy: "Buy",
    trade: "Trade",
    tradeDescription:
      "Exchanges for Nouns owned by you. If a prefecture is specified, only Nouns of that prefecture can be exchanged.",
    tradeForPrefecture: "trade for",
    tradeForNoun: "trade noun",
    finishBuyNoun: "Successfully purchased Noun!",
    selectNounForTrade: "Select a noun for trade",
    finishTradeNoun: "Successfully traded Noun!",
    notHasTradableNouns: "Not have any Nouns available for exchange.",
  },
  validator: {
    validNumber: "Enter a number greater than 0",
  },
  commingSoon: {
    commingSoon: "Comming Soon",
  },
  message: {
    description:
      "Nouns Art Festival (NounsFes)is an online art festival with a purpose to promote a peaceful and sustainable world,founded by members of NounsDAO.",
    prized2022:
      "After six months of online competition, the best works for 2022 have been decided.",
    thanks2022:
      "Thank you for your application. Nounsfes will be held again in 2023, so please look forward to it!",
    grand: "Grand Prize",
    excellent: "excellent work",
    processing: "Processing...",
    walletId: "Wallet Id:",
    pleaseInstall:
      "Please install Metamask to check your membership, if you have a supporter NFT.",
    pleaseConnect:
      "Please connect your Metamask to check your membership, if you have a supporter NFT.",
    pleaseSwitchToPolygon: "Please switch the Polygon network.",
    youHaveNFTs:
      "You have {namedNounCount} Named Noun NFT(s). Thank you for being a supporter!",
    youHaveNouns:
      "You have {nounsCount} Nouns Love NFTs. Thank you for being a supporter!",
    please_connect:
      "If you have Token, please connect Wallet with the Connect button on the right.",
    hello: "hello world",
  },
  vote: {
    title: "NounsArtFestival2022 Final Vote!",
    description:
      "Nouns Art Festival (NounsFes)is an online art festival with a purpose to promote a peaceful and sustainable world,founded by members of NounsDAO.",
    voted_thanks:
      "Thank you for voting. Please wait for a while until the results are announced.",
    how_to_vote:
      "We will vote on the nomination works and select the excellent works.. You can post your favorite work one person at a time. To vote, you need to hold one of the following NFT.",
    vote_notice:
      "Please post your favorite work one person at a time. Please note that once you vote, you cannot change it.",
    before_vote: "Please wait for a while until the voting period starts.",
    after_vote: "The voting period has ended.",
    voted_total: "total number of votes",
    voted_selection: "number of votes",
    button_vote: "Vote",
    button_voting: "Voting",
    button_voted: "Voted",
    button_need_token: "You need the NFT",
    button_need_signin: "You need to Connect & Signin",
    button_selection: "selection",
    button_selected: "selected!",
  },

  derivatives: {
    title: "Derivatives",
  },
  notFoundMessage:
    "404: This is not the person, place, or thing you're looking for...",
  languages,
  prefecture,
};

export default lang;
