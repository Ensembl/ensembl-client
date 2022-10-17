# 1. BLAST sequence formats

Date: 2022-10-17

## Status

Draft

## Context
This document summarises different sequence formats supported by Ensembl BLAST

## Supported formats
We support the most common sequence formats for any BLAST program - Fasta format or sequence as plain text

## Decisions
We support 2 ways of input - by pasting sequence in the input box or by uploading a file.

- Input sequence to be accepted in either Fasta format characters or as plain text format (bare sequences). (Sequence IDs may be supported in the future)
- Sequence should contain at least 5 characters
- No more than 30 sequences can be submitted at a time.
- Sequence to be split into 60-character-long lines (Ensembl standard)
- For the input box header, the number next to the word Sequence is dynamic, represents the order of the box in the list of sequence boxes (so that if we have Sequence 1, Sequence 2, and Sequence 3 and delete the Sequence 2 box, Sequence 3 is renamed to Sequence 2)
- Will not implement example data for blast as we don't have it on the current site (and no complaints)


## Automatic validation

For all sequences inserted in the blast input field we do a set of automatic validation as below
1. Transform all characters to upper-case letters if they aren’t upper-cased.
2. Remove all spaces (or tabs) between characters
3. Split the input into 60-character lines (Ensembl standard), except for the header line of FASTA-formatted sequences
For sequence validation we follow NCBI rules (https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp)

## Sequence type detection 

Automatic detection of sequence type has been implemented which determines whether the input sequence is nucleotide or protein as soon as they are entered. Users can always override this selection and run a job. If the input sequence is detected as an amino acid sequence, we change the “Database” to Proteins and select “blastp” as the default Program

### Rules for sequence type detection:

1. Detection is only done on the sequence in the first input box for consistency
2. The type detection algorithm checks if there are protein-specific characters in the input sequence; and if not, whether unambiguous nucleotide codes make up more than 90% of the sequence
3. If the user deletes the first sequence such that the first input box now contains the sequence of a different type, we automatically change the sequence type based on the sequence in the first input box
4. If a user has chosen to override automatic detection by changing the sequence type manually, we do not attempt to make any detection about the sequence type. However, if the user presses the "Clear all" button or clears the only input box on the page, we reset the sequence type to default (i.e. nucleotide)

