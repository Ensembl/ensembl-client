# 11. Component Development Environment

Date: 2019-02-27

## Status

Accepted

## Context

This ADR addresses two concerns:

1. To promote consistency across the UI, many designers and developers find it useful to build a design system (pattern library) that describes basic reusable building blocks of the UI, such as the color pallette, font families, text sizes, links, headings, buttons, alerts, loaders etc. A design system serves as a living-code documentation, and helps both the designer, who can see all the building blocks, as they are actually implemented, put together in one place, and the developer, who can readily see the range of reusable components and pick the ones he or she needs.

2. Development and thinking in React is thinking in terms of components. Often, it may be convenient to develop a component in isolation from the rest of the UI in order to better focus on it and to define its behavior and props requirements. A sandbox for developing components in isolation may thus be a helpful development tool.

## Proposal

Use [storybook](https://storybook.js.org/) as a development environment, both to grow a design system and to build individual components.

On a regular basis, deploy Storybook to a url where it will be publicly available (probably, after the ensembl-client repo goes public, use GithubPages for that). 

### Reasons for picking Storybook

While there exist quite a few alternatives to Storybook (see a [list](https://react-styleguidist.js.org/docs/cookbook.html#are-there-any-other-projects-like-this) here), Storybook was among the first if not the first design system / components development environment to get released, and has acquired a sizeable following since then. Currently, it supports about 10 different frameworks, which probably makes it the most universal tool out there.

_Caveat:_ we have not carefully considered Storybook alternatives.

## Risks

- Storybook behaves as a separate application with its own config files (much like Create React App). If a major development dependency (such as babel or webpack) gets updated, there may be a period until Storybook developers catch up with these changes, when it will be hard/impossible for us to update our dependencies. As an example, see [this issue](https://github.com/storybooks/storybook/issues/3805).