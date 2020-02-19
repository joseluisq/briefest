/** Assert that `expected` is equal to `actual`. */
export type IsEqual = <T>(expected: T, actual: T, message?: string) => void

/** Assert that `expected` is not equal to `actual`. */
export type IsNotEqual = <T>(expected: T, actual: T, message?: string) => void

/** Assert that `expected` is truthy. */
export type IsTruthy = (expected: boolean, message?: string) => void

/** Assert that `expected` is falsy. */
export type IsFalsy = (expected: boolean, message?: string) => void

/** Assert that `expected` is null. */
export type IsNull = <T>(expected: T, message?: string) => void

/** Assert that `expected` is not null. */
export type IsNotNull = <T>(expected: T, message?: string) => void

/** Assert that `expected` is defined. */
export type IsDefined = <T>(expected: T, message?: string) => void

/** Assert that `expected` is undefined. */
export type IsUndefined = <T>(expected: T, message?: string) => void

/** Assert that `expected` is NaN. */
export type IsNaN = <T>(expected: T, message?: string) => void

/** Assert that `expected` is greater than `actual`. */
export type IsGreaterThan = (expected: number, actual: number, message?: string) => void

/** Assert that `expected` is less than `actual`. */
export type IsLessThan = (expected: number, actual: number, message?: string) => void

/** Assert that `expected` is greater than or equal to `actual`. */
export type IsGreaterThanOrEqual = (expected: number, actual: number, message?: string) => void

/** Assert that `expected` is less than or equal to `actual`. */
export type IsLessThanOrEqual = (expected: number, actual: number, message?: string) => void

/** Define all asserts for perform an unit test case. */
export interface Test {
    isEqual: IsEqual
}

/** Define a unit test case callback function. */
export type TestCase = (test: Test, done: Function) => void

// export interface TestRunner {
//     run (): void
// }

/** Define an unit test. */
export type TestUnit = (message: string, caseFunc: TestCase) => void
