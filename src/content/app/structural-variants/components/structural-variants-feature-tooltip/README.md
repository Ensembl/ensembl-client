This component is, effectively, a re-creation of the `Zmenu` component from the genome browser page.

The main justification for re-creating the component is that, currently, the `Zmenu` component is tightly coupled with the genome browser. Even the least specific part of that component, `ZmenuContent`, uses a `useGenomeBrowserIds` hook, which couples it to `GenomeBrowserIdsContext`.