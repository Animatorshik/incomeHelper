import React from 'react';

import IncomeForm from './components/IncomeForm';
import Records from './components/Records';
import Restore from './components/Restore';
import RefreshPage from './components/RefreshPage';
import Backup from './components/Backup';

export default function App() {
    return (
        <>
            <div className='flex justify-between p-3'>
                <Restore/>
                <Backup/>
            </div>
            <div className='container max-w-4xl mx-auto my-8 md:my-20 px-5'>
                <IncomeForm/>
                <Records/>
            </div>
            <div className='my-5 text-center'>
                <RefreshPage/>
            </div>
        </>
    );
}
