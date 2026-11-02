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
  use,
  useCallback,
  memo,
  type DetailedHTMLProps,
  type HTMLAttributes
} from 'react';

import { SequenceViewerLegendContext } from 'src/content/app/sequence-viewer/contexts/SequenceViewerLegendContext';

import './sequence-element';

import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';
import type {
  Sequence as SequenceElement,
  LegendEventDetail
} from './sequence-element';
import type { OverlapRequestParamsWithoutLocation } from './overlapRequest';

type FocusLocationProps = {
  location: GenomicLocation;
};
type FocusGeneProps = {
  gene: {
    stableId: string;
  };
};
type FocusTranscriptProps = {
  transcript: {
    stableId: string;
  };
  sequenceView: string;
};
type FocusObjectProps =
  FocusLocationProps | FocusGeneProps | FocusTranscriptProps;

type Props = {
  genomeId: string;
  sequence: string;
} & FocusObjectProps;

const Sequence = ({ sequence, genomeId, ...otherProps }: Props) => {
  const { setTemplate } = use(SequenceViewerLegendContext);
  const onLegend = useCallback(
    (event: CustomEvent<LegendEventDetail>) => {
      setTemplate(event.detail.template);
    },
    [setTemplate]
  );
  const getOverlapRequestParams = useCallback(():
    OverlapRequestParamsWithoutLocation | undefined => {
    if ('location' in otherProps) {
      return {
        genome_uuid: genomeId,
        focus_location: {
          region_name: otherProps.location.regionName,
          start: otherProps.location.start,
          end: otherProps.location.end
        }
      };
    } else if ('gene' in otherProps) {
      return {
        genome_uuid: genomeId,
        focus_gene: { stable_id: otherProps.gene.stableId }
      };
    } else if ('transcript' in otherProps) {
      return {
        genome_uuid: genomeId,
        focus_transcript: { stable_id: otherProps.transcript.stableId },
        sequence_type: otherProps.sequenceView
      };
    }
  }, [genomeId, otherProps]);

  return (
    <ens-sequence-viewer-sequence
      onreport-legend={onLegend}
      getOverlapRequestParams={getOverlapRequestParams}
      sequence={sequence}
    />
  );
};

type SequenceElementProps = DetailedHTMLProps<
  HTMLAttributes<SequenceElement>,
  SequenceElement
> & {
  sequence: string;
  getOverlapRequestParams: () =>
    OverlapRequestParamsWithoutLocation | undefined;
  'onreport-legend'?: (event: CustomEvent<LegendEventDetail>) => void;
};

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-sequence-viewer-sequence': SequenceElementProps;
    }
  }
}

export default memo(Sequence);
