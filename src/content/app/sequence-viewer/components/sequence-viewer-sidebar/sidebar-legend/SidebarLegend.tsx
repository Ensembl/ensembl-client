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

import { use, type DetailedHTMLProps, HTMLAttributes } from 'react';

import { SequenceViewerLegendContext } from 'src/content/app/sequence-viewer/contexts/SequenceViewerLegendContext';

import './sequence-legend';

import type { SequenceLegend as SequenceLegendElement } from './sequence-legend';

const SidebarLegend = () => {
  const { template } = use(SequenceViewerLegendContext);

  return (
    <div>
      <ens-sequence-viewer-legend template={template} />
    </div>
  );
};

type SequenceLegendElementProps = DetailedHTMLProps<
  HTMLAttributes<SequenceLegendElement>,
  SequenceLegendElement
> & {
  template: string | null;
};

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-sequence-viewer-legend': SequenceLegendElementProps;
    }
  }
}

export default SidebarLegend;
