export function isValidNumber(inputValue: string) {
  // 正規表現で数値のみかをチェック
  const isPureNumber = /^[+]?\d+(\.\d+)?$/.test(inputValue);
  if (!isPureNumber) {
    return false;
  }

  const numberValue = parseFloat(inputValue);
  return numberValue > 0;
}
