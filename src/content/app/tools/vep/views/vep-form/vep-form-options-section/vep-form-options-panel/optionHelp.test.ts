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
    // All five options of the Allele frequencies panel — the short-variant
    // sources and both structural-variant ones.
    const ids: [string, string][] = [
      ['gnomad_exomes', 'gnomAD Exomes v4.1.1'],
      ['gnomad_genomes', 'gnomAD Genomes v4.1.1'],
      ['allofus', 'NIH All of Us'],
      ['gnomad_sv', 'gnomAD SV v4.1'],
      ['gnomad_cnv', 'gnomAD CNV v4.1']
    ];
    for (const [id, label] of ids) {
      expect(getOptionHelp(option(id, label))?.description).toContain(
        'Populations are named as at source.'
      );
    }
  });

  describe('structural-variant sources', () => {
    it('describes gnomAD SV as allele frequencies, versioned from the label', () => {
      const help = getOptionHelp(option('gnomad_sv', 'gnomAD SV v4.1'));
      expect(help?.description).toContain(
        'Allele frequencies for structural variants'
      );
      expect(help?.description).toContain('(gnomAD) v4.1.');
      expect(help?.links?.[0].href).toContain('v4-structural-variants');
    });

    it('describes gnomAD CNV as sample frequencies', () => {
      const help = getOptionHelp(option('gnomad_cnv', 'gnomAD CNV v4.1'));
      // gnomAD reports CNVs as the fraction of samples carrying the call, not
      // as an allele count — the wording is deliberate, not a slip.
      expect(help?.description).toContain(
        'Sample frequencies for copy number variants'
      );
      expect(help?.description).not.toContain('Allele frequencies');
      expect(help?.links?.[0].href).toContain('v4-copy-number-variants');
    });

    it('carries the GRCh37 version on gnomAD SV v2.1', () => {
      const help = getOptionHelp(option('gnomad_sv', 'gnomAD SV v2.1'));
      expect(help?.description).toContain('(gnomAD) v2.1.');
      expect(help?.description).not.toContain('4.1');
    });
  });

  describe('version-specific links', () => {
    // gnomAD SV is v4.1 on GRCh38 and v2.1 on GRCh37, and the v4 release
    // announcement does not describe the v2 callset. Each assembly must cite
    // its own reference.
    it('gives gnomAD SV v4.1 only the v4 announcement', () => {
      const links = getOptionHelp(option('gnomad_sv', 'gnomAD SV v4.1'))?.links;
      expect(links).toHaveLength(1);
      expect(links?.[0].href).toContain('v4-structural-variants');
    });

    it('gives gnomAD SV v2.1 only the v2 paper', () => {
      const links = getOptionHelp(option('gnomad_sv', 'gnomAD SV v2.1'))?.links;
      expect(links).toHaveLength(1);
      expect(links?.[0].href).toBe(
        'https://europepmc.org/article/MED/32461652'
      );
    });

    it('matches on the major version, so a point release keeps its link', () => {
      const links = getOptionHelp(
        option('gnomad_sv', 'gnomAD SV v4.2.1')
      )?.links;
      expect(links).toHaveLength(1);
      expect(links?.[0].href).toContain('v4-structural-variants');
    });

    it('drops version-specific links rather than guess when there is no version', () => {
      // Citing the wrong release is worse than citing none.
      const links = getOptionHelp(option('gnomad_sv', 'gnomAD SV'))?.links;
      expect(links).toEqual([]);
    });

    it('always keeps links that are not version-specific', () => {
      const links = getOptionHelp(
        option('gnomad_exomes', 'gnomAD Exomes v2.1.1')
      )?.links;
      expect(links).toHaveLength(1);
      expect(links?.[0].href).toBe('https://gnomad.broadinstitute.org/');
    });
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
    // A fictional id on purpose: naming a real option here makes the test fail
    // the day that option is given help, which is not a regression.
    expect(getOptionHelp(option('no_such_option', 'No such option'))).toBe(
      undefined
    );
  });
});
