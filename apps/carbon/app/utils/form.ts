const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const isValidEmail = (email: string) => {
  return emailRegex.test(email);
};

export const mapRowsToOptions = <T extends Record<string, any>>({
  data,
  value,
  label,
}: {
  data: T[] | undefined | null;
  value: keyof T | ((row: T) => string);
  label: keyof T | ((row: T) => string);
}) => {
  if (!data) return [];

  return data.reduce<{ value: string | number; label: string }[]>(
    (acc, row) => {
      const v = typeof value === "function" ? value(row) : row[value];
      const l = typeof label === "function" ? label(row) : row[label];

      if (v && l) {
        return [...acc, { label: l, value: v }];
      }

      return acc;
    },
    []
  );
};
