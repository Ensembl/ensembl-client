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
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';

import TranscriptsListItemInfo from './TranscriptsListItemInfo';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import { createGene } from 'tests/fixtures/entity-viewer/gene';
import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

jest.mock('src/shared/components/view-in-app/ViewInApp', () => () => (
  <div>ViewInApp</div>
));

describe('<TranscriptsListItemInfo /', () => {
  let wrapper: any;
  const transcript = createTranscript();
  const gene = createGene({ transcripts: [transcript] });
  const props = {
    gene,
    transcript
  };

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <TranscriptsListItemInfo {...props} />
      </MemoryRouter>
    );
  });

  /*
   * FIXME: the test below will have to change when api payload updates:
   * 1) we will use protein length from api response instead of calculating it ourselves
   * 2) we will check that protein product is present on a transcript instead of looking at CDS
   */
  it('displays amino acid length when transcript has CDS', () => {
    const totalExonsLength = props.transcript.exons.reduce((sum, exon) => {
      return sum + exon.slice.location.end - exon.slice.location.start + 1;
    }, 0);
    const expectedProteinLength = Math.floor(totalExonsLength / 3);
    expect(wrapper.find('.topMiddle strong').text()).toMatch(
      `${expectedProteinLength}`
    );
  });

  it('contains the download link', () => {
    expect(wrapper.find('.downloadLink')).toHaveLength(1);
  });

  it('renders ViewInApp component', () => {
    expect(wrapper.find(ViewInApp)).toHaveLength(1);
  });
});
