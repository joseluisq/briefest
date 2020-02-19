import { test } from "./testing"

const abc = () => {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => resolve(3), 2000)
    })
}

const abc2 = (cb: Function) => {
    setTimeout(() => cb(10), 2000)
}

test("Testing 1", async (t, done) => {
    t.isEqual(0, 0)
    t.isEqual(1, 1)
    t.isEqual(1, 1)

    abc2((v: any) => {
        t.isEqual(10, v)

        done()
    })

    // t.isEqual(1, await abc())

    // done()
})

test("Testing 2", (t, done) => {
    t.isEqual(1, 1)
    t.isEqual(1, 1)

    done()
})
test("Testing 3", (t, done) => {
    t.isEqual(1, 1)
    t.isEqual(1, 1)

    done()
})
test("Testing 4", (t, done) => {
    t.isEqual(1, 1)

    done()
})
