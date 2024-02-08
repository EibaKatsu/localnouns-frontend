import { computed } from "vue";
import store from "@/store";
import { ethers } from "ethers";

export const useUser = () => {
  const user = computed(() => store.state.user);
  return user;
};
export const useIsSignedIn = () => {
  const isSignedIn = computed(() => store.getters.isSignedIn);
  return isSignedIn;
};
export const weiToEther = (weiValue: bigint) => {
  const ethValue = ethers.formatEther(weiValue);
  return Number(ethValue);
};
export const dateAdd = (date: Date, days: number) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
};
export const monthAdd = (date: Date, months: number) => {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
};
export const dateToYYYYMMMDD = (date: Date) => {
  // 結果をYYYY-MM-DD形式で表示
  return date.toISOString().split("T")[0];
};
export const dateToYYYYMMM = (date: Date) => {
  // 結果をYYYY-MM形式で表示
  return date.toISOString().substring(0, 7);
};
