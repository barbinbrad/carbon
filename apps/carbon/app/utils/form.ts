const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const isValidEmail = (email: string) => {
  return emailRegex.test(email);
};
