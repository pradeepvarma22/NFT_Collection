import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv'

dotenv.config({path: ".env"});

const ALCHEMY_API_KEY_URL: string = process.env.ALCHEMY_API_KEY!;
const RINKEBY_PRIVATE_KEY: string = process.env.RINKEBY_PRIVATE_KEY!;

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks:{
    rinkbey:{
      url: ALCHEMY_API_KEY_URL,
      accounts: [RINKEBY_PRIVATE_KEY]
    }
  }
};

export default config;
