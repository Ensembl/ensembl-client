import type { SequenceViewerGene } from 'src/content/app/sequence-viewer/state/api/queries/geneQuery';

// either extract it into a const (see also the components that use it)
// or pass it as a parameter
const LINE_LENGTH = 60;

// Given a gene, generate a lookup of all its features (transcripts, exons, introns,
// intervals of coding exon sequence, intervals of non-coding exon sequence, intervals of UTRs)
// that can be subsequently used for annotating gene sequence
export const generateFeatureLookup = (gene: SequenceViewerGene) => {
  
};

export const getSequenceIntervals = (gene: SequenceViewerGene) => {

};