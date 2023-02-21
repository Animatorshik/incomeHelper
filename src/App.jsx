import React from 'react';
import { useSelector } from 'react-redux';

import { selectRecords } from './features/records/recordsSlice';

import IncomeForm from './components/IncomeForm';
import Records from './components/Records';
import Download from './components/Download';

export default function App() {
	const records = useSelector(selectRecords);

	return (
		<>
			<Download />
			<div className='container max-w-4xl mx-auto py-10 md:py-24 px-5'>
				<IncomeForm />
				<Records records={records} />
			</div>
		</>
	)
}
