import axios, { isCancel, AxiosError } from 'axios';
import dayjs from 'dayjs';

import { TCurrency } from '../types/currencies';

type TDate = 'last' | string;

const EXCHANGE_RATES_API = 'https://api.nbp.pl/api/exchangerates/rates/a';

/**
 * Get Exchange Rate for one currency on date
 *
 * @param {string} currency. Example: 'eur', 'usd'
 * @param {string} date. Example: 'last', 'YYYY-MM-DD'
 * @returns {json}
 */
export const getExchangeRateApi = (currency: TCurrency, date: TDate = 'last') => {
    return axios.get(`${EXCHANGE_RATES_API}/${currency}/${date}/?format=json`);
};

/**
 * Get Exchange Rates for one currency for current month
 *
 * @param {string} currency. Example: 'eur', 'usd'
 * @returns {json}
 */
export const getExchangeRatesCurrentMonthApi = (currency: TCurrency) => {
    return axios.get(`${EXCHANGE_RATES_API}/${currency}/${dayjs().format('YYYY-MM')}-01/${dayjs().format('YYYY-MM-DD')}/?format=json`);
};
