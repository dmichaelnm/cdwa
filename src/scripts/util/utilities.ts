import { TDocumentAttribute } from 'src/scripts/util/types';

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

/**
 * Converts the given value to a number.
 *
 * @param {any} value - The value to be converted to a number.
 *
 * @returns {number | null} - The converted number or null if the conversion fails.
 */
export function toNumber(value: any): number | null {
  const nmbr = parseFloat(value);
  if (!isNaN(nmbr) && isFinite(nmbr)) {
    return nmbr;
  }
  return null;
}

/**
 * Converts a value to a boolean.
 *
 * @param {any} value - The value to convert.
 *
 * @returns {boolean} The converted boolean value.
 */
export function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value as boolean;
  } else if (typeof value === 'string') {
    const str = (value as string).trim().toLowerCase();
    return (str === 'true' || str === '1');
  } else if (typeof value === 'number') {
    const nmbr = value as number;
    return nmbr > 0;
  } else {
    return false;
  }
}

/**
 * Copies the attributes of a document.
 *
 * @param {TDocumentAttribute[]} attributes - The attributes of the document.
 *
 * @return {TDocumentAttribute[]} - The copied attributes.
 */
export function copyAttributes(attributes: TDocumentAttribute[]): TDocumentAttribute[] {
  return attributes.map(attr => {
    return { key: attr.key, type: attr.type, value: attr.value };
  });
}
