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

import noop from 'lodash/noop';

import { useAppSelector } from 'src/store';

import { buildFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';

import useDrawerSequenceSettings from './useDrawerSequenceSettings';
import { useRefgetSequenceQuery } from 'src/shared/state/api-slices/refgetSlice';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import DrawerSequenceView from 'src/content/app/genome-browser/components/drawer/components/sequence-view/DrawerSequenceView';

import type { GeneSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/geneSummaryQuery';

type Gene = Pick<GeneSummaryQueryResult['gene'], 'stable_id' | 'slice'>;

type Props = {
  gene: Gene;
};

export const GeneSequenceView = (props: Props) => {
  const { gene } = props;

  const genomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const geneId = buildGeneId(genomeId, gene.stable_id);

  const {
    isExpanded,
    toggleSequenceVisibility,
    isReverseComplement,
    toggleReverseComplement
  } = useDrawerSequenceSettings({ genomeId, featureId: geneId });

  const {
    region: {
      sequence: { checksum }
    },
    location: { start, end },
    strand: { code: strand }
  } = gene.slice;

  const {
    currentData: sequence,
    isError,
    isFetching,
    refetch
  } = useRefgetSequenceQuery(
    {
      checksum,
      start,
      end,
      strand
    },
    { skip: !isExpanded }
  );

  return (
    <DrawerSequenceView
      genomeId={genomeId}
      featureId={gene.stable_id}
      isExpanded={isExpanded}
      isError={isError}
      isLoading={isFetching}
      refetch={refetch}
      toggleSequenceVisibility={toggleSequenceVisibility}
      sequence={sequence}
      sequenceTypes={['genomic']}
      selectedSequenceType="genomic"
      isReverseComplement={isReverseComplement}
      onSequenceTypeChange={noop}
      onReverseComplementChange={toggleReverseComplement}
    />
  );
};

const buildGeneId = (genomeId: string, geneStableId: string) =>
  buildFocusObjectId({
    genomeId,
    type: 'gene',
    objectId: geneStableId
  });

export default GeneSequenceView;
