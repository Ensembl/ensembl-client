# 13. Animation Library

Date: 2019-03-15

## Status

Accepted

## Context

We need an animation library that would help us to easily create animations to provide a better UI/UX. 

Example animations:
- Toggling trackpanel
- Toggling drawer
- Toggling dropdowns

## Decision

The following are top three libraries available:

**1) React Transition Group** - (https://github.com/reactjs/react-transition-group)
 Works by simply changing classes on an element depending on lifecycle of a transition (entering transition, being in transition, exiting transition). Since all it does is just changing classes, the transition itself has to be written in CSS. On the plus side, this means these transitions are the most performant. On the minus side, CSS gets decoupled from JS. Also, the duration of animation is imperatively controlled in two places: by time passed to the component and by duration specified in CSS.

- Minified size: 16.9 KB
- 67 issues open and 260 closed
- Gives more flexibility and control with increase in complexity
- Mainly based on adding animations when an element gets rendered or removed from the DOM. It has four states which are entering, entered, exiting and exitied.
- Documentation seems to be a bit scattered but there are some good video tutorials

**2) React Spring** - (https://www.react-spring.io/)
 A spiritual successor of `react-motion`, sharing the general approach that `react-motion` introduced. It works entirely in javascript, by interpolating values (any values) over time using interpolation functions ("springs"). What this means is that duration of animation is controlled by parameters such as "tension" or "friction" passed to the spring function (so instead of thinking in terms of time you have to think in terms of spring metaphor: how rigid or elastic your spring is and how heavy a weight it is trying to move). This, arguably, makes the animation more "physical" (and therefore "realistic"). Also, the animation itself is done by constantly re-rendering a part of your component, feeding it with newly interpolated values and using these values for new inline styles. In terms of performance, it is almost inevitably worse than just having a CSS animation. The performance hit, however, is usually tolerable.

- Minified size: 26 KB
- 73 issues open and 315 closed
- React-specific library
- Clear documentation
- Has a good set of examples to get an idea of what can be done.
- Also, the number of lines required to implement an animation using React-Spring is less compared to React Transition Group.


**3) Pose** - (https://popmotion.io/pose/)
 An adaptation of the `popmotion` library for react. People who have experience with it like it for its declarative interface.
- User friendly API library
- Minified size: 61 KB 
- 108 issues open and 351 closed
- More complex to learn and implement the animations compared to spring

Looking at some of the reviews and blog posts about Pose and React Spring, I came across many issues that were reported against Pose when compared with React Spring.

By considering the above facts, React Spring seems to be a better option to go for.

## Consequences
This library will help us to implement animations easily by using the APIs provided. This would mean that we will not have to create complex CSS classes and manually handle which class to use and when.
The syntax used by React Spring would involve using the tag `<animated.div>`, which would help us to easily identify the elements that has animations attached to it just by looking at the code. 
