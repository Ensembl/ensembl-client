# AutosuggestSearchField

## Behaviour

This component should enable the following behaviours:

### Regular use case

Focus on the field. Start typing. If any matches are found, they will be presented in the autosuggestion panel.

### Prepopulate with data

Press on a button in a different component (e.g. PopularSpeciesButton). The field gets filled with relevant data, but importantly it does not open autosuggest panel.

### Keyboard navigation
Start typing. Get suggestions. Cycle between suggestions using arrow keys. Pressing an enter when focused on a particular suggestion should select this suggestion.

### Focus/blur
Start typing. Get suggestions. Click on a different element in the document. The autosuggestion panel should close. Focus back on the field. The autosuggestion panel should reappear.

## Suggested results

According to designs, it should be possible to arrange suggested results into groups (with optional headings); that's why the shape of the `matches` property accepted by the component is an array of group objects, each of which in turn will contain an array of matched results.
