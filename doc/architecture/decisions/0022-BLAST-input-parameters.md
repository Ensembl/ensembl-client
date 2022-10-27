# 1. BLAST input parameters

Date: 2022-10-17

## Status

Draft

## Context
This document summarises different input parameters supported by Ensembl BLAST

### Source
All BLAST input parameters (except Sensitivity) in Ensembl comes from EBI Blast as we use their job dispatcher to run all our blast jobs. https://www.ebi.ac.uk/seqdb/confluence/pages/viewpage.action?pageId=94147939

[Available parameters in EBI Blast](https://wwwdev.ebi.ac.uk/Tools/services/rest/ncbiblast/parameters)

## Decision
### Preconfigured settings

Ensembl BLAST form allows users to choose settings that are pre-configured to do specific tasks. For BLAST searches, users can change the “Sensitivity” from “Normal” to the following:

- Near match - to find closer matches- more stringent settings than 'normal'
- Short sequences - for short sequences like primers: BLASTN only.
- Distant homologies - to allow lower-scoring pairs to pass through

## Presentation to client

We have decided to keep the bare minimum parameters that is required to run a job visible on the Blast form to make users easy to run a job quickly.

## Known issues

Job fails for certain combinations of gap open and extension penalties and mismatch score parameters. We need to implement rules for these for different blast programs.

## Future developments

Option to run REPEATMASKER may be added in the future.
