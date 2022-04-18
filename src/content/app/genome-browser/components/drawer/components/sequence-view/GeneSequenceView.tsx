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

import React from 'react';
import noop from 'lodash/noop';

import { useRefgetSequenceQuery } from 'src/shared/state/api-slices/refgetSlice';

import DrawerSequenceView from 'src/content/app/genome-browser/components/drawer/components/sequence-view/DrawerSequenceView';

import type { GeneSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/geneSummaryQuery';

type Gene = Pick<GeneSummaryQueryResult['gene'], 'stable_id' | 'slice'>;

type Props = {
  gene: Gene;
};

export const GeneSequenceView = (props: Props) => {
  const { gene } = props;
  const {
    region: {
      sequence: { checksum }
    },
    location: { start, end },
    strand: { code: strand }
  } = gene.slice;

  const { data: sequence } = useRefgetSequenceQuery({
    checksum,
    start,
    end,
    strand
  });

  return sequence ? (
    <DrawerSequenceView
      sequence={sequence}
      sequenceTypes={['genomic']}
      selectedSequenceType="genomic"
      isReverseComplement={false}
      onSequenceTypeChange={noop}
      onReverseComplementChange={noop}
    />
  ) : null;
};

export default GeneSequenceView;
