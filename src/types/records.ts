import { TCurrencyAll } from '../types/currencies';

export type TRecord = {
	id: string,
	price: number,
	currency: TCurrencyAll,
	client: string,
	date: number,
	reciever: number,
	pricePln: number,
	exchangeRate?: number,
}
