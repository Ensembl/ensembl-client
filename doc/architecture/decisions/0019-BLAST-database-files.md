# 19. BLAST database files

Date: 2022-09-05

## Status

Draft

## Context

For each database option presented in the BLAST interface we require a BLAST database. These are generated from FASTA files and interestingly the content of the FASTA headers is returned by BLAST. The headers are therefore sources of data that could potentially be used to add value to the results.
This document summarises the decisions made when creating these files for the initial implementation of BLAST on the new Ensembl website  

## Decision

### Database choices
#### Genomic sequence
Unmmasked and hard masked.
We chose to not support soft masked...
#### Transcripts
cDNAs containing sequences of all transcripts, from both protein coding and non coding genes (note non coding are missing).
Proteins for all protein coding transcripts.
We chose not to support ab initio transcripts, either the cDNA or the protein sequences since predicting transcripts using ab initio approaches, for example SNAP, is very much an outdated technology.

### File naming
File are named after our inital implementation of genome IDs - species and GCA. An example is homo_sapiens_GCA_000001405_28

### Structure of FASTA headers
The FASTA header was not updated beyond the default obtained from the FTP site, for example
ENST00000631435.1 cdna chromosome:GRCh38:CHR_HSCHR7_2_CTG6:142847306:142847317:1 gene:ENSG00000282253.1 gene_biotype:TR_D_gene transcript_biotype:TR_D_gene gene_symbol:TRBD1 description:T cell receptor beta diversity 1 [Source:HGNC Symbol;Acc:HGNC:12158]

## Consequences

### File naming
Since naming the files in this way we have developed our concept of genome IDs. This assigns a UUID to the combination of the genome and its associated annotation. For some species this will change with every release, but of course the sequence of the genome itself will not change as frequently. Having a single, UUID based naming system for both of these feels inappropriate, but in the abscence of a decision on what to do we have not changed this. 
