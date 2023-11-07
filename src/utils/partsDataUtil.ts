import { partsData } from "@/utils/partsData";

// partsData配列をフィルタリングする関数
export const getPartsNameAndDescription = (
  type: string,
  key: string,
  language: string,
) => {
  const part = partsData.filter(
    (part) =>
      part.type === type && part.key === key && part.language === language,
  );
  if (part.length > 0) {
    return part[0];
  } else {
    return null;
  }
};
