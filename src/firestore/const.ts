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
