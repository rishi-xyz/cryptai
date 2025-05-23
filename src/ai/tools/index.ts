import { getbalance } from './sui/get-balance';
import { transfersui } from './sui/send-tokens';

export const Suitools = { getbalance, transfersui };
export const ALLTools = { Suitools };
