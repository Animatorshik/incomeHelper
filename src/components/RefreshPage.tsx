import React from 'react';

import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const RefreshPage: React.FC = () => {
    const refresh = () => {
        window.location.reload();
    };

    return (
        <IconButton onClick={refresh} color="primary">
            <RefreshIcon/>
        </IconButton>
    );
};

export default RefreshPage;
