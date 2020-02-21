export type IsPrimitive = <T>(expected: T, message?: string) => boolean
export type IsEqual = <T>(expected: T, actual: T, message?: string) => boolean
export type IsNotEqual = <T>(expected: T, actual: T, message?: string) => boolean
export type IsEqualPrimitive = <T>(expected: T, actual: T, message?: string) => boolean

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
export interface Asserts {
    /** Assert that `expected` is valid primitive data type. */
    isPrimitive: IsPrimitive

    /** Assert that `expected` is equal to `actual`. */
    isEqual: IsEqual

    /** Assert that `expected` is not equal to `actual`. */
    isNotEqual: IsNotEqual

    /** Assert that `expected` is not equal to `actual` value and data type. */
    isEqualPrimitive: IsEqualPrimitive
}

/** Define a unit test case callback function. */
export type TestCase = (asserts: Asserts, done: Function) => void

/** Define an unit test. */
export type TestUnit = (message: string, caseFunc: TestCase) => void
