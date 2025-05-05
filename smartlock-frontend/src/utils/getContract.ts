import { Contract, BrowserProvider } from "ethers";
import abi from "../contracts/SmartLock.abi.json";

const CONTRACT_ADDRESS = "0x9F8af16Cb2D0806E220CCd62178554D3C8005CCF";

export const getSmartLockContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, abi, signer);
};
