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

import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type CSSProperties
} from 'react';

import { useAppSelector } from 'src/store';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import useGeneSequence from './useGeneSequence';

import './gene-sequence';

import type { GeneSequence as GeneSequenceElement } from './gene-sequence';

import commonStyles from '../../styles/sequence-viewer-common-styles.module.css';

// Example url:
// http://localhost:8080/sequence-viewer/GCA_000001405.29?focus=gene:ENSG00000139618

type Props = {
  genomeId: string;
  geneId: string;
};

const GeneSequence = (props: Props) => {
  const { genomeId, geneId } = props;
  const sequenceSettings = useAppSelector((state) =>
    getSequenceSettings(state, genomeId ?? '')
  );

  const { data } = useGeneSequence({
    genomeId,
    geneId,
    settings: sequenceSettings
  });

  if (!data) {
    return 'Loading...';
  }

  const { annotatedSequence, gene } = data;
  const geneEnd = gene.slice.location.end;
  const formattedGeneEndString = formatNumber(geneEnd);
  const formattedGeneEndStringEnd = formattedGeneEndString.length;

  const styles: CSSProperties & { '--gutter-width': string } = {
    '--gutter-width': `${formattedGeneEndStringEnd}ch`
  };

  const geneSymbol = gene.symbol;
  const geneNameAndId = geneSymbol ? `${geneSymbol}  ${geneId}` : geneId;

  return (
    <div className={commonStyles.main} style={styles}>
      Gene: {geneNameAndId}
      <ens-sequence-viewer-gene-sequence sequence={annotatedSequence} />
    </div>
  );
};

type GeneSequenceElementProps = DetailedHTMLProps<
  HTMLAttributes<GeneSequenceElement>,
  GeneSequenceElement
> & {
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
