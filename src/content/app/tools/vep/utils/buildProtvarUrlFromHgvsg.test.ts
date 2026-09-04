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

import { buildProtvarUrlFromHgvsg } from './buildProtvarUrlFromHgvsg';

describe('buildProtvarUrlFromHgvsg', () => {
  it('builds the ProtVar link from an HGVSg substitution', () => {
    expect(buildProtvarUrlFromHgvsg('11:g.19237425T>G')).toBe(
      'https://www.ebi.ac.uk/ProtVar/g/11/19237425/T/G?annotation=fun'
    );
  });

  it('uses HGVSg verbatim — no minimisation needed', () => {
    // VEP has already reduced 11:19237424 TT>TG to its minimal form.
    expect(buildProtvarUrlFromHgvsg('1:g.11022G>T')).toBe(
      'https://www.ebi.ac.uk/ProtVar/g/1/11022/G/T?annotation=fun'
    );
  });

  it('handles non-numeric region names', () => {
    expect(buildProtvarUrlFromHgvsg('X:g.100T>C')).toBe(
      'https://www.ebi.ac.uk/ProtVar/g/X/100/T/C?annotation=fun'
    );
  });

  it('returns undefined when HGVSg is absent', () => {
    expect(buildProtvarUrlFromHgvsg(undefined)).toBeUndefined();
    expect(buildProtvarUrlFromHgvsg(null)).toBeUndefined();
    expect(buildProtvarUrlFromHgvsg('')).toBeUndefined();
  });

  it('returns undefined for non-substitution HGVSg (indels have no ProtVar link)', () => {
    expect(buildProtvarUrlFromHgvsg('1:g.11022del')).toBeUndefined();
    expect(buildProtvarUrlFromHgvsg('1:g.11022_11023insA')).toBeUndefined();
    expect(buildProtvarUrlFromHgvsg('1:g.11022_11025delinsAC')).toBeUndefined();
    expect(buildProtvarUrlFromHgvsg('1:g.11022dup')).toBeUndefined();
  });
});
