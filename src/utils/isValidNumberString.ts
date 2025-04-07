export const isValidNumberString = (value: string): boolean => {
  return value === "" || /^[0-9]*\.?[0-9]*$/.test(value);
};
