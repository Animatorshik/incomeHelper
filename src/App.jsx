import React from 'react';

import IncomeForm from './components/IncomeForm';
import Records from './components/Records';
import Download from './components/Download';
import Restore from './components/Restore';
import RefreshPage from './components/RefreshPage';

export default function App() {
    return (
        <>
            <div className='flex justify-between p-3'>
                <Restore/>
                <Download/>
            </div>
            <div className='container max-w-4xl mx-auto my-10 md:my-24 px-5'>
                <IncomeForm/>
                <Records/>
            </div>
            <div className='my-5 text-center'>
                <RefreshPage/>
            </div>
        </>
    );
}
