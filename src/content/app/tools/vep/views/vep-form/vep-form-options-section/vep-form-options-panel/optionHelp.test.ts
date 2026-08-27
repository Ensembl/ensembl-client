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

/**
 * Help arrives on the option from the tools API, so these fixtures are written
 * out. What is tested here is what the frontend decides: resolving `{version}`
 * and a link's `majorVersion` against the label this genome renders.
 *
 * The wording, and which options carry help at all, belong to the spec and are
 * asserted there (tests/test_option_help.py).
 */
const option = (
  label: string,
  help?: FormPanelOption['help']
): FormPanelOption => ({
  id: 'an_option',
  label,
  type: 'boolean',
  default: false,
  help
});

const GNOMAD_SV_LINKS = [
  { href: 'https://gnomad.broadinstitute.org/news/v4-sv/', majorVersion: '4' },
  { href: 'https://europepmc.org/article/MED/32461652', majorVersion: '2' }
];

describe('getOptionHelp', () => {
  it('is undefined when the API sends no help', () => {
    expect(getOptionHelp(option('Some option'))).toBe(undefined);
  });

  it('passes a description with no placeholder through untouched', () => {
    const help = getOptionHelp(
      option('NIH All of Us', { description: 'Frequencies from All of Us.' })
    );
    expect(help?.description).toBe('Frequencies from All of Us.');
  });

  describe('version from the option label', () => {
    const versioned = { description: 'Frequencies from gnomAD{version}.' };

    it('takes the version the label carries', () => {
      expect(
        getOptionHelp(option('gnomAD Exomes v4.1.1', versioned))?.description
      ).toBe('Frequencies from gnomAD v4.1.1.');
    });

    it('takes a different one from the other assembly, same sentence', () => {
      const help = getOptionHelp(option('gnomAD Exomes v2.1.1', versioned));
      expect(help?.description).toBe('Frequencies from gnomAD v2.1.1.');
      expect(help?.description).not.toContain('4.1.1');
    });

    it('handles a two-part version', () => {
      expect(
        getOptionHelp(option('gnomAD Genomes v2.1', versioned))?.description
      ).toBe('Frequencies from gnomAD v2.1.');
    });

    it('leaves no gap when the label carries no version', () => {
      const help = getOptionHelp(option('gnomAD Genomes', versioned));
      expect(help?.description).toBe('Frequencies from gnomAD.');
      expect(help?.description).not.toContain(' .');
    });

    it('never leaves the placeholder in rendered text', () => {
      for (const label of ['gnomAD Exomes v4.1.1', 'gnomAD Exomes', 'x']) {
        expect(
          getOptionHelp(option(label, versioned))?.description
        ).not.toContain('{version}');
      }
    });
  });

  describe('version-specific links', () => {
    // gnomAD SV is v4.1 on GRCh38 and v2.1 on GRCh37, and the v4 release
    // announcement does not describe the v2 callset. Each assembly must cite
    // its own reference.
    const svHelp = {
      description: 'Structural variants from gnomAD{version}.',
      links: GNOMAD_SV_LINKS
    };

    it('gives v4.1 only the v4 announcement', () => {
      const links = getOptionHelp(option('gnomAD SV v4.1', svHelp))?.links;
      expect(links).toEqual([GNOMAD_SV_LINKS[0]]);
    });

    it('gives v2.1 only the v2 paper', () => {
      const links = getOptionHelp(option('gnomAD SV v2.1', svHelp))?.links;
      expect(links).toEqual([GNOMAD_SV_LINKS[1]]);
    });

    it('matches on the major version, so a point release keeps its link', () => {
      const links = getOptionHelp(option('gnomAD SV v4.2.1', svHelp))?.links;
      expect(links).toEqual([GNOMAD_SV_LINKS[0]]);
    });

    it('drops version-specific links rather than guess when there is no version', () => {
      // Citing the wrong release is worse than citing none.
      expect(getOptionHelp(option('gnomAD SV', svHelp))?.links).toEqual([]);
    });

    it('always keeps a link that is not version-specific', () => {
      const link = { href: 'https://gnomad.broadinstitute.org/' };
      const links = getOptionHelp(
        option('gnomAD Exomes v2.1.1', {
          description: 'Frequencies from gnomAD{version}.',
          links: [link]
        })
      )?.links;
      expect(links).toEqual([link]);
    });
  });
});
