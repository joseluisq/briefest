import { Asserts, IsEqual, IsEqualPrimitive, IsNotEqual, IsPrimitive, TestCase, TestUnit } from "./testing.types"
import { Level, normal } from "./output"

interface TestItem {
    run: (fn: (assets: Function) => void, skip: boolean) => void,
    message: string
}

interface AssertItem {
    ok: boolean
    error: Error | undefined
    message: string | undefined
}

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

        assertList.push({ ok, error, message })
        return ok
    }

    const isNotEqual: IsNotEqual = (expected, actual, message) => {
        if (skipTests) return false

        const ok = expected !== actual

        const error = createErrorIfNotOk(
            ok, `expected value \`${expected}\` should not be equal to actual \`${actual}\` value`
        )

        assertList.push({ ok, error, message })
        return ok
    }

    // --- Asserts API definition

    const asserts: Asserts = {
        isPrimitive,
        isEqualPrimitive,
        isEqual,
        isNotEqual
    }

    testList.push({
        run: (cb: Function, skip = false) => {
            skipTests = skip
            caseFunc(asserts, () => cb(getAsserts))
        },
        message
    })
}

function runTests () {
    let n = 0
    const detail: string[] = []
    let failedTests = false
    let failedTestAssertion: any = undefined

    console.log()
    console.log(normal("blue", "Executing " + testList.length + " test(s)..."))
    console.log()

    function testCompleted () {
        console.log(detail.join("\n"))
        console.log()

        // TODO: Print final testing result info
        if (failedTests) {
            console.log(normal("red", "Error! Tests fail.") + " " + normal("gray", "(0.00s)"))
        } else {
            console.log(normal("green", "Done! All tests pass.") + " " + normal("gray", "(0.00s)"))
        }

        console.log()

        if (failedTests && failedTestAssertion) {
            process.exit(1)
            // throw failedTestAssertion.error
        }
    }

    const nextTest = () => {
        if (n >= testList.length) {
            testCompleted()
            return
        }

        const t = testList[n]

        t.run((getAsserts) => {
            const asserts = getAsserts()
            let assertFailed: any = undefined

            const num = n + 1
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

            const label = normal(level, status)
            let assertionsPassed = ""

            if (status === "FAIL") {
                assertionsPassed = (assertFailed.num - 1) + "/" + asserts.length
            } else {
                assertionsPassed = asserts.length + "/" + asserts.length
            }

            const testInfo = normal("gray", "(assertions: " + assertionsPassed + ", time: 0.00s)")

            detail.push(`${num}. [${label}] ${t.message} ${testInfo}`)

            if (status === "FAIL") {
                const msg = normal("red", `Assertion #${assertFailed.num} fails because ${assertFailed.assert.error.message}`)
                detail.push(spacesSub + msg)
            }

            n++
            nextTest()
        }, n <= 1 && !failedTests ? false : failedTests)
    }

    nextTest()
}

setTimeout(runTests, 60)
