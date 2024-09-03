# structured-regex

[![Build](https://github.com/readmeio/structured-regex/workflows/CI/badge.svg)](https://github.com/readmeio/structured-regex/) [![](https://img.shields.io/npm/v/structured-regex)](https://npm.im/structured-regex)

[![](https://raw.githubusercontent.com/readmeio/.github/main/oss-header.png)](https://readme.io)

`structured-regex` is a wrapper for [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) that allows you to do named group parsing without having to use actually [named capture groups](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Named_capturing_group).

Why not use named capture groups? If you're composing a complicated regex by interpolating other regex patterns into it if any of those patterns contain a named capture that group may either only partially match the pattern they're inserted into, or if their name is reused then the regex will throw an error.

For example on a `/projects/me` URI with a regex to match it of `/projects/(me|${PROJECT_SUBDOMAIN.regex.source})` you can't have `?<subdomain>` inside of the `PROJECT_SUBDOMAIN` regex because `me` wouldn't be placed into our matched `subdomain` group.

`structured-regex` not only allows you to formally define the expected typings of our matches but you can supply it a mapping object to coorelate your named group with the index that it's captured against.

## 📦 Installation

```sh
npm install --save structured-regex
```

## 🧰 Usage

```ts
import { StructuredRegEx } from 'structured-regex';

const SEMVER_REGEX = /([0-9]+)(?:\.([0-9]+))?(?:\.([0-9]+))?(-.*)?/;
const SLUG_REGEX = /[a-z0-9-_ ]+/i;

const VERSION_REGEX = new RegExp(`stable|${SEMVER_REGEX.source}`, 'i');
const API_FILENAME_REGEX = new RegExp(`(${SLUG_REGEX.source}.(json|yaml|yml))`, 'i');

const API_URI_REGEX = new StructuredRegEx<{ filename: string; version: string }>(
  new RegExp(`/versions/(${VERSION_REGEX.source})/apis/(${API_FILENAME_REGEX.source})`, 'i'),
  {
    version: 1,
    filename: 6, // `filename` is in the `matches[6]` spot of a valid match
  },
);

console.log(API_URI_REGEX.parse('/versions/stable/apis/petstore.json'));
// ➪ { version: 'stable', filename: 'petstore.json' }
```

You can also supply it non-`RegExp` regexes as well.

```ts
const API_URI_REGEX = new StructuredRegEx<{ filename: string; version: string }>(/\/versions\/(.*)\/apis\/(.*)/i, {
  version: 1,
  filename: 2,
});

console.log(API_URI_REGEX.parse('/versions/stable/apis/petstore.json'));
// ➪ { version: 'stable', filename: 'petstore.json' }
```
