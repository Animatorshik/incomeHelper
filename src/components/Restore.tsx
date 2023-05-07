import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateRecords } from '../features/records/recordsSlice';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@mui/material';

const lsKey = 'trackerData';

const Restore: React.FC = () => {
    const dispatch = useDispatch();
    const [fileData, setFileData] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setFileData(text);
                const data = JSON.parse(text).data;
                dispatch(updateRecords(data));
                localStorage.setItem(lsKey, text);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <Button onClick={() => setDialogOpen(true)} size="small">Восстановить</Button>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Восстановление записей
                </DialogTitle>
                <DialogContent>
                    <ul className='list-decimal pl-5 mb-5 text-gray-500 text-sm'>
                        <li>Выбери файл с бэкапом.</li>
                        <li>Файл будет называться как-то так &quot;income_backup_1234567890.txt&quot;.</li>
                        <li>Загрузи файл и бэкап восстановится автоматически.</li>
                    </ul>
                    <div className='text-center mt-7'>
                        <label htmlFor="file-input" className='inline-block px-5 py-3 text-white bg-green-500 hover:bg-green-400 rounded cursor-pointer'>Загрузить</label>
                        <input type="file" id="file-input" className='hidden' onChange={handleFileChange} />
                        {fileData &&
                            <p className='mt-5 text-emerald-500'>Данные успешно восстановлены!</p>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Restore;
