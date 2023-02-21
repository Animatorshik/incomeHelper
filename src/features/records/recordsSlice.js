import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import axios from 'axios';

import { getExchangeRateApi } from '../../api/api';

// const initialState = {
// 	status: 'ok',
// 	data: [
// 		{
// 			client: "User 1",
// 			currency: "eur",
// 			date: 1656728301,
// 			id: "a76b38c6-2e43-4f01-8679-4dc2ec2935fe",
// 			price: 50,
// 			pricePln: 245.15,
// 			reciever: 1,
// 		},
// 		{
// 			client: "User 2",
// 			currency: "usd",
// 			date: 1676728301,
// 			id: "6913bb8a-b9f4-43c8-9895-a44c7ef9b5ee",
// 			price: 70,
// 			pricePln: 325.35,
// 			reciever: 0,
// 		},
// 		{
// 			client: "User 3",
// 			currency: "eur",
// 			date: 1576728301,
// 			id: "00c1f9cc-124d-4fcf-8581-ed15ccb0cce9",
// 			price: 120,
// 			pricePln: 600.85,
// 			reciever: 0,
// 		},
// 		{
// 			client: "User 1",
// 			currency: "eur",
// 			date: 1675728301,
// 			id: "a76b38c5-2e43-4f01-8679-4dc2ec2935fe",
// 			price: 50,
// 			pricePln: 245.15,
// 			reciever: 1,
// 		},
// 		{
// 			client: "User 2",
// 			currency: "usd",
// 			date: 1674728301,
// 			id: "6913bb8b-b9f4-43c8-9895-a44c7ef9b5ee",
// 			price: 70,
// 			pricePln: 325.35,
// 			reciever: 0,
// 		},
// 		{
// 			client: "User 3",
// 			currency: "usd",
// 			date: 1673728301,
// 			id: "00c1f9cd-124d-4fcf-8581-ed15ccb0cce9",
// 			price: 120,
// 			pricePln: 600.85,
// 			reciever: 0,
// 		},
// 	],
// }

const lsKey = 'trackerData';
const lsData = localStorage.getItem(lsKey);

const initialState = {
	status: 'ok',
	data: [],
}

export const addRecordAsync = createAsyncThunk(
  'records/getExchangeRate',
  async (data) => {
		const currency = data.currency;
		if (currency !== 'pln') {
			// Need to get the Exchange Rate for the one working day
			// before the income day.
			// Source: https://www.pit.pl/dochody-zagraniczne/jak-przeliczyc-na-pln-dochody-zagraniczne-pity-roczne-2017-922701
			const oneDay = 24 * 60 * 60;
			const date = dayjs.unix(data.date - oneDay).format('YYYY-MM-DD');
			let response;
			try {
				response = await getExchangeRateApi(currency, date);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					response = await getExchangeRateApi(currency);
				}
			}
			// const response = await getExchangeRateApi(currency);
			const exchangeRate = response.data.rates[0].mid;
			return { ...data, pricePln: data.price * exchangeRate, exchangeRate }
		} else {
			return { ...data, pricePln: Number(data.price) }
		}
  }
);

export const recordsSlice = createSlice({
	name: 'records',
	initialState: lsData ? JSON.parse(lsData) : initialState,
	reducers: {
		addRecord: (state, action) => {
			state.data.push(action.payload);
			localStorage.setItem(lsKey, JSON.stringify(state));
		},
		removeRecord: (state, action) => {
			state.data.splice(state.data.findIndex((record) => record.id === action.payload), 1);
			localStorage.setItem(lsKey, JSON.stringify(state));
		}
	},
	extraReducers: (builder) => {
    builder
      .addCase(addRecordAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addRecordAsync.fulfilled, (state, action) => {
        state.status = 'ok';
        state.data.push(action.payload);
				localStorage.setItem(lsKey, JSON.stringify(state));
      })
			.addCase(addRecordAsync.rejected, (state) => {
        state.status = 'ok';
        console.log('ERROR in addRecordAsync');
      });
  },
});

export const { addRecord, removeRecord } = recordsSlice.actions;

export const selectRecords = (state) => state.records.data;
export const selectStatus = (state) => state.records.status;

export default recordsSlice.reducer;
