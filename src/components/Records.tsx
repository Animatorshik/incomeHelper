import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { selectRecords } from '../features/records/recordsSlice';
import Record from './Record';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import Limits from './Limits';

import { TRecord } from '../types/records';

type TSortedRecords = {
    [key: string]: TRecord[],
}

type TSplitFormat = 'YYYY' | 'YYYY-MM'

const filteredRecords = (records: TRecord[]) => {
    return [...records].sort((a, b) => b.date - a.date);
};

const splitRecordsBy = (records, format: TSplitFormat) => {
    return filteredRecords(records).reduce((acc, obj) => {
        const key = dayjs.unix(obj.date).format(format);

        // Create a new array for the key if it does not exist
        const newArray = (acc[key] || []).concat(obj);

        // Return a new object with the new array for the key
        return { ...acc, [key]: newArray };
    }, {});
};

const getSumForRecords = (records: TRecord[]) => {
    let result = 0;
    records.map((record) => result = result + record.pricePln);
    return result.toFixed(2);
};

export default function Records() {
    const records = useSelector<TRecord[]>(selectRecords);
    const [recordsByMonth, setRecordsByMonth] = useState<TSortedRecords>({});
    const [recordsByYear, setRecordsByYear] = useState<TSortedRecords>({});

    useEffect(() => {
        setRecordsByMonth(splitRecordsBy(records, 'YYYY-MM'));
        setRecordsByYear(splitRecordsBy(records, 'YYYY'));
    }, [records]);

    return (
        <>
            {recordsByMonth && Object.keys(recordsByMonth).map((key) => (
                <div key={key} className='mt-10'>
                    {dayjs().format('YYYY-MM') === key
                        ? (
                            <Limits records={recordsByMonth[key]}/>
                        )
                        : (
                            <div className='capitalize font-medium py-4'>
                                {dayjs(key).format('MMMM YYYY')}
                                <span className='text-slate-500 ml-5 lowercase text-sm'>
                                    {getSumForRecords(recordsByMonth[key])} zł
                                </span>
                            </div>
                        )
                    }
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <div className='w-20 md:w-32 leading-5'>Сумма перевода</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='w-20 leading-5'>От кого</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='w-20 leading-5'>Дата</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='w-20 leading-5'>Получатель</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='w-20 leading-5'>Сумма в zł</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='w-20 leading-5'>Курс</div>
                                    </TableCell>
                                    <TableCell align='right'>
                                        <div className='w-16 leading-5'>Действие</div>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recordsByMonth[key].map((record) => (
                                    <Record key={record.id} {...record} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ))}

            {Object.keys(recordsByYear).length > 0 &&
                <div className='mt-20 mb-5'>
                    <div className='font-medium mb-3'>Итоги по годам</div>
                    {recordsByYear && Object.keys(recordsByYear).reverse().map((key) => (
                        <div key={key} className='py-1'>
                            {key}
                            <span className='text-slate-500 ml-5 lowercase'>
                                {getSumForRecords(recordsByYear[key])} zł
                            </span>
                        </div>
                    ))}
                </div>
            }
        </>
    );
}