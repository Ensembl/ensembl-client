# 4. BLAST sequence formats

Date: 2022-10-17

## Status

Draft

## Context
This document summarises different sequence formats supported by Ensembl BLAST

## Supported formats
We support the most common sequence formats for any BLAST program - FASTA format or sequence as plain text

## Decision
Like other BLAST search providers we also support 2 ways of input - by pasting sequence in the input box or by uploading a file.

- Input sequence to be accepted in either FASTA format characters or as plain text format (bare sequences). (Sequence IDs may be supported in the future)
- Sequence should contain minimum 5 characters so that BLAST can process it properly.
- No more than 50 sequences can be submitted at a time to help prevent overloading JDispatcher. Note however that by selecting multiple species, many more than 50 JDispatcher jobs can be created in a single submission.
- Sequence to be split into 60-character-long lines (Ensembl standard)
- Will not implement example data for BLAST as we don't have it on the current site and have not had requests for it

## Automatic formatting and validation

For all sequences inserted in the BLAST input field we do a set of automatic formatting and validation to capture any accidental errors and highlight them on screen.

### Formatting:
1. Transform all characters to upper-case letters if they aren’t upper-cased.
2. Remove all spaces (or tabs) between characters
3. Split the input into 60-character lines (Ensembl standard), except for the header line of FASTA-formatted sequences

| Input type  | Transformations | Support |
| ------------- | ------------- | ------- |
| Bare sequence  | None  | Yes |
| Bare sequence with numbered lines | Accept that a line starting with a digit is valid, and automatically delete the digits. In contrast, treating any digit in the middle of a line is invalid input. | Yes |
| Bare sequence with empty lines | According to NCBI, blank lines are not allowed in the middle of a bare sequence input. However, we can show leniency and treat empty lines as sequence separators (and split the input into multiple sequences) | Yes |
| FASTA sequence | Interpret the header line as a separator, and split into multiple sequences if input contains multiple header lines | Yes |
| FASTA sequence with blank lines | Blank lines are not allowed in the middle of a FASTA input. However, we can show leniency and interpret blank lines as sequence separators. | Yes |
| A combination of bare sequences and FASTA sequences in one input. | An unlikely scenario, but, technically, can rely on both blank lines and FASTA headers as sequence separators. | Yes |
| Sequence id | Fetch sequence by its id and insert in the input field | No |

## Validation

### Sequence type detection 

Automatic detection of sequence type has been implemented which determines whether the input sequence is nucleotide or protein as soon as they are entered. Users can always override this selection and run a job. If the input sequence is detected as an amino acid sequence, we change the “Database” to Proteins and select “BLASTP” as the default Program

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

  (For more info please refer NCBI BLAST docs: https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp)

## Known issues

There are currently any known issues with sequence formats.

## Future developments

Sequence IDs as input may be supported in the future.