# Autosuggest search field

## Synonyms
Autocomplete, typeahead, lookahead

## Resources
### Articles on autocomplete element
- [Building an accessible autocomplete control](https://adamsilver.io/blog/building-an-accessible-autocomplete-control)

### Examples for comparison
- [Accessible Autocomplete, by gov.uk](https://github.com/alphagov/accessible-autocomplete)
- [Angular Material autocomplete](https://material.angular.dev/components/autocomplete)
- Search field in the middle of a new Chrome tab
- Google search field
  - In the centre of the google.com page
  - In the top of a search results page
- Youtube search field
- Github search field

- [Uniprot design system's autocomplete field](https://ebi-uniprot.github.io/franklin-sites/?path=/story/forms--autocomplete)
- [NCBI taxonomy autocomplete field](https://www.ncbi.nlm.nih.gov/datasets/taxonomy/9606)

## Points to consider
### Keyboard navigation
Navigation from search field to autosuggestion list
  - All examples use `ArrowDown` button to enter the autosuggestion list

Is the navigation through the list circular, i.e. if you press `ArrowDown` on the last match in the autosuggestion list, does the focus stay on the last match, or does it move to the first match?
  - Not circular in Alphagov autocomplete element
  - Circular in Chrome, on google.com, on github, on youtube

What does pressing `ArrowUp` do when the first element of the autosuggestion list is focused?
  - Focus moves back into the search input – Alphagov, Google.com, youtube, 
  - Focus cycles to the last element in the list — Chrome, github

What happens on Escape?
  - Autosuggestion field disappears: Google.com, youtube
  - Autosuggestion field disappears, and the search field cleans up: Chrome, github

What happens on Tab press?
  - Autosuggestion list elements cannot be iterated with tabs. Pressing tab will cause autosuggestion box to disappear — Chrome, Google.com, youtube
  - Alphagov interprets Tab as a confirmation of the focused item in the autosuggestion box

What happens if you focus on an element in the suggestion list, and then continue to type?
  - Navigating through elements in the autosuggestion list should not remove focus from the input field. If you start nagigating through the list and then continue typing, the contents of the input field will update


### Mouse hover
Mouse hover should highlight an option about to be selected.

If an option has been highlighted with the keyboard, would mouse hover over another element move the focus to that element, or somehow highlight it in a different way, so that two elements of the list are highlighted?

### How to position the autosuggestion list?
Should we use the `popover` element?

## Implementation
The intent behind the architecture of the component is to achieve maximum flexibility in the data associated with automatic suggestions, and the formatting of the suggestions. The proposed component interface will be as follows:


```tsx
const suggestions = (
  <>
    <Suggestion data={something}>
      My first suggestion
    </Suggestion>
    <Suggestion data={something_else}>
      My second suggestion
    </Suggestion>
  </>
);

<AutosuggestSearchField
  suggestions={suggestions}
/>
```

The `AutosuggestSearchField` component would display the `suggestions` is passed to it through the `suggestions` property. A `Suggestion` component is styleable on its own, and also displays whatever children it receives from the outside, formatted in whatever way desirable. There may be any other components inserted between the `Suggestion` elements (one common scenario is a separator).

Each `Suggestion` element will have a `data-search` attribute containing serialised data that is associated with this suggestion. When user selects a suggestion, this serialised data is read back and returned in a callback from the `AutosuggestSearchField` component.

In order to achieve all this, the `AutosuggestSearchField` component has to establish connections with the `Suggestion` components that it receives. It does so through the following mechanisms:
- Using a `context` to pass state top down into `Suggestion` components, so that they know which `Suggestion` is active at any given point
- Counting DOM nodes to identify how many `Suggestion` components it has
- Clicks on individual `Suggestion` components are signalled to the `AutosuggestSearchField` component through custom DOM events

This direct DOM access is antithetical to React, but it works; and there might not be a proper idiomatic React way of building such a component.