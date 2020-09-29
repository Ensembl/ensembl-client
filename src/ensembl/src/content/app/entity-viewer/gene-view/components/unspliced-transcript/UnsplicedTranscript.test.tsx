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

import React from 'react';
import { render } from 'enzyme';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

import UnsplicedTranscript from './UnsplicedTranscript';

const minimalProps = {
  transcript: createTranscript(),
  width: 600
};

describe('<UnsplicedTranscript />', () => {
  it('renders inside an <svg> element if standalone', () => {
    const wrapper = render(
      <UnsplicedTranscript {...minimalProps} standalone={true} />
    );
    expect(wrapper.is('svg')).toBe(true);
  });

  it('renders inside a <g> element (svg group) if not standalone', () => {
    const wrapper = render(<UnsplicedTranscript {...minimalProps} />);
    expect(wrapper.is('g')).toBe(true);
  });

  it('renders the correct number of exons', () => {
    const wrapper = render(<UnsplicedTranscript {...minimalProps} />);
    expect(wrapper.find('.exon').length).toBe(
      minimalProps.transcript.spliced_exons.length
    );
  });
});
