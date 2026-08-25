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

import { resolveResultsPanels } from './resultsPanels';

import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';

const pinned: FormPanel[] = [
  {
    id: 'protein_and_functional',
    label: 'Protein & functional',
    options: [
      { id: 'protein', label: 'Protein ID', type: 'boolean', default: false }
    ]
  }
];

const live: FormPanel[] = [
  {
    id: 'protein_and_functional',
    label: 'Protein & functional',
    options: [
      { id: 'protein', label: 'Protein ID', type: 'boolean', default: false },
      // An option added to the config after the job was submitted.
      { id: 'mavedb', label: 'MaveDB', type: 'boolean', default: false }
    ]
  }
];

describe('resolveResultsPanels', () => {
  it('prefers the panels pinned to the job', () => {
    expect(
      resolveResultsPanels({ pinnedPanels: pinned, livePanels: live })
    ).toBe(pinned);
  });

  it('falls back to the live panels for a job submitted before pinning', () => {
    expect(resolveResultsPanels({ pinnedPanels: null, livePanels: live })).toBe(
      live
    );
    expect(
      resolveResultsPanels({ pinnedPanels: undefined, livePanels: live })
    ).toBe(live);
  });

  it('is undefined while neither is available', () => {
    expect(
      resolveResultsPanels({ pinnedPanels: null, livePanels: undefined })
    ).toBeUndefined();
  });

  it('does not merge the two — a pinned job never gains new options', () => {
    const resolved = resolveResultsPanels({
      pinnedPanels: pinned,
      livePanels: live
    });
    expect(resolved?.[0].options.map((option) => option.id)).toEqual([
      'protein'
    ]);
  });
});
