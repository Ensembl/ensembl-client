/*
    Formats the input number to comma separated representation
    eg: 10000 -> 10,000
*/
export const getCommaSeparatedNumber = (
  input: number | string | undefined
): string => {
  if (input === '' || input === undefined) {
    return '0';
  }
  return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
