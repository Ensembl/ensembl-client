import { Strand } from 'src/content/app/entity-viewer/types/strand';

export function getStrandDisplayName(strandCode: Strand) {
  if (strandCode === Strand.FORWARD) {
    return 'forward strand';
  } else {
    return 'reverse strand';
  }
}
