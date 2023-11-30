import { addresses as localSeeder_mumbai } from "@/utils/addresses/localseeder_mumbai";
import { addresses as localSeeder_localhost } from "@/utils/addresses/localseeder_localhost";
import { addresses as localNounsDescriptor_mumbai } from "@/utils/addresses/localNounsDescriptor_mumbai";
import { addresses as localNounsDescriptor_localhost } from "@/utils/addresses/localNounsDescriptor_localhost";
import { addresses as localProvider_mumbai } from "@/utils/addresses/localNounsProvider_mumbai";
import { addresses as localProvider_localhost } from "@/utils/addresses/localNounsProvider_localhost";
import { addresses as localNounsToken_mumbai } from "@/utils/addresses/localNounsToken_mumbai";
import { addresses as localNounsToken_localhost } from "@/utils/addresses/localNounsToken_localhost";
import { addresses as localNounsMinter_mumbai } from "@/utils/addresses/localNounsMinter_mumbai";
import { addresses as localNounsMinter_localhost } from "@/utils/addresses/localNounsMinter_localhost";
import { addresses as svgHelper_mumbai } from "@/utils/addresses/svgHelper_mumbai";
import { addresses as svgHelper_mainnet } from "@/utils/addresses/svgHelper_mainnet";
import { addresses as tokenGate_mainnet } from "@/utils/addresses/tokenGate_mainnet";
import { addresses as tokenGate_mumbai } from "@/utils/addresses/tokenGate_mumbai";
import { addresses as tokenGate_localhost } from "@/utils/addresses/tokenGate_localhost";

export interface Addresses {
  [key: string]: { [key: string]: string };
}
export interface WhiteList {
  [key: string]: string[];
}

export const addresses: Addresses = {
  localSeeder: {
    mumbai: localSeeder_mumbai.localseeder,
    localhost: localSeeder_localhost.localseeder,
  },
  localNounsDescriptor: {
    mumbai: localNounsDescriptor_mumbai.localNounsDescriptor,
    localhost: localNounsDescriptor_localhost.localNounsDescriptor,
  },
  localProvider: {
    mumbai: localProvider_mumbai.localNounsProvider,
    localhost: localProvider_localhost.localNounsProvider,
  },
  localNounsToken: {
    mumbai: localNounsToken_mumbai.localNounsToken,
    localhost: localNounsToken_localhost.localNounsToken,
  },
  localNounsMinter: {
    mumbai: localNounsMinter_mumbai.localNounsMinter,
    localhost: localNounsMinter_localhost.localNounsMinter,
  },
  svgHelper: {
    mumbai: svgHelper_mumbai.svgHelper,
    localhost: svgHelper_mainnet.svgHelperAddress, // deployed
    mainnet: svgHelper_mainnet.svgHelperAddress,
  },
  tokenGate: {
    mumbai: tokenGate_mumbai.tokenGate,
    localhost: tokenGate_mainnet.tokenGate, // deployed
    mainnet: tokenGate_localhost.tokenGate,
  },
};
