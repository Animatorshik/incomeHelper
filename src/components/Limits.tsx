import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import 'dayjs/locale/ru';

import { getExchangeRateApi } from '../api/api';
import { currencyFormat } from '../helpers/currencyFormat';

import { TRecord } from '../types/records';

type TRecordsEchange = {
    records: TRecord[],
}

dayjs.locale('ru');
dayjs.extend(quarterOfYear);

const isQuarter = process.env.REACT_APP_LIMIT_BY_QUARTER === '1';
const limitZl = Number(process.env.REACT_APP_MIN_SALARY_PLN) * 0.75 * 2 * (isQuarter ? 3 : 1);

export default function Limits({ records }: TRecordsEchange) {
    const [euroCourse, setEuroCourse] = useState(1);
    const [usdCourse, setUsdCourse] = useState(1);
    const [lenaLimit, setLenaLimit] = useState(limitZl / 2);
    const [vladLimit, setVladLimit] = useState(limitZl / 2);
    const [quarterTitle, setQuarterTitle] = useState('');
    const [quarterSubtitle, setQuarterSubtitle] = useState('');

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
    }, [records]);

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

    useEffect(() => {
        if (isQuarter) {
            const currentQuarter = dayjs().quarter();
            let romeQuarter = '';
            switch (currentQuarter) {
            case 1:
                romeQuarter = 'I';
                setQuarterSubtitle('январь - март');
                break;
            case 2:
                romeQuarter = 'II';
                setQuarterSubtitle('апрель - июнь');
                break;
            case 3:
                romeQuarter = 'III';
                setQuarterSubtitle('июль - сентябрь');
                break;
            case 4:
                romeQuarter = 'IV';
                setQuarterSubtitle('октябрь - декабрь');
                break;
            }
            setQuarterTitle(`${romeQuarter} квартал ${dayjs().format('YYYY')}`);
        }
    }, []);

    return (
        <div className='mt-20'>
            {isQuarter &&
                <div>
                    <span className='font-medium text-xl'>{quarterTitle}</span>&nbsp;
                    <span className='text-xs text-slate-400'>({quarterSubtitle})</span>
                </div>
            }
            <div className='text-xs text-slate-400'>Лимит в {isQuarter ? 'квартал' : 'месяц'}: {currencyFormat(limitZl)}&nbsp;
                ≈ {Math.trunc(limitZl / euroCourse)} €
                ≈ {Math.trunc(limitZl / usdCourse)} $
            </div>
            <hr className='w-80 h-px mt-1 mb-4 bg-slate-300 border-0 rounded-sm' />
            <div className='text-sm text-slate-600 mt-4 mb-1'>Остаток лимита:</div>
            <div className='font-medium text-lg text-slate-600'>
                <span>Лена:</span> <span className='text-black'>{currencyFormat(lenaLimit)}</span> ≈ <span
                    className='text-sky-600'>{Math.trunc(lenaLimit / euroCourse)} €</span> ≈ <span
                    className='text-rose-600'>{Math.trunc(lenaLimit / usdCourse)} $</span>
            </div>
            <div className='font-medium text-lg text-slate-600'>
                <span>Влад:</span> <span className='text-black'>{currencyFormat(vladLimit)}</span> ≈ <span
                    className='text-sky-600'>{Math.trunc(vladLimit / euroCourse)} €</span> ≈ <span
                    className='text-rose-600'>{Math.trunc(vladLimit / usdCourse)} $</span>
            </div>
            <hr className='w-80 h-px mt-1 mb-4 bg-slate-300 border-0 rounded-sm' />
            <div className='capitalize font-medium text-lg mt-10 mb-2'>{dayjs().format('MMMM YYYY')}</div>
        </div>
    );
}
