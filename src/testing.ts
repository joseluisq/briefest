import { IsEqual, TestCase, TestUnit } from "./testing.types"
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

const isPrimitive = <T>(value: T) => {
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
    const assertList: AssertItem[] = []
    let skipTests = false

    function getAsserts () {
        return assertList
    }

    const isEqual: IsEqual = (expected, actual, message) => {
        if (skipTests) return

        let ok = isPrimitive(expected) && isPrimitive(actual)

        // TODO: Cover symbols here particularly
        if (ok && expected !== actual) {
            ok = false
        }

        const error = createErrorIfNotOk(
            ok,
            `expected (\`${expected}\`) should be equal to actual (\`${actual}\`)`
        )

        assertList.push({ ok, error, message })
    }

    const asserts = {
        isEqual
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
                const msg = normal("red", `Assertion #${assertFailed.num} failed: ${assertFailed.assert.error.message}`)
                detail.push(spacesSub + msg)
            }

            n++
            nextTest()
        }, n <= 1 && !failedTests ? false : failedTests)
    }

    nextTest()
}

setTimeout(runTests, 60)
