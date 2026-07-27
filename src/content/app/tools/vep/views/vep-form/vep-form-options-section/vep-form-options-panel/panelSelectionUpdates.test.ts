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
  panelSelectionUpdates,
  isPanelFullySelected,
  allPanelsSelectionUpdates,
  areAllPanelsFullySelected,
  subOptionToggleUpdates,
  optionToggleUpdates
} from './panelSelectionUpdates';
import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';

const option = (id: string): FormPanel['options'][number] => ({
  id,
  label: id,
  type: 'boolean',
  default: false
});

const panel = (...ids: string[]): FormPanel => ({
  id: 'panel',
  label: 'Panel',
  options: ids.map(option)
});

describe('panelSelectionUpdates', () => {
  it('switches every top-level option on', () => {
    expect(
      panelSelectionUpdates(panel('revel', 'cadd', 'spliceai'), true)
    ).toEqual({ revel: true, cadd: true, spliceai: true });
  });

  it('switches every top-level option off', () => {
    expect(panelSelectionUpdates(panel('revel', 'cadd'), false)).toEqual({
      revel: false,
      cadd: false
    });
  });

  it('leaves the hidden hgvsg param alone', () => {
    // The HGVS control drives only `hgvs` (HGVSc/HGVSp) while HGVSg is hidden
    // pending chromosome synonyms — "Select all" must not switch it on, since
    // it is computed only where something needs it (ProtVar's `forces_on`).
    expect(panelSelectionUpdates(panel('spdi', 'hgvs'), true)).toEqual({
      spdi: true,
      hgvs: true
    });
  });

  it('leaves sub-options out (they take their defaults)', () => {
    // gnomAD exomes carries a sub-option matrix; only the parent is written.
    expect(panelSelectionUpdates(panel('gnomad_exomes'), true)).toEqual({
      gnomad_exomes: true
    });
  });
});

describe('isPanelFullySelected', () => {
  it('is true only when every top-level option is on', () => {
    const p = panel('revel', 'cadd');
    expect(isPanelFullySelected(p, { revel: true, cadd: true })).toBe(true);
    expect(isPanelFullySelected(p, { revel: true })).toBe(false);
    expect(isPanelFullySelected(p, {})).toBe(false);
  });

  it('needs only the hgvs param on (hgvsg is hidden)', () => {
    const p = panel('hgvs');
    expect(isPanelFullySelected(p, { hgvs: true })).toBe(true);
    expect(isPanelFullySelected(p, {})).toBe(false);
  });

  it('is false for an empty panel (nothing to toggle off)', () => {
    expect(isPanelFullySelected(panel(), {})).toBe(false);
  });
});

describe('allPanelsSelectionUpdates', () => {
  const panels = [
    { ...panel('a', 'b'), id: 'one' },
    { ...panel('c'), id: 'two' }
  ];

  it('switches every option across every panel on', () => {
    expect(allPanelsSelectionUpdates(panels, true)).toEqual({
      a: true,
      b: true,
      c: true
    });
  });

  it('switches them all back off', () => {
    expect(allPanelsSelectionUpdates(panels, false)).toEqual({
      a: false,
      b: false,
      c: false
    });
  });

  it('writes no sub-option params, so each option runs at its defaults', () => {
    // "Enable all *default* options": no top-level option is on by default, so
    // what makes it the default configuration is leaving sub-options absent.
    const withSubOptions: FormPanel[] = [
      {
        ...panel('clinvar'),
        options: [
          {
            ...option('clinvar'),
            sub_options: [
              {
                id: 'clinvar_short',
                label: 'Short variants',
                type: 'boolean',
                default: true
              }
            ]
          }
        ]
      }
    ];
    expect(allPanelsSelectionUpdates(withSubOptions, true)).toEqual({
      clinvar: true
    });
  });
});

describe('areAllPanelsFullySelected', () => {
  const panels = [
    { ...panel('a', 'b'), id: 'one' },
    { ...panel('c'), id: 'two' }
  ];

  it('is true only when every option in every panel is on', () => {
    expect(
      areAllPanelsFullySelected(panels, { a: true, b: true, c: true })
    ).toBe(true);
    // one option unticked by hand in the second panel
    expect(areAllPanelsFullySelected(panels, { a: true, b: true })).toBe(false);
  });

  it('is false when there are no panels', () => {
    expect(areAllPanelsFullySelected([], {})).toBe(false);
  });
});

describe('an option that cannot run with no sub-option (mutfunc)', () => {
  const mutfunc = (): FormPanel['options'][number] => ({
    ...option('mutfunc'),
    requires_any_sub_option: true,
    sub_options: [
      { id: 'motif', label: 'motif', type: 'boolean', default: true },
      { id: 'int', label: 'int', type: 'boolean', default: true }
    ]
  });

  it('unticking the last sub-option switches the option itself off', () => {
    // motif already off, now the user unticks int: nothing would be left, and a
    // flagless mutfunc line means *all*, so the option has to go off with it.
    expect(
      subOptionToggleUpdates(mutfunc(), 'int', false, { motif: false })
    ).toEqual({ int: false, mutfunc: false });
  });

  it('leaves the option on while another sub-option remains', () => {
    expect(
      subOptionToggleUpdates(mutfunc(), 'int', false, { motif: true })
    ).toEqual({ int: false });
  });

  it('counts an untouched sub-option by its default, not as absent', () => {
    // motif has never been clicked, so it is not in the parameters — but it is
    // on, and the checkbox shows it on. Treating absent as off here would
    // switch mutfunc off with a sub-option still ticked.
    expect(subOptionToggleUpdates(mutfunc(), 'int', false, {})).toEqual({
      int: false
    });
  });

  it('never switches the option off when ticking one on', () => {
    expect(
      subOptionToggleUpdates(mutfunc(), 'int', true, { motif: false })
    ).toEqual({ int: true });
  });

  it('switching the option on restores every sub-option', () => {
    // Otherwise re-enabling one whose sub-options were all unticked lands
    // straight back in the state that cannot be submitted.
    expect(optionToggleUpdates(mutfunc(), true)).toEqual({
      mutfunc: true,
      motif: true,
      int: true
    });
  });

  it('switching it off touches only the option', () => {
    expect(optionToggleUpdates(mutfunc(), false)).toEqual({ mutfunc: false });
  });

  it('leaves an ordinary option alone', () => {
    const plain = {
      ...option('intact'),
      sub_options: [
        { id: 'pmid', label: 'pmid', type: 'boolean' as const, default: false }
      ]
    };
    expect(subOptionToggleUpdates(plain, 'pmid', false, {})).toEqual({
      pmid: false
    });
    expect(optionToggleUpdates(plain, true)).toEqual({ intact: true });
  });
});
