import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { selectRecords } from '../features/records/recordsSlice';
import Record from './Record';
import Limits from './Limits';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
} from '@mui/icons-material';

import { TRecord } from '../types/records';

type TSortedRecords = {
    [key: string]: TRecord[],
}

type TSplitFormat = 'YYYY' | 'YYYY-MM'

type TShowByMonth = {
    [key: string]: boolean,
}

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
    const [showByMonth, setShowByMonth] = useState<TShowByMonth>({});

    useEffect(() => {
        setRecordsByMonth(splitRecordsBy(records, 'YYYY-MM'));
        setRecordsByYear(splitRecordsBy(records, 'YYYY'));
    }, [records]);

    useEffect(() => {
        if (Object.keys(showByMonth).length === 0) {
            const newShowByMonth = {};
            const keysArray = Object.keys(recordsByMonth);
    
            keysArray.map((key) => {
                newShowByMonth[key] = false;
                return false;
            });
    
            setShowByMonth(newShowByMonth);
        }
    }, [recordsByMonth]);

    const toggleMonth = (key: string) => {
        const newShowByMonth = { ...showByMonth };
        newShowByMonth[key] = !newShowByMonth[key];
        setShowByMonth(newShowByMonth);
    };

    return (
        <>
            {recordsByMonth && Object.keys(recordsByMonth).map((key) => (
                <div key={key} className='mt-0'>
                    {dayjs().format('YYYY-MM') === key
                        ? (
                            <Limits records={recordsByMonth[key]}/>
                        )
                        : (
                            <div className='capitalize font-medium py-2'>
                                <IconButton onClick={() => toggleMonth(key)}>
                                    {showByMonth[key]
                                        ? <KeyboardArrowUp />
                                        : <KeyboardArrowDown />
                                    }
                                </IconButton>
                                <span className='ml-2'>
                                    {dayjs(key).format('MMMM YYYY')}
                                </span>
                                <span className='text-slate-500 ml-5 lowercase text-sm'>
                                    {getSumForRecords(recordsByMonth[key])} zł
                                </span>
                            </div>
                        )
                    }
                    {(dayjs().format('YYYY-MM') === key || showByMonth[key]) &&
                    <div className='mb-10'>
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
                    }
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