import React from 'react';
import JsFileDownloader from 'js-file-downloader';
import dayjs from 'dayjs';

import { Button } from '@mui/material';

export default function Download() {
	const downloadHandler = () => {
		const lsKey = 'trackerData';
		const lsData = localStorage.getItem(lsKey);

		const blob = new Blob([lsData], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		new JsFileDownloader({
			url: url,
			autoStart: true,
			nameCallback: () => `income_backup_${dayjs().format('YYYYMMDDHHmmss')}.txt`,
		})
	}

	return (
		<div className='p-3 text-right'>
			<Button onClick={downloadHandler} size="small">Скачать бэкап</Button>
		</div>
	)
}
