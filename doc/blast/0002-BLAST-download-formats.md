# 2. BLAST download formats

Date: 2022-09-19

## Status

Draft

## Context
Downloading of BLAST results to support ongoing journeys is desired functionality for BLAST.   

## Decision
We have chosen an initial minimal, simple implementation of data Download.

#### Table export
Export the results table in CSV format. This will allow inspection and analysis of the results in popular programs such as Excel. 

### Raw results
The raw results as provided from BLAST can be exported in TXT format. Since this is a common format supported by NCBI, EBI and the current Ensembl website we expect that this will support existing third party analysis workflows.   

### Submission versus job
A submission is considered as the combination of a single query sequence against one or more target databases. A job is a a single query sequence and a single target sequence. User reasearch identified a need for supporting download of both whole submissions and individual jobs.

## Known Issues
We have excluded exporting of the alignments themselves from a table since although desired, they do not fit easily into the CSV format nor into importing into Excel and we do not a clear view on how to do this.

## Future development
It is certain that the options provided will expand over time as we obtain further user feedback.
