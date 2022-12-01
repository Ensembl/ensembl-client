# 1. BLAST database files

Date: 2022-09-11

## Status

Draft

## Context

This document summarises the decisions made when choosing which database options to support for the initial implementation of BLAST on the new Ensembl website.  

## Decision

### Database choices
BLAST databases are generated from FASTA files copied from the Ensembl and ensemblgenomes FTP sites

#### Genomic sequence
Unmmasked and softmasked masked, excluding hardmasked. Softmasked sequence has all the sequence, and so the coords are consistent, it’s just that parts are lowercase and will be ignored by BLAST when it’s looking for regions to seed the alignments. An alignment seed can be found near a repeat and the alignment can then be extended into the repeat though. This is based on the idea that you’re probably not looking for things that are wholly contained in repeats. Plus it makes BLAST much faster as it looks at less of the genome.
Hardmasked sequence has all the repeat regions removed, so it’s essentially like a very extreme version of softmasking that removes anything that looks like a repeat and also changes the coordinates as a result. As a result there will be no alignments to anything classed as a repeat, even through extension of the initial alignment. There are very few scenarios where this would be a good thing and potentially it’s very confusing and misleading.

#### Transcripts
cDNAs containing sequences of all transcripts, from both protein coding and non coding genes. Proteins for all protein coding transcripts.
We chose not to support ab initio transcripts, an option available on the current website since predicting transcripts using these methods, for example by SNAP, is very much an outdated technology.

### File naming
Files, and directories are named after our inital implementation of genome IDs - species and GCA. An example is homo_sapiens_GCA_000001405_28

### FASTA headers
Each FASTA header contains the default obtained from the FTP site prefixed with, for reasons of job scheduling, the term 'ENSEMBL:'. An example is
`>ENSEMBL:ENST00000613293.4 cdna chromosome:GRCh38:4:22692914:22819568:1 gene:ENSG00000249948.6 gene_biotype:polymorphic_pseudogene transcript_biotype:protein_coding gene_symbol:GBA3 description:glucosylceramidase beta 3 (gene/pseudogene) [Source:HGNC Symbol;Acc:HGNC:19069]`

## Known Issues

### File naming
Since making decisions to name the files in this way we have developed our concept of genome IDs, moving from using a combination of species name and GCA to a UUID. The genome ID is defined as the combination of the genome and its associated annotation. For some species this will change with every release, but since the sequence of the genome itself will not change as frequently having a single, UUID based naming system for both of these types of files feels inappropriate. In the abscence of a decision on how to proceed in the future we have not changed this.

## Future Development

### FASTA headers
The content of the FASTA headers is returned by BLAST and these are therefore sources of information that could potentially be used to add value to the results in future developments of the BLAST interface, for example in adding information on the genomic location of transcripts.