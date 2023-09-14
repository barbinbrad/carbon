/**
 * A utility type to get the element type of an array.
 */
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

/**
 * A utility function to filter out null and undefined values from an array.
 */
export const filterEmpty = <
  T extends Array<any>,
  U = Exclude<ArrayElement<T>, null | undefined>
>(
  arr: T
): U[] =>
  arr.reduce<U[]>((acc, item) => {
    if (item !== null && item !== undefined) {
      acc.push(item);
    }

    return acc;
  }, []);
