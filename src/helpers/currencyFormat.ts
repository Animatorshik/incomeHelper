export const currencyFormat = (num: number): string => {
    return num.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });
};
