# 16. React testing library for unit testing React components

Date: 2020-11-28

## Status
Accepted

## Related ADR(s)
- [0004-unit-tests](0004-unit-tests.md)

## Context

In [0004-unit-tests](0004-unit-tests.md), we considered two alternative libraries for testing React components: `enzyme` and `react-testing-library`. By that time, we had already been using `enzyme` in `ensembl-client`, and we liked the convenience of selecting components and, if needed, inspecting their props that `enzyme` provided. We therefore decided to stick with `enzyme`. We agreed, however, that our tests would follow the same philosophy as was advocated by the creator of `react-testing-library`, namely that we would never attempt to test implementation details of a component, but would only test component's public API, the html output of a component, and side effects that a component can cause. We thus decided not to use shallow rendering or snapshot testing of serialized components; but rather to test components' behaviour by rendering them fully to the DOM.

Over a year and a half later, it has become clear that the extensive and elegant API of `enzyme`, with its multiple convenience functions for selecting and inspecting components, comes at a significant cost. In order to provide this API, `enzyme` relies on the knowledge of React's internals, which can, and do, change between releases. Every time this happens, `enzyme` has to catch up, and projects relying on `enzyme` need to wait until `enzyme` becomes capable of supporting the latest version of React before being able to update to this version.

Several developments have made us reconsider our choice:

1. React core team members have strongly voiced their concern about the testing methodology that requires knowledge of React's internals:
  - Sebastian Markbage [writes](https://twitter.com/sebmarkbage/status/1214325736867160064): "I'm getting pretty convinced that testing that relies on asserting on implementation details like what `react-test-renderer`, `react-test-renderer/shallow` and `enzyme` does breaks the notion of semver. They mean that every change to the internals of a component is a breaking change. That in turn effectively makes everything a breaking change, and as a result, makes the notion of semver useless... Therefore, I think the ecosystem should move away from those testing techniques and opt for things like react-testing-library."
  - Dan Abramov [writes](https://github.com/enzymejs/enzyme/issues/2358) in a github issue for `enzyme`: "Please note that in longer term, this isn't really going to be sustainable. We are planning bigger refactors which will change the internal data structure. I wonder if it would be better if Enzyme just shipped with its own copy of React that may lag behind in features. In our experience, Enzyme lagging behind due to its invasive reliance on internals has been the biggest factor in moving away from it."

2. On October 20, 2020, React v17 was released. Despite the fact that the public API of v17 has not changed compared to v16, its internals have changed sufficiently for `enzyme` to become incompatible with it. As of the time of this writing, over a month later, the `enzyme` team still has not released their adaptor for React v17. Meanwhile, `react-testing-library` has been compatible with React v17 from day one. This means that using `enzyme` puts us in an unfortunate position where our ability to update to the latest version of React becomes dependent on how fast the `enzyme` team can release a new adaptor, and there is no way of predicting how long this delay will take.

3. There seem to be problems with the development of the `enzyme` library:
  - The project lacks clarity of vision. The maintainer is involved in numerous other projects and is [overworked](https://github.com/enzymejs/enzyme/issues/2429#issuecomment-733995565).
  - An intention has been expressed to rely less on React internals in future versions ([see this issue](https://github.com/enzymejs/enzyme/issues/1648) and the discussion in [this issue](https://github.com/enzymejs/enzyme/issues/2358)); but there has been no concrete progress in this direction over the last years.
  - Some parts of `enzyme`'s api no longer even work properly since the release of React fiber and React hooks; while other parts are about to be deprecated. For example, the maintainer feels strongly that the `simulate` method is an unfortunate misnomer, because it does not really simulate DOM events, and plans to remove it from the future major version — if one ever comes out. This makes the api unstable and unreliable.

There are also some additional signals from the community suggesting that it is strongly favouring `react-testing-library`:

  - React's documentation site recommends React testing library over Enzyme:

  > We recommend using React Testing Library which is designed to enable and encourage writing tests that use your components as the end users do.

  - An influential consultancy _Thoughtworks_, in the Nov 2019 edition of their _Technology Radar_ periodical, [removed](https://www.thoughtworks.com/radar/languages-and-frameworks/enzyme) `enzyme` from the list of their recommended technologies in favour of `react-testing-library`.

  - In September 2020, `react-testing-library` has overtaken `enzyme` in popularity, according to the number of NPM downloads.

## Decision
While it is still possible that at some indeterminate point in the future, a new version of `enzyme` will come out that will combine a powerful and elegant api with complete agnosticism about the React internals, it is a safer bet to switch to `react-testing-library` now, and to prefer the seamlessness of React upgrades that it offers to a slightly more convenient component selection api of `enzyme`.

## Consequences
Going forward, all new tests for React components will be written using `react-testing-library` and utility libraries from the same family (such as `@testing-library/user-event`). The existing tests that are based on `enzyme` will be migrated over to `react-testing-library`. The migration is expected to proceed smoothly, because our tests have been written in a style very close to what is expected when using `react-testing-library`.
