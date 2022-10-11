# 1. BLAST download formats

Date: 2022-09-10

## Status

Draft

## Context
Downloading of BLAST results to support ongoing journeys is desired functionality for BLAST.   

## Decision
User research and feedback is a critical component will be a critical component of decision making. Until we have that we hanve chosen a simple minimal implementation.

#### Table export
Export the results table in CSV format. This will allow inspection and analysis of the results in popular programs such as Excel. We have excluded the alignments themselves since, although we expect them to be desired, they do not fit easily into the CSV format nor into imprting into Excel.

### Raw results
The raw results as provided from BLAST can be exported in TXT format. Since this is a common format supported by NCBI, EBI and the current Ensembl website we expect there to be existing third party analysis workflows that this will support.   

### Submission versus job
A submission is considered as the combination of a single query sequence against one or more target databases. A job is a a single query sequence and a single target sequence. 

Why support export from both...?

## Consequences
The options provided will most likely expand and develop as we obtain user feedback.
