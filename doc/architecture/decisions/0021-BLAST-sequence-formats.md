# 1. BLAST sequence formats

Date: 2022-10-17

## Status

Draft

## Context
This document summarises different sequence formats supported by Ensembl BLAST

## Supported formats
We support the most common sequence formats for any BLAST program - Fasta format or sequence as plain text

## Decision
Like other blast search providers we also support 2 ways of input - by pasting sequence in the input box or by uploading a file.

- Input sequence to be accepted in either Fasta format characters or as plain text format (bare sequences). (Sequence IDs may be supported in the future)
- Sequence should contain minimum 5 characters so that blast can process it properly.
- No more than 30 sequences can be submitted at a time to prevent overloading JDispatcher.
- Sequence to be split into 60-character-long lines (Ensembl standard)
- Will not implement example data for blast as we don't have it on the current site (and no complaints)


## Automatic formatting and validation

For all sequences inserted in the blast input field we do a set of automatic formatting and validation to capture any accidental errors and highlight them on screen.

### Formattings:
1. Transform all characters to upper-case letters if they aren’t upper-cased.
2. Remove all spaces (or tabs) between characters
3. Split the input into 60-character lines (Ensembl standard), except for the header line of FASTA-formatted sequences

## Validation
For sequence validation we follow NCBI rules (https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp)

### Sequence type detection 

Automatic detection of sequence type has been implemented which determines whether the input sequence is nucleotide or protein as soon as they are entered. Users can always override this selection and run a job. If the input sequence is detected as an amino acid sequence, we change the “Database” to Proteins and select “blastp” as the default Program

### Rules for sequence type detection:

1. Detection is only done on the sequence in the first input box for consistency
2. The type detection algorithm checks if there are protein-specific characters (check below) in the input sequence; and if not, whether unambiguous nucleotide codes make up more than 90% of the sequence
3. If the user deletes the first sequence such that the first input box now contains the sequence of a different type, we automatically change the sequence type based on the sequence in the first input box
4. If a user has chosen to override automatic detection by changing the sequence type manually, we do not attempt to make any detection about the sequence type. However, if the user presses the "Clear all" button or clears the only input box on the page, we reset the sequence type to default (i.e. nucleotide)

#### Nucleotide and Protein specific characters
  The nucleotide codes are:

    A --> adenine             M --> A C (amino)
    C --> cytosine            S --> G C (strong)
    G --> guanine             W --> A T (weak)
    T --> thymine             B --> G T C
    U --> uracil              D --> G A T
    R --> G A (purine)        H --> A C T
    Y --> T C (pyrimidine)    V --> G C A
    K --> G T (keto)          N --> A G C T (any)
                              -  gap of indeterminate length

  The amino acid codes allowed by BLASTP and TBLASTN programs are:

    A  alanine               P  proline
    B  aspartate/asparagine  Q  glutamine
    C  cystine               R  arginine
    D  aspartate             S  serine
    E  glutamate             T  threonine
    F  phenylalanine         U  selenocysteine
    G  glycine               V  valine
    H  histidine             W  tryptophan
    I  isoleucine            Y  tyrosine
    K  lysine                Z  glutamate/glutamine
    L  leucine               X  any
    M  methionine            *  translation stop
    N  asparagine            -  gap of indeterminate length

  (For more info please refer NCBI Blast docs: https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp)

## Known issues

There are currently any known issues with sequence formats.

## Future developments

Sequence IDs as input may be supported in the future.