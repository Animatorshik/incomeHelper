import React, { useState, useEffect } from 'react';
import FileDownload from 'js-file-download';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

dayjs.extend(relativeTime);

const lsKey = 'trackerData';
const lsKeyLastBackupDate = 'lastBackupDate';
const backupFormat = 'DD.MM.YYYY';

export default function Backup() {
    const [lastBackupDate, setLastBackupDate] = useState('');
    const [lastBackupText, setLastBackupText] = useState('');
    const [displayReminder, setDisplayReminder] = useState(false);

    useEffect(() => {
        const lsLastBackupDate = localStorage.getItem(lsKeyLastBackupDate);

        if (lsLastBackupDate) {
            setLastBackupDate(lsLastBackupDate);
        } else {
            setDisplayReminder(true);
        }
    }, []);

    useEffect(() => {
        if (lastBackupDate) {
            if (dayjs().diff(dayjs(lastBackupDate), 'day') < 1) {
                setLastBackupText('сегодня');
            } else {
                setLastBackupText(dayjs(lastBackupDate).fromNow());
            }

            const diff = dayjs().diff(dayjs(lastBackupDate), 'day');
            if (diff > 30) {
                setDisplayReminder(true);
            }
        }
    }, [lastBackupDate]);

    const downloadHandler = () => {
        const lsData = String(localStorage.getItem(lsKey));
        const fileName = `income_backup_${dayjs().format('YYYYMMDDHHmmss')}.txt`;

        FileDownload(lsData, fileName);

        const tempLastBackupDate = String(dayjs());
        localStorage.setItem(lsKeyLastBackupDate, tempLastBackupDate);
        setLastBackupDate(tempLastBackupDate);

        setDisplayReminder(false);
    };

    return (
        <>
            <div className='backup flex flex-col items-end'>
                <Button onClick={downloadHandler} size="small">Скачать бэкап</Button>
                {lastBackupText !== '' ? (
                    <div className='text-xs text-slate-400 mr-1'>Последний бэкап: {lastBackupText}</div>
                ) : null}
            </div>

            <Dialog
                open={displayReminder}
                onClose={() => setDisplayReminder(false)}
                aria-labelledby="alert-reminder-title"
                aria-describedby="alert-reminder-description"
            >
                <DialogContent>
                    <div className='text-slate-900 text-center'>{'Кажется, Вы давно не делали бэкап. Сделать его сейчас?'}</div>
                    {lastBackupDate !== '' ? (
                        <div className='text-xs text-gray-500 text-center mt-1'>Последний бэкап: {dayjs(lastBackupDate).format(backupFormat)}</div>
                    ) : null}
                    <div className='text-center mt-7'>
                        <Button onClick={downloadHandler} variant='outlined' color='success'>Скачать бэкап</Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDisplayReminder(false)}>Не сейчас</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
