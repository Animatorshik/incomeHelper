import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

import IncomeForm from './components/IncomeForm';
import Records from './components/Records';
import Restore from './components/Restore';
import RefreshPage from './components/RefreshPage';
import Backup from './components/Backup';
import DarkModeToggle from './components/DarkModeToggle';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';

function AppContent() {
    const { isDark } = useDarkMode();
    const theme = createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
            ...(isDark && {
                background: {
                    default: '#0f172a',  // slate-900
                    paper: '#0f172a',    // slate-900
                },
            }),
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
                <div className='flex justify-between p-3'>
                    <Restore />
                    <Backup />
                </div>
                <div className='container max-w-4xl mx-auto my-8 md:my-20 px-5'>
                    <IncomeForm />
                    <Records />
                </div>
                <div className='py-5 text-center'>
                    <RefreshPage />
                    <DarkModeToggle />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default function App() {
    return (
        <DarkModeProvider>
            <AppContent />
        </DarkModeProvider>
    );
}
