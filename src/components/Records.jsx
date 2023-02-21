import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import Record from './Record';

import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material';
import Limits from './Limits';

const filteredRecords = (records) => {
	return [...records].sort((a, b) => b.date - a.date);
}

const splitRecordsByMonth = (records) => {
	const result = filteredRecords(records).reduce((acc, obj) => {
		const key = dayjs.unix(obj.date).format('YYYY-MM');

		// Create a new array for the key if it does not exist
		const newArray = (acc[key] || []).concat(obj);

		// Return a new object with the new array for the key
		return { ...acc, [key]: newArray };
	}, {});

	return result;
}

const getSumForMonth = (records) => {
	let result = 0;
	records.map((record) => result = result + record.pricePln);
	return result.toFixed(2);
}

export default function Records({ records }) {
	const [recordsByMonth, setRecordsByMonth] = useState({});

	useEffect(() => {
		setRecordsByMonth(splitRecordsByMonth(records));
	}, [records]);

	return (
		<>
			{recordsByMonth && Object.keys(recordsByMonth).map((key, index) => (
				<div key={key} className='mt-20'>
					{dayjs().format('YYYY-MM') === key
						? (
							<Limits records={recordsByMonth[key]} />
						)
						: (
							<div className='capitalize font-medium py-4'>
								{dayjs(key).format('MMMM YYYY')}
								<span className='text-slate-500 ml-5 lowercase text-sm'>{getSumForMonth(recordsByMonth[key])} zł</span>
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
		</>
	)
}