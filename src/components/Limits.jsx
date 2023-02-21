import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import { getExchangeRateApi } from '../api/api';

dayjs.locale('ru');

const limitZl = 3490;

export default function Limits({ records }) {
	const [euroCourse, setEuroCourse] = useState(1);
	const [usdCourse, setUsdCourse] = useState(1);
	const [lenaLimit, setLenaLimit] = useState(limitZl / 2);
	const [vladLimit, setVladLimit] = useState(limitZl / 2);

	useEffect(() => {
		let sumIncomeLena = 0;
		let sumIncomeVlad = 0;
		records.forEach((record) => {
			if (record.reciever === 0) {
				sumIncomeLena = sumIncomeLena + record.pricePln;
			} else {
				sumIncomeVlad = sumIncomeVlad + record.pricePln;
			}
		});

		setLenaLimit(limitZl / 2 - sumIncomeLena);
		setVladLimit(limitZl / 2 - sumIncomeVlad);
	}, [records])

	useEffect(() => {
		getExchangeRateApi('eur')
			.then((response) => {
				setEuroCourse(response.data.rates[0].mid);
			})
			.catch((error) => {
				console.log('ERROR GET EUR', error);
			});

		getExchangeRateApi('usd')
			.then((response) => {
				setUsdCourse(response.data.rates[0].mid);
			})
			.catch((error) => {
				console.log('ERROR GET USD', error);
			});
	}, []);

	return (
		<div className='mt-20 mb-10'>
			<div className='capitalize font-medium text-lg'>{dayjs().format('MMMM YYYY')}</div>
			<div className='text-sm text-slate-600 mt-4 mb-1'>Остаток лимита:</div>
			<div className='font-medium text-lg text-slate-600'>
				<span>Лена:</span> <span className='text-black'>{lenaLimit.toFixed(2)} zł</span> ≈ <span className='text-sky-600'>{Math.trunc(lenaLimit / euroCourse)} €</span> ≈ <span className='text-rose-600'>{Math.trunc(lenaLimit / usdCourse)} $</span>
			</div>
			<div className='font-medium text-lg text-slate-600'>
				<span>Влад:</span> <span className='text-black'>{vladLimit.toFixed(2)} zł</span> ≈ <span className='text-sky-600'>{Math.trunc(vladLimit / euroCourse)} €</span> ≈ <span className='text-rose-600'>{Math.trunc(vladLimit / usdCourse)} $</span>
			</div>
			<div className='text-xs text-slate-400 mt-7'>Лимит в месяц: {limitZl} zł ≈ {Math.trunc(limitZl / euroCourse)} € ≈ {Math.trunc(limitZl / usdCourse)} $</div>
		</div>
	)
}
