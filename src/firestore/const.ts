export interface TOKEN {
  tokenId: string;
  prefecture: string;
  prefectureId: number;
  head: string;
  accessory: string;
  holder: string;
  svg: string;
  salePrice: number;
  isOnTrade: boolean;
  tradeToPrefecture: number[];
  createdDate: Date;
  canTrade?: boolean; // firestoreでなく画面で使用
  headDescription?: string;
  accessoryDescription?: string;
}
export interface PARTS {
  type: string;
  prefecture: string;
  key: string;
  language: string;
  name: string;
  description: string;
  author?: string;
  createdDate?: Date;
}
export enum ACTION {
  MINT = "MINT",
  PURCHASE = "PURCHASE",
  TRADE = "TRADE",
}
export interface HISTORY {
  hash: string;
  blocknumber: number;
  action: ACTION;
  tokenId: string;
  token?: TOKEN;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  timestamp?: Date | undefined;
}
export interface HOLDER {
  address: string;
  addressName: string;
  numOfHold: number;
  timestamp?: Date | undefined;
  tokens?: TOKEN[];
}
export enum COUNTER_TYPE {
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
}
export interface COUNTER {
  counterType: COUNTER_TYPE;
  key: string;
  numOfMint: number;
  numOfSale: number;
  numOfTrade: number;
}
