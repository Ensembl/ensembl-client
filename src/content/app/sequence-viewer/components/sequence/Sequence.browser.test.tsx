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

import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { MemoryRouter, useLocation } from 'react-router';

import { SequenceViewerJumpContextProvider } from 'src/content/app/sequence-viewer/contexts/SequenceJumpContext';

import Sequence from './Sequence';

const CurrentLocation = () => {
  const { pathname, search } = useLocation();
  return <output data-testid="current-location">{pathname + search}</output>;
};

describe('Sequence navigation', () => {
  it('opens the selected genomic range as the Genome Browser focus', async () => {
    const sequence = `
      <template id="styles"><style></style></template>
      <template id="sequence" data-region-name="13">
        <div class="line" data-start="32272832" data-end="32272829">
          <span class="line-middle"><span>AC</span><span>GT</span></span>
        </div>
      </template>
    `;
    const screen = await render(
      <MemoryRouter initialEntries={['/sequence-viewer']}>
        <SequenceViewerJumpContextProvider>
          <Sequence
            genomeId="genome-id"
            gene={{ stableId: 'gene-id' }}
            sequence={sequence}
          />
        </SequenceViewerJumpContextProvider>
        <CurrentLocation />
      </MemoryRouter>
    );
    const element = document.querySelector('ens-sequence-viewer-sequence')!;
    const root = element.shadowRoot!;
    const column = root.querySelector('.line-middle')!;
    const selection = (
      root as ShadowRoot & { getSelection: () => Selection }
    ).getSelection();
    try {
      selection.setBaseAndExtent(
        column.lastElementChild!.firstChild!,
        2,
        column.firstElementChild!.firstChild!,
        1
      );
      column.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Shift', bubbles: true })
      );
      const button =
        root.querySelectorAll<HTMLButtonElement>('[popover] button')[1];
      await userEvent.click(button);
      await expect
        .element(screen.getByTestId('current-location'))
        .toHaveTextContent(
          '/genome-browser/genome-id?focus=location:13:32272829-32272831&location=13:32272829-32272831'
        );
    } finally {
      selection.removeAllRanges();
    }
  });
});
