import React, { useEffect, useState } from 'react';

import { TrendingUp, TrendingDown } from '@mui/icons-material';

type TTrend = {
    current: number,
    previous: number,
    up?: boolean,
    down?: boolean,
}

type TTrendFlag = 'up' | 'down';

export default function Trend({ current, previous, up = true, down = true }: TTrend) {
    const [diff, setDiff] = useState<number>(current - previous);
    const [diffStr, setDiffStr] = useState<string>('');
    const [trend, setTrend] = useState<TTrendFlag>('up');

    useEffect(() => {
        setDiff(current - previous);
    }, [current, previous]);

    useEffect(() => {
        if (diff >= 0) {
            setDiffStr(`+${diff.toFixed(2)}`);
            setTrend('up');
        } else {
            setDiffStr(`${diff.toFixed(2)}`);
            setTrend('down');
        }
    }, [diff]);

    return (
        <>
            {trend === 'up' && up &&
                <span className='text-lime-500'>
                    <span className='mr-0'>{diffStr}</span>
                    <span className='inline-block scale-75 relative bottom-0.5'>
                        <TrendingUp />
                    </span>
                </span>}
            {trend === 'down' && down &&
                <span className='text-rose-500'>
                    <span className='mr-0'>{diffStr}</span>
                    <span className='inline-block scale-75'>
                        <TrendingDown />
                    </span>
                </span>}
        </>
    );
}
