# 22. BLAST input parameters

Date: 2022-10-17

## Status

Draft

## Context
This document summarises different input parameters supported by Ensembl BLAST

### Source
All BLAST input parameters (except Sensitivity) in Ensembl come from EBI BLAST as we use their job dispatcher to run all our BLAST jobs. https://www.ebi.ac.uk/seqdb/confluence/pages/viewpage.action?pageId=94147939

[Available parameters in EBI BLAST](https://wwwdev.ebi.ac.uk/Tools/services/rest/ncbiblast/parameters)

## Decision

### Preconfigured settings

Ensembl BLAST form allows users to choose settings that are pre-configured to do specific tasks. For BLAST searches, users can change the “Sensitivity” from “Normal” to the following:

- Near match - to find closer matches- more stringent settings than 'normal'
- Short sequences - for short sequences like primers: BLASTN only.
- Distant homologies - to allow lower-scoring pairs to pass through

## Presentation to client

The parameters presented by default on the form have been kept to a bare minimum so that users can very quickly run a job. More advanced users can still access the details with one click.

## Known issues

Job fails for certain combinations of gap open and extension penalties and mismatch score parameters. We need to implement rules for these for different BLAST programs.

## Future developments

Option to run REPEATMASKER on query sequence will be added in the future.
