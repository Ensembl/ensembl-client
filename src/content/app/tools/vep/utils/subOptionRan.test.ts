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

import { subOptionRan } from './subOptionRan';

describe('subOptionRan', () => {
  it('falls back to the default when the parameter is absent', () => {
    // default-on sub-option (e.g. ProtVar stability) counts as run
    expect(subOptionRan({}, 'protvar_stability', true)).toBe(true);
    // default-off sub-option (e.g. mutfunc motif) does not
    expect(subOptionRan({}, 'mutfunc_motif', false)).toBe(false);
  });

  it('treats undefined parameters as all-absent', () => {
    expect(subOptionRan(undefined, 'anything', true)).toBe(true);
    expect(subOptionRan(undefined, 'anything', false)).toBe(false);
  });

  it('lets an explicit parameter value override the default', () => {
    // user turned a default-off sub-option on
    expect(subOptionRan({ mutfunc_motif: true }, 'mutfunc_motif', false)).toBe(
      true
    );
    // user turned a default-on sub-option off
    expect(
      subOptionRan({ protvar_stability: false }, 'protvar_stability', true)
    ).toBe(false);
  });

  it('coerces truthy/falsy parameter values to a boolean', () => {
    expect(subOptionRan({ x: 1 }, 'x', false)).toBe(true);
    expect(subOptionRan({ x: 0 }, 'x', true)).toBe(false);
    expect(subOptionRan({ x: '' }, 'x', true)).toBe(false);
  });
});
