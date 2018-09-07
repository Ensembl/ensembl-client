# 3. State Management

Date: 2018-08-30

## Status

Accepted

## Context

The state of data and UI will grow in the application as the development goes on. There needs to be good state management mechanism to handle this.

## Decision

[Redux](https://redux.js.org/) will be used for the state management. It is a centralised state management container, that can handle the state for data and UI of the application.

## Consequences

Redux does not use any magic and instead uses functions and objects to create its various components i.e. actions, reducers, etc. This should make it straightforward to implement it. However, it does contain a lot of boilerplate. Using `redux-actions` can reduce the boilerplate to a certain degree.