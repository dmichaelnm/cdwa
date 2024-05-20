/**
 * A utility class for assertion checks.
 */
export class Assert {

  /**
   * Asserts that a given condition is true, and throws an error with the provided message if it is not.
   *
   * @param {boolean} condition - The condition to be evaluated.
   * @param {string} message - The error message to be thrown if the condition is false.
   *
   * @throws {Error} Thrown with the provided message if the condition is false.
   */
  static assert(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(message);
    }
  }

  /**
   * Asserts that a value is not undefined or null.
   *
   * @param {any | undefined | null} value - The value to check.
   * @param {string} valueName - The name of the value being checked.
   *
   * @return {void}
   */
  static assertValueIsSet(value: any | undefined | null, valueName: string): void {
    Assert.assert(value !== null && value !== undefined, `Value "${valueName}" is undefined or null`);
  }
}
