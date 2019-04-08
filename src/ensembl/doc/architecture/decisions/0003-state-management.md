# 3. State Management

Date: 2018-08-30

## Status

Accepted

## Context

The state of data and UI will grow in the application as the development goes on. There needs to be good state management mechanism to handle this.

## Decision

[Redux](https://redux.js.org/) will be used for the state management. It is a centralised state management container, that can handle the state for data and UI of the application.

Using React.js state only, instead of any state management library, was considered. However, this would make it difficult to share state between sibling components and manage global state as well.

Also, Mobx was discussed about. However, the magic nature of how things are done with it compared to Redux made the team decide not to go ahead with it.

## Consequences

Redux does not use any magic and instead uses functions and objects to create its various components i.e. actions, reducers, etc. This should make it straightforward to implement it. However, it does contain a lot of boilerplate.

Using `typesafe-actions` will help reduce the boilerplate, especially for action creators. Also, it provides typesafe utilities for Redux code. `redux-action` was another utility library for Redux that was considered. However, the TypeScript support of it was not great, hence why it was not chosen over `typesafe-actions`.

Selectors will be used to improve maintenance and managing of state. Also, `reselect` can be used for complex reducers and should improve performance through memoization.
