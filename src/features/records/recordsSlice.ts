import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import axios from 'axios';

import { getExchangeRateApi } from '../../api/api';
import { TRecord } from '../../types/records';

type TStatus = 'ok' | 'loading';

type TRecordsState = {
    status: TStatus;
    data: TRecord[];
};

const lsKey = 'trackerData';
const lsData = localStorage.getItem(lsKey);

const initialState: TRecordsState = {
    status: 'ok',
    data: [],
};

export const addRecordAsync = createAsyncThunk(
    'records/getExchangeRate',
    async (data: TRecord) => {
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
            const exchangeRate = response!.data.rates[0].mid;
            return { ...data, pricePln: data.price * exchangeRate, exchangeRate };
        } else {
            return { ...data, pricePln: Number(data.price) };
        }
    }
);

export const recordsSlice = createSlice({
    name: 'records',
    initialState: (lsData ? JSON.parse(lsData) : initialState) as TRecordsState,
    reducers: {
        addRecord: (state, action: PayloadAction<TRecord>) => {
            state.data.push(action.payload);
            localStorage.setItem(lsKey, JSON.stringify(state));
        },
        removeRecord: (state, action: PayloadAction<string>) => {
            state.data.splice(state.data.findIndex((record) => record.id === action.payload), 1);
            localStorage.setItem(lsKey, JSON.stringify(state));
        },
        updateRecords: (state, action: PayloadAction<TRecord[]>) => {
            state.data = action.payload;
        },
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

export const { addRecord, removeRecord, updateRecords } = recordsSlice.actions;

export const selectRecords = (state: { records: TRecordsState }) => state.records.data;
export const selectStatus = (state: { records: TRecordsState }) => state.records.status;

export default recordsSlice.reducer;
