import { TCurrencyAll } from '../types/currencies';

type TCurrencyCode = {
    name: TCurrencyAll,
    code: string,
}

// Minimum one element in array is required
type TCurrencyCodes = [TCurrencyCode, ...TCurrencyCode[]]

// The same on interface
// interface ICurrencyCodes extends Array<ICurrencyCode> {
//   0: ICurrencyCode;
//   length: number;
// }

export const currencyCodes: TCurrencyCodes = [
    { name: 'eur', code: '€' },
    { name: 'usd', code: '$' },
    { name: 'pln', code: 'zł' }
];
