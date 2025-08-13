import {
  transferethereummainnet,
  transferethereumsepolia,
  transfermonadtestnet,
} from './evm/send-tokens';
import { getbalance } from './sui/get-balance';
import { transfersui } from './sui/send-tokens';

export const Suitools = { getbalance, transfersui };
export const ALLTools = {
  getbalance,
  transfersui,
  transferethereummainnet,
  transferethereumsepolia,
  transfermonadtestnet,
};
