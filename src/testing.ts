import { Asserts, IsEqual, IsEqualPrimitive, IsNotEqual, IsPrimitive, TestCase, TestUnit } from "./testing.types"
import { Level, normal } from "./output"

interface TestItem {
    run: (fn: (assets: () => AssertItem[]) => void, skip: boolean) => void,
    message: string
}

interface AssertItem {
    ok: boolean
    error: Error | undefined
    message: string | undefined
}

interface AssertItemFail {
    num: number
    assert: AssertItem
}

type AssertsFunc = (fn: () => AssertItem[]) => void

const testList: TestItem[] = []

const createErrorIfNotOk = (falseCondition: boolean, errMessage: string) =>
    (!falseCondition ? new Error(errMessage) : undefined)

const isPrimitiveValue = <T>(value: T) => {
    switch (typeof value) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "symbol":
        case "undefined":
            return true
        default:
            if (value === null) return true

            return false
    }
}

export const test: TestUnit = (message: string, caseFunc: TestCase) => {
    let skipTests = false
    const assertList: AssertItem[] = []

    function getAsserts () {
        return assertList
    }

    function appendAssert (ok: boolean, error: Error | undefined, message: string | undefined) {
        assertList.push({ ok, error, message })
        return ok
    }

    // --- Assert functions definition

    const isPrimitive: IsPrimitive = (expected, message?: string) => {
        if (skipTests) return false

        const ok = isPrimitiveValue(expected)
        const error = createErrorIfNotOk(
            ok, `expected type \`${typeof expected}\` should be a valid primitive data type`
        )

        return appendAssert(ok, error, message)
    }

    const isEqualPrimitive: IsEqualPrimitive = (expected, actual, message) => {
        if (skipTests) return false

        let ok = isPrimitiveValue(expected) && isPrimitiveValue(actual)

        if (ok && (typeof expected !== typeof actual || expected !== actual)) {
            ok = false
        }

        const error = createErrorIfNotOk(
            ok, `expected \`${typeof expected}\` should be equal to actual \`${typeof actual}\` value and primitive data type`
        )

        return appendAssert(ok, error, message)
    }

    const isEqual: IsEqual = (expected, actual, message) => {
        if (skipTests) return false

        const ok = expected === actual

        const error = createErrorIfNotOk(
            ok, `expected value \`${expected}\` should be equal to actual \`${actual}\` value`
        )

        return appendAssert(ok, error, message)
    }

    const isNotEqual: IsNotEqual = (expected, actual, message) => {
        if (skipTests) return false

        const ok = expected !== actual

        const error = createErrorIfNotOk(
            ok, `expected value \`${expected}\` should not be equal to actual \`${actual}\` value`
        )

        return appendAssert(ok, error, message)
    }

    // --- Asserts API definition

    const asserts: Asserts = {
        isPrimitive,
        isEqualPrimitive,
        isEqual,
        isNotEqual
    }

    testList.push({
        run: (func: AssertsFunc, skip = false) => {
            skipTests = skip
            caseFunc(asserts, () => func(getAsserts))
        },
        message
    })
}

const measure = (hrtime?: [number, number]) => process.hrtime ?
    process.hrtime(hrtime) : [ window.performance.now() / 1e4, 0 ] as [number, number]

const formatTime = (hrtime: [number, number]) =>
    hrtime[0] + "s " + (process.hrtime ? hrtime[1] / 1e9 : hrtime[1]).toFixed(2) + "ms"

function runTests () {
    const detail: string[] = []
    const testLength = testList.length
    const starTime = measure()

    let counter = 0
    let assertionsCounter = 0
    let failedTests = false
    let failedTestAssertion: AssertItem | undefined = undefined

    const s = testLength > 1 ? "tests" : "test"

    console.log()
    console.log(normal("blue", `Executing ${testLength} ${s}...`))
    console.log()

    function testCompleted () {
        console.log(detail.join("\n"))
        console.log()

        const timeFinish = formatTime(measure(starTime))

        if (failedTests) {
            const timeTotal = normal("gray", "(" + timeFinish + ")")
            console.log(normal("red", "Error! Tests fail.") + " " + timeTotal)
        } else {
            console.log("Tests:", testLength)
            console.log("Assertions:", assertionsCounter)
            console.log("Time:", timeFinish)
            console.log()
            console.log(normal("green", "Done! All tests pass."))
        }

        console.log()

        if (failedTests && failedTestAssertion) {
            if (process.exit) process.exit(1)
            else throw failedTestAssertion.error
        }
    }

    const nextTest = () => {
        if (counter >= testLength) {
            testCompleted()
            return
        }

        const testUnit = testList[counter]
        const testStartTime = measure()

        testUnit.run((getAsserts) => {
            const asserts = getAsserts()
            let assertFailed: AssertItemFail | undefined = undefined

            const num = counter + 1
            let status = failedTests ? "SKIP" : "PASS"

            for (let i = 0; i < asserts.length; i++) {
                const assert = asserts[i]

                if (!assert.ok) {
                    failedTests = true
                    status = "FAIL"
                    assertFailed = { num: i + 1, assert }
                    failedTestAssertion = assert
                    break
                }
            }

            const lenNum = num.toString().length
            const spacesSub = " ".repeat(lenNum + 5 + status.length)

            let level: Level = "red"

            if (status === "PASS") level = "green"
            if (status === "SKIP") level = "gray"

            let assertionsStr = ""

            if (status === "FAIL" && assertFailed) {
                assertionsStr = (assertFailed.num - 1) + "/" + asserts.length
            } else {
                assertionsStr = asserts.length + "/" + asserts.length
                assertionsCounter += asserts.length
            }

            const testEndTime = formatTime(measure(testStartTime))
            const testInfo = normal(
                "gray",
                "(assertions: " + assertionsStr + ", time: " + testEndTime + ")"
            )

            const label = normal(level, status)

            detail.push(`${num}. [${label}] ${testUnit.message} ${testInfo}`)

            if (status === "FAIL" && assertFailed && assertFailed.assert.error) {
                const msg = normal("red", `Assertion #${assertFailed.num} fails because ${assertFailed.assert.error.message}`)
                detail.push(spacesSub + msg)
            }

            counter++
            nextTest()
        }, counter <= 1 && !failedTests ? false : failedTests)
    }

    nextTest()
}

setTimeout(runTests, 60)
