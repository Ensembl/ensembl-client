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
  type DetailedHTMLProps,
  type HTMLAttributes
} from 'react';

import { SequenceViewerLegendContext } from 'src/content/app/sequence-viewer/contexts/SequenceViewerLegendContext';

import './sequence-element';

import type {
  Sequence as SequenceElement,
  LegendEventDetail
} from './sequence-element';

type Props = {
  sequence: string;
};

const Sequence = ({ sequence }: Props) => {
  const { setTemplate } = use(SequenceViewerLegendContext);
  const onLegend = useCallback(
    (event: CustomEvent<LegendEventDetail>) => {
      setTemplate(event.detail.template);
    },
    [setTemplate]
  );

  return (
    <ens-sequence-viewer-sequence
      onreport-legend={onLegend}
      sequence={sequence}
    />
  );
};

type SequenceElementProps = DetailedHTMLProps<
  HTMLAttributes<SequenceElement>,
  SequenceElement
> & {
  sequence: string;
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

export default Sequence;
