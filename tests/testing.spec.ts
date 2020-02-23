import { test } from "../src/testing"

test("isPrimitive() tests", (t, done) => {
    t.isPrimitive(-1)
    t.isPrimitive(0)
    t.isPrimitive(1)
    t.isPrimitive(NaN)
    t.isPrimitive(2n ** 8n)
    t.isPrimitive("")
    t.isPrimitive(true)
    t.isPrimitive(null)
    t.isPrimitive(undefined)

    done()
})

test("isEqualPrimitive() tests", (t, done) => {
    t.isEqualPrimitive(0, 0)
    t.isEqualPrimitive(1, 1)
    t.isEqualPrimitive(64n, 2n ** 6n)
    t.isEqualPrimitive("", "")
    t.isEqualPrimitive(true, true)
    t.isEqualPrimitive(null, null)
    t.isEqualPrimitive(undefined, undefined)

    const symbol = Symbol("a")
    t.isEqualPrimitive(symbol, symbol)

    done()
})

test("isEqual() tests", (t, done) => {
    t.isEqual(0, 0)
    t.isEqual(1, 1)
    t.isEqual(64n, 2n ** 6n)
    t.isEqual("", "")
    t.isEqual(true, true)
    t.isEqual(null, null)
    t.isEqual(undefined, undefined)

    const a = () => void
    t.isEqual(a, a)

    const b: number[] = []
    t.isEqual(b, b)

    const c = {}
    t.isEqual(c, c)

    const d = new Date()
    t.isEqual(d, d)

    // BigInt
    t.isEqual(256n, 2n * 128n)

    done()
})

test("isNotEqual() tests", (t, done) => {
    t.isNotEqual(1, 2)
    t.isNotEqual(-1, 0)
    t.isNotEqual(64n, 1n ** 6n)
    t.isNotEqual("1", "0")
    t.isNotEqual(true, undefined)
    t.isNotEqual(null, 0)
    t.isNotEqual(undefined, null)
    t.isNotEqual([], [])
    t.isNotEqual({}, {})
    t.isNotEqual(() => void 0, () => void 0)
    t.isNotEqual(new Date(), new Date())

    done()
})

const callbackTest = (cb: (v: number) => void) => setTimeout(() => cb(500), 200)
const asyncTest = () => new Promise<number>((resolve) => setTimeout(() => resolve(600), 100))

test("Async tests", (t, done) => {
    callbackTest(async (v) => {
        t.isEqual(500, v)

        // an async/await example
        t.isEqual(600, await asyncTest())

        done()
    })
})
