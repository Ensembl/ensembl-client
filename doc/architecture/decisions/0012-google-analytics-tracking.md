# 12. Google Analytics Tracking

Date: 2019-03-06

## Status

Accepted

## Context

We need a tool that passes on the website usage information across to Google Analytics. This tool should help us to track actions like the pageviews, events, navigation and user behaviour.  

## Decision

Popular libraries that available to implement Google Analytics tracking in React:
- react-ga (https://www.npmjs.com/package/react-ga) 
- redux-beacon (https://rangle.gitbook.io/redux-beacon/)

### React Beacon
**Pros**:
- Lightweight (~1KB)
- Provides a way to track all the events by writing less code

**Cons**: 
- This is not a dedicated package to support analytics
- Makes it complex to implement the feature where we can skip tracking of specifix events
- Less number of downloads compared to React GA (3 downloads on 3rd of March)
- Requires adding the tracking snippet to the HTML file

### React GA
**Pros**:
- More number of downloads (191316 downloads on 3rd of March)
- Dedicated towards supporting google analytics functionalities to react
- Gives us functionality to track all the events by writing less code and also the ability to skip specified ones.
- Does not require adding the tracking snippet to the HTML file

**Cons**:
- Does not provide a way to track the events that does not affect the root state. We will have to manually call ReactGA to track those events if needed.
- Refer to the consequences where the other possible cons are addressed


## Consequences
**Easier to track pageviews and events**
We just need to call simple functions provided by the ReactGA to track usefuls actions such as events, pageviews, navigation and timings.

**More robust way to enforce GA implementation** 
PR review template will have google analytics sections. The reviewer will have to make sure that all the necessary events are tracked. 

