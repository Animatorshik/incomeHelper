import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { addRecordAsync, selectRecords, selectStatus } from '../features/records/recordsSlice';

import NumericFormatCustom from '../helpers/NumericFormatCustom';

import {
    FormControl,
    TextField,
    Select,
    MenuItem,
    Autocomplete,
    InputLabel,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { currencyCodes } from '../helpers/currencyCodes';

import { TRecord } from '../types/records';
import { TCurrencyAll } from '../types/currencies';

dayjs.locale('ru');

const sortStr = (a: string, b: string) => Number(a.toLowerCase() > b.toLowerCase());

const getClientsArray = (records: TRecord[]) => {
    const clients = records.map((record) => record.client);
    return [...new Set(clients)];
};

export default function IncomeForm() {
    const satus = useSelector(selectStatus);
    const records: TRecord[] = useSelector(selectRecords);
    const dispatch = useDispatch();

    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState<TCurrencyAll>('eur');
    const [client, setClient] = useState('');
    const [newClient, setNewClient] = useState('');
    const [clients, setClients] = useState<string[]>(getClientsArray(records));
    const [reciever, setReciever] = useState(0);
    const [date, setDate] = useState(dayjs());
    const [isFormValid, setIsFormValid] = useState(false);

    // Validation
    useEffect(() => {
        if ((!newClient && !client) || !price) {
            setIsFormValid(false);
        } else {
            setIsFormValid(true);
        }
    }, [newClient, client, price]);

    const submitHandler = (e) => {
        e.preventDefault();

        // Validation
        if (!isFormValid) {
            return false;
        }

        const data: TRecord = {
            id: uuidv4(),
            date: date.unix(),
            price: Number(price),
            pricePln: 0,
            currency,
            reciever,
            client: '',
        };
        if (newClient && client !== newClient) {
            setClients((prev) => [...prev, newClient].sort(sortStr));
            data.client = newClient;
        } else {
            data.client = client;
        }

        dispatch(addRecordAsync(data));

        setPrice('');
        setClient('');
        setNewClient('');
    };

    return (
        <form onSubmit={submitHandler}>
            <div className='flex flex-wrap md:flex-nowrap gap-2 justify-center'>
                <FormControl className='basis-7/12 md:basis-2/12'>
                    <TextField
                        label="Сумма"
                        variant="outlined"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        placeholder='0.00'
                        required
                        InputProps={{
                            inputComponent: NumericFormatCustom as any,
                        }}
                    />
                </FormControl>
                <FormControl className='basis-4/12 md:basis-1/12'>
                    <Select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as TCurrencyAll)}
                        displayEmpty
                    >
                        {currencyCodes.map((value) =>
                            <MenuItem key={value.name} value={value.name}>
                                {value.code}
                            </MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl className='basis-full md:basis-3/12'>
                    <Autocomplete
                        freeSolo
                        options={clients}
                        renderInput={(params) => <TextField {...params} label="От кого" required/>}
                        value={client}
                        inputValue={newClient || client}
                        onChange={(e) => setClient(String((e.target as HTMLElement).textContent))}
                        onInputChange={(e) => setNewClient((e.target as HTMLInputElement).value)}
                    />
                </FormControl>
                <FormControl className='basis-6/12 md:basis-2/12'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Дата"
                            inputFormat="DD.MM.YYYY"
                            value={date}
                            onChange={(newValue) => setDate(newValue || date)}
                            renderInput={(params) => <TextField {...params} />}
                            disableFuture
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl className='basis-5/12 md:basis-2/12'>
                    <InputLabel id="reciever-label">Получатель</InputLabel>
                    <Select
                        labelId="reciever-label"
                        value={reciever}
                        label="Получатель"
                        onChange={(e) => setReciever(Number(e.target.value))}
                    >
                        <MenuItem value={0}>Лена</MenuItem>
                        <MenuItem value={1}>Влад</MenuItem>
                    </Select>
                </FormControl>
                <LoadingButton
                    loading={satus === 'loading'}
                    className='basis-full md:basis-2/12'
                    variant="contained"
                    onClick={submitHandler}
                    size='large'
                    disabled={!isFormValid}
                >Записать</LoadingButton>
            </div>
        </form>
    );
}
