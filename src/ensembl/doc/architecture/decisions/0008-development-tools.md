# 8. Development Tools

Date: 2018-09-07

## Status

Accepted

## Context

Development tools makes it a lot easier to debug, and optimise code. Also, when the team uses the same tools, it becomes easier to communicate and debug as a group.

## Decision

While picking the development tools for coding is a personal choice, there are certain tools that all members of the team can use. A couple of such tools for React and Redux are:

1. [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi): an extension for Google Chrome
2. [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd): a Google Chrome extension that uses [`redux-devtools`](https://github.com/reduxjs/redux-devtools) under the hood

Apart from these, there are also extensions for VS Code as mentioned in #0006. This again is subject to which IDE the individual developer would choose for coding.

## Consequences

Using the same devtools enables the team to debug issues collectively. However, the downside is that these tools might be available only in one platform e.g. Google Chrome. This would hamper testing in other platforms. While there can be alternatives available, supporting all of them will not be an easy task.