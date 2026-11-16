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
  useMemo,
  memo,
  type DetailedHTMLProps,
  type HTMLAttributes
} from 'react';

import { SequenceViewerLegendContext } from 'src/content/app/sequence-viewer/contexts/SequenceViewerLegendContext';

import './sequence-element/sequence-element';

import type {
  Sequence as SequenceElement,
  LegendEventDetail,
  VisibleRangeEventDetail
} from './sequence-element/sequence-element';
import type { SequenceContext } from './sequence-element/sequence-element';

import './Sequence.module.css';

type Props = {
  sequence: string;
} & SequenceContext;

const Sequence = ({ sequence, genomeId, ...otherProps }: Props) => {
  const { setTemplate } = use(SequenceViewerLegendContext);
  const onLegend = useCallback(
    (event: CustomEvent<LegendEventDetail>) => {
      setTemplate(event.detail.template);
    },
    [setTemplate]
  );

  const sequenceContext = useMemo<SequenceContext | undefined>(() => {
    if ('location' in otherProps) {
      return {
        genomeId,
        location: {
          regionName: otherProps.location.regionName,
          start: otherProps.location.start,
          end: otherProps.location.end
        }
      };
    }

    if ('gene' in otherProps) {
      return {
        genomeId,
        gene: { stableId: otherProps.gene.stableId }
      };
    }

    if ('transcript' in otherProps) {
      return {
        genomeId,
        transcript: { stableId: otherProps.transcript.stableId },
        sequenceView: otherProps.sequenceView
      };
    }
  }, [genomeId, otherProps]);

  return (
    <ens-sequence-viewer-sequence
      onreport-legend={onLegend}
      sequenceContext={sequenceContext}
      sequence={sequence}
    />
  );
};

type SequenceElementProps = DetailedHTMLProps<
  HTMLAttributes<SequenceElement>,
  SequenceElement
> & {
  sequence: string;
  sequenceContext: SequenceContext | undefined;
  'onreport-legend'?: (event: CustomEvent<LegendEventDetail>) => void;
  'onvisible-range-change'?: (
    event: CustomEvent<VisibleRangeEventDetail>
  ) => void;
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
