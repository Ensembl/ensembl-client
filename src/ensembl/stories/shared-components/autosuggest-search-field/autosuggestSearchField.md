# AutosuggestSearchField

## Behaviour

This component should enable the following behaviours:

### Regular use case

Focus on the field. Start typing. If any matches are found, they will be presented in the autosuggestion panel. Click on a suggestion to submit it.

### Prepopulate with data

Trigger a different component (e.g. PopularSpeciesButton) to provide data to the search field. The field gets filled with relevant data, but, importantly, it does not open autosuggest panel.

### Keyboard navigation
Start typing. Get suggestions. Cycle between suggestions using arrow keys. Pressing `enter` when focused on a particular suggestion should select this suggestion.

### Focus/blur
Start typing. Get suggestions. Click on a different element in the document. The autosuggestion panel should close. Focus back on the field. The autosuggestion panel should reappear.

### Submission of raw search string
AutosuggestSearchField can have two different modes of behaviour, depending on a particular passed prop (`allowRawInputSubmission`):

1. When user keys in the search and is presented with a list of autosuggestions, the first suggestion will be automatically pre-selected (highlighted). Pressing `enter` will confirm the selection. Cycling between the suggestions with up and down arrow keys will ensure that some suggestion is always highlighted. It is impossible to submit anything other than a suggested result.

2. The user may submit a partial match (whatever is entered in the field). Pressing `enter` when a suggestion is not highlighted will submit the contents of the search field; pressing `enter` when a suggestion is highlighted will submit this suggestion.

## Suggested results

According to designs, it should be possible to arrange suggested results into groups (with optional headings); that's why the shape of the `matches` property accepted by the component is an array of group objects, each of which in turn will contain an array of matched results.
