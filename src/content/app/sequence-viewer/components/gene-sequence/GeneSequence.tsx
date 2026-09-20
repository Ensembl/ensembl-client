/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { type DetailedHTMLProps, type HTMLAttributes } from 'react';

import useGeneSequence from './useGeneSequence';

import './gene-sequence';

import type { GeneSequence as GeneSequenceElement } from './gene-sequence';
import type { SequenceViewerGene } from 'src/content/app/sequence-viewer/state/api/queries/geneQuery';

// Example url:
// http://localhost:8080/sequence-viewer/GCA_000001405.29?focus=gene:ENSG00000139618

type Props = {
  genomeId: string;
  geneId: string;
};

const GeneSequence = (props: Props) => {
  const { genomeId, geneId } = props;
  const { data } = useGeneSequence({
    genomeId,
    geneId
  });

  if (!data) {
    return 'Loading...';
  }

  const { gene, sequence } = data;

  return (
    <div>
      Gene sequence
      <ens-sequence-viewer-gene-sequence gene={gene} sequence={sequence} />
    </div>
  );
};

type GeneSequenceElementProps = DetailedHTMLProps<
  HTMLAttributes<GeneSequenceElement>,
  GeneSequenceElement
> & {
  gene: SequenceViewerGene;
  sequence: string;
};

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-sequence-viewer-gene-sequence': GeneSequenceElementProps;
    }
  }
}

export default GeneSequence;
