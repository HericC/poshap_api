export type currencyTypes = 'BRL' | 'USD' | 'EUR';

export const formatOnlyNumbers = (phone: string) => {
  return phone.replace(/\D/g, '');
};

export const formatMoney = (
  price: number,
  currencyType: currencyTypes = 'BRL',
): string => {
  return price.toLocaleString('pt-br', {
    style: 'currency',
    currency: currencyType,
  });
};

export const removeMoneyFormatting = (price: string): string => {
  return price
    .replace(/(R\$)|(US\$)|(€)/, '')
    .replace(/\./g, '')
    .replace(/,/, '.');
};
