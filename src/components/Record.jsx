import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { removeRecord } from '../features/records/recordsSlice';
import { currencyCodes } from '../helpers/currencyCodes';

import {
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	TableRow,
	TableCell,
	IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const oneDay = 24 * 60 * 60;

export default function Record({ id, price, currency, client, date, reciever, pricePln, exchangeRate }) {
	const dispatch = useDispatch();

	const [dialogOpen, setDialogOpen] = React.useState(false);

	const deleteRecordHandler = () => {
		dispatch(removeRecord(id));
		setDialogOpen(false);
	}

	const findCurrencyCode = () => {
		return currencyCodes.find((item) => item.name === currency).code;
	}

	return (
		<TableRow>
			<TableCell>{price}{findCurrencyCode()}</TableCell>
			<TableCell>{client}</TableCell>
			<TableCell>{dayjs.unix(date).format('DD.MM.YYYY')}</TableCell>
			<TableCell>{reciever === 0 ? 'Лена' : 'Влад'}</TableCell>
			<TableCell>≈ {pricePln.toFixed(2)} zł</TableCell>
			<TableCell>
				{exchangeRate ? exchangeRate : '-'}
				{exchangeRate ? <div className='text-xs text-slate-400'>от {dayjs.unix(date - oneDay).format('DD.MM.YYYY')}</div> : ''}
			</TableCell>
			<TableCell align='right'>
				<IconButton
					color="error"
					aria-label="upload picture"
					component="label"
					onClick={() => setDialogOpen(true)}
				>
					<ClearIcon />
				</IconButton>
			</TableCell>

			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Вы уверены, что хотите удалить эту запись?"}
				</DialogTitle>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Нет</Button>
					<Button onClick={deleteRecordHandler} autoFocus>Да</Button>
				</DialogActions>
			</Dialog>
		</TableRow>
	)
}