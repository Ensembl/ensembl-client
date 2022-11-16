# 23. BLAST Species/Sequence interactions

Date: 2022-10-17

## Status

Draft

## Context
This document summarises the interactions between the input sequences and selection of species.

## Decision

The Blast form allows adding more than one query sequences and species. However, during submission we submit each sequence against each species as individual jobs

For example, if a user chooses to submit 2 sequences to search against 3 species databases in a single submission, the final submission will contain 2 x 3 = 6 individual jobs.

To control overloading the system with bulk submission we limit the number of species and sequences to be submitted on a single submission as below.

Max number of sequences: 50
Max number of species: 25

### Reasons:

1. We follow what the current site provides.
2. Submitting jobs against multiple species requires production of a combined species database which is not available at the moment.
3. Submitting individual jobs provides better turnover than searching against a bigger database of multiple genomes
4. Results from genomes with varying genomic lengths affecting e-values/ percent identities?

## Known issues

- There are currently no known issues.

## Future developments

- We may apply limit to species selection as the species list grows.