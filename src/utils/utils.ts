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
