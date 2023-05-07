import React from 'react';
import FileDownload from 'js-file-download';
import dayjs from 'dayjs';

import { Button } from '@mui/material';

const lsKey = 'trackerData';

export default function Download() {
    const downloadHandler = () => {
        const lsData = String(localStorage.getItem(lsKey));
        const fileName = `income_backup_${dayjs().format('YYYYMMDDHHmmss')}.txt`;

        FileDownload(lsData, fileName);
    };

    return (
        <Button onClick={downloadHandler} size="small">Скачать бэкап</Button>
    );
}
