/**
 * Converts the values of a Map to an array.
 *
 * @param {Map<string, R>} map - The map to convert.
 * @param {(a: R, b: R) => number} [comparator] - Optional comparator function to sort the resulting array.
 *
 * @returns {R[]} - The resulting array of values.
 *
 * @template R - The type of the values of the map.
 */
export function toArray<R>(
  map: Map<string, R>,
  comparator?: (a: R, b: R) => number
): R[] {
  // Create the result array
  const result: R[] = [];
  // Iterate over all entries of the map
  for (const value of map.values()) {
    result.push(value);
  }
  // If necessary, sort the array
  if (comparator) {
    result.sort(comparator);
  }
  // Return the result
  return result;
}
