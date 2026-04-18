import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDarkMode } from '../context/DarkModeContext';

export default function DarkModeToggle() {
    const { isDark, toggle } = useDarkMode();

    return (
        <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggle} color="primary">
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Tooltip>
    );
}
