import { IsEqual, TestCase, TestUnit } from "./testing.types"

const testList: {
    run: (fn: (assets: Function) => void, skip: boolean) => void,
    message: string
}[] = []

export const test: TestUnit = (message: string, caseFunc: TestCase) => {
    const assertList: any[] = []
    let skipTests = false

    function getAsserts () {
        return assertList
    }

    const isEqual: IsEqual = (expected, actual, message) => {
        if (skipTests) return

        // 1. Evaluation
        const ok = expected === actual

        let error: Error | null = null

        if (!ok) {
            error = new Error(
                `expected value \`${expected}\` should be equal to actual value \`${actual}\``
            )
        }

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

    function testCompleted () {
        console.log(detail.join("\n"))

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

            detail.push(`${num}. [${status}] ${t.message} (${asserts.length} assertion(s) on 0.00s)`)

            if (status === "FAIL") {
                detail.push(`${spacesSub}Assertion #${num} failed: ${assertFailed.assert.error.message}`)
            }

            n++
            nextTest()
        }, n <= 1 && !failedTests ? false : failedTests)
    }

    nextTest()
}

setTimeout(runTests, 500)
