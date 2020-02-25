# Briefest [![npm](https://img.shields.io/npm/v/briefest.svg)](https://www.npmjs.com/package/briefest) [![npm](https://img.shields.io/npm/dt/briefest.svg)](https://www.npmjs.com/package/briefest) [![Build Status](https://travis-ci.com/joseluisq/briefest.svg?token=qB1iXZPP7iKjyeqfe4pA&branch=master)](https://travis-ci.com/joseluisq/briefest) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Small and fast [Typescript](https://www.typescriptlang.org/) [unit testing](https://en.wikipedia.org/wiki/Unit_testing) library with no dependencies.

![Testing using Briefest](https://user-images.githubusercontent.com/1700322/75292053-c0cd4880-5823-11ea-9a0a-1637cce7b7d8.png)

## Install

[Yarn](https://github.com/yarnpkg/)

```sh
yarn add briefest --dev
```

[NPM](https://www.npmjs.com/)

```sh
npm install briefest --save-dev
```

[UMD](https://github.com/umdjs/umd/) file is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/briefest/briefest.umd.min.js"></script>
```

You can use the library via `window.briefest`.

## Usage

### Simple tests

```ts
import { test } from "briefest"

test("Simple tests", (t, done) => {
    t.isPrimitive(-1)
    t.isPrimitive(2n ** 8n)

    t.isEqualPrimitive(undefined, undefined)

    t.isEqual("", "")
    t.isEqual(64n, 2n ** 6n)

    t.isNotEqual({}, {})
    t.isNotEqual(new Date(), new Date())

    done()
})
```

### Asynchronous tests

```ts
import { test } from "briefest"

const callbackTest = (cb: (v: number) => void) => setTimeout(() => cb(500), 200)
const asyncTest = () => new Promise<number>((resolve) => setTimeout(() => resolve(600), 100))

test("Async tests", (t, done) => {
    callbackTest(async (val) => {
        t.isEqual(500, val)

        // an async/await example
        t.isEqual(600, await asyncTest())

        done()
    })
})
```

## Contributions
Feel free to send some [pull request](https://github.com/joseluisq/briefest/pulls) or [issue](https://github.com/joseluisq/briefest/issues).

## License
MIT license

© 2020 [Jose Quintana](http://git.io/joseluisq)
