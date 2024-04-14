import { configureStore } from '@reduxjs/toolkit';
import recordsReducer from '../features/records/recordsSlice';

export const store = configureStore({
    reducer: {
        records: recordsReducer,
    },
    // middleware: [...getDefaultMiddleware(), saveStateMiddleware],
});
