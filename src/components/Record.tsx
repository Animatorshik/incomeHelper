import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { removeRecord } from '../features/records/recordsSlice';
import { currencyCodes } from '../helpers/currencyCodes';
import { currencyFormat } from '../helpers/currencyFormat';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    TableRow,
    TableCell,
    IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { TRecord } from '../types/records';

const oneDay = 24 * 60 * 60;

const Record = ({ id, price, currency, client, date, reciever, pricePln, exchangeRate }: TRecord) => {
    const dispatch = useDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);

    const deleteRecordHandler = (): void => {
        dispatch(removeRecord(id));
        setDialogOpen(false);
    };

    const findCurrencyCode = (): string => {
        const currencyObj = currencyCodes.find((item) => item.name === currency);
        return currencyObj!.code;
    };

    const courseDay = (): string => dayjs.unix(date - oneDay).format('DD.MM.YYYY');

    return (
        <TableRow>
            <TableCell>{price}{findCurrencyCode()}</TableCell>
            <TableCell>{client}</TableCell>
            <TableCell>{dayjs.unix(date).format('DD.MM.YYYY')}</TableCell>
            <TableCell>{reciever === 0 ? 'Лена' : 'Влад'}</TableCell>
            <TableCell>≈ {currencyFormat(pricePln)}</TableCell>
            <TableCell>
                {exchangeRate ? exchangeRate : '-'}
                {exchangeRate ? <div className='text-xs text-slate-400'>от {courseDay()}</div> : ''}
            </TableCell>
            <TableCell align='right'>
                <IconButton
                    color="error"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => setDialogOpen(true)}
                >
                    <ClearIcon/>
                </IconButton>
            </TableCell>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Вы уверены, что хотите удалить эту запись?'}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Нет</Button>
                    <Button onClick={deleteRecordHandler} autoFocus>Да</Button>
                </DialogActions>
            </Dialog>
        </TableRow>
    );
};

export default Record;
