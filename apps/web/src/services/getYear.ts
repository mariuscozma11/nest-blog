export const getAge = (year: number, month: number, day: number): number => {
    const currentYear = new Date().getFullYear();
    const birthDay = new Date(year, month, day).getFullYear();
    const age = currentYear - birthDay;
    return age
  };