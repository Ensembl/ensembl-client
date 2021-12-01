# 2. Frontend Code

Date: 2018-08-28

## Status

Accepted

## Context

A frontend framework is necessary for the development of the new website. This framework needs to be modern, well supported and documented, as well as have good performance.

## Decision

[React.js](https://reactjs.org/) is used as the frontend framework for building the new website. React.js is used with [TypeScript](https://www.typescriptlang.org/), which is a superset of JavaScript.

## Consequences

Due to the declarative nature of React.js, building components necessary for the new website becomes a lot easier compared to using a library such as jQuery. React.js is widely supported and also is easier to learn. This should help the existing team members and new members to get on board quickly.

Using strict TypeScript would help to detect errors in the code quite early as there is a compile step involved. Also, using TypeScript itself means the code is partially documented due its static typing nature. This would help the team to understand the code better and also focus less on documenting the code.

SASS offers a lot of features that are not currently available with CSS. Writing reusable style code is also possible with SASS.
