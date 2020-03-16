/*
    Formats the input number to comma separated representation
    eg: 10000 -> 10,000
*/
export const getCommaSeparatedNumber = (input: number) => {
  return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getNumberWithoutCommas = (input: string) => {
  const inputWithoutCommas = input.replace(/,/g, '');
  return +inputWithoutCommas;
};
