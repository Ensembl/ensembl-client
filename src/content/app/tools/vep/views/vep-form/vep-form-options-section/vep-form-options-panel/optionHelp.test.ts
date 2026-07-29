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

import { getOptionHelp } from './optionHelp';
import type { FormPanelOption } from 'src/content/app/tools/vep/types/vepFormConfig';

const option = (
  id: string,
  label: string,
  help?: FormPanelOption['help']
): FormPanelOption => ({ id, label, type: 'boolean', default: false, help });

describe('getOptionHelp', () => {
  describe('version from the option label', () => {
    // The whole point: one option id, two assemblies, two versions. A version
    // written into the help map itself would be wrong for one of them.
    it('takes gnomAD exomes v4.1.1 from the GRCh38 label', () => {
      const help = getOptionHelp(
        option('gnomad_exomes', 'gnomAD Exomes v4.1.1')
      );
      expect(help?.description).toContain('(gnomAD) v4.1.1.');
    });

    it('takes gnomAD exomes v2.1.1 from the GRCh37 label', () => {
      const help = getOptionHelp(
        option('gnomad_exomes', 'gnomAD Exomes v2.1.1')
      );
      expect(help?.description).toContain('(gnomAD) v2.1.1.');
      expect(help?.description).not.toContain('4.1.1');
    });

    it('handles the two-part genomes version on GRCh37', () => {
      const help = getOptionHelp(
        option('gnomad_genomes', 'gnomAD Genomes v2.1')
      );
      expect(help?.description).toContain('(gnomAD) v2.1.');
    });

    it('leaves no gap when the label carries no version', () => {
      const help = getOptionHelp(option('gnomad_genomes', 'gnomAD Genomes'));
      expect(help?.description).toContain('(gnomAD).');
      expect(help?.description).not.toContain('{version}');
      expect(help?.description).not.toContain(' .');
    });

    it('never leaves the placeholder in rendered text', () => {
      for (const label of ['gnomAD Exomes v4.1.1', 'gnomAD Exomes', 'x']) {
        expect(
          getOptionHelp(option('gnomad_exomes', label))?.description
        ).not.toContain('{version}');
      }
    });
  });

  it('leaves a description without the placeholder untouched', () => {
    const help = getOptionHelp(option('allofus', 'NIH All of Us'));
    expect(help?.description).toContain('NIH All of Us Research Program');
    expect(help?.description).not.toContain('{version}');
  });

  it('notes the source naming on every allele-frequency option', () => {
    const ids: [string, string][] = [
      ['gnomad_exomes', 'gnomAD Exomes v4.1.1'],
      ['gnomad_genomes', 'gnomAD Genomes v4.1.1'],
      ['allofus', 'NIH All of Us']
    ];
    for (const [id, label] of ids) {
      expect(getOptionHelp(option(id, label))?.description).toContain(
        'Populations are named as at source.'
      );
    }
  });

  describe('API-supplied help', () => {
    it('wins over the local map', () => {
      const help = getOptionHelp(
        option('gnomad_exomes', 'gnomAD Exomes v4.1.1', {
          description: 'From the API.'
        })
      );
      expect(help?.description).toBe('From the API.');
    });

    it('gets the same placeholder treatment', () => {
      const help = getOptionHelp(
        option('anything', 'Some source v9.9', {
          description: 'Frequencies from Somewhere{version}.'
        })
      );
      expect(help?.description).toBe('Frequencies from Somewhere v9.9.');
    });
  });

  it('is undefined for an option with no help anywhere', () => {
    expect(
      getOptionHelp(option('gnomad_sv', 'gnomAD SV v4.1'))
    ).toBeUndefined();
  });
});
