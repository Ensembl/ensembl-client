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

import {
  TranscriptsListItemInfo,
  TranscriptsListItemInfoProps
} from './TranscriptsListItemInfo';
import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import { createGene } from 'tests/fixtures/entity-viewer/gene';
import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
  useQuery: jest.fn(() => ({
    data: null,
    loading: true
  }))
}));

jest.mock('src/shared/components/view-in-app/ViewInApp', () => () => (
  <div>ViewInApp</div>
));

jest.mock('src/shared/components/instant-download', () => ({
  InstantDownloadTranscript: () => <div>InstantDownloadTranscript</div>
}));

const transcript = createTranscript();
const gene = createGene({ transcripts: [transcript] });
const expandDownload = false;

const defaultProps = {
  gene,
  transcript,
  expandDownload,
  toggleTranscriptDownload: jest.fn(),
  onProteinLinkClick: jest.fn()
};

const renderComponent = (props?: Partial<TranscriptsListItemInfoProps>) => {
  const completeProps = {
    ...defaultProps,
    ...props
  };

  return mount(
    <MemoryRouter>
      <TranscriptsListItemInfo {...completeProps} />
    </MemoryRouter>
  );
};

describe('<TranscriptsListItemInfo /', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderComponent();
  });

  /*
   * FIXME: the test below will have to change when api payload updates:
   * 1) we will use protein length from api response instead of calculating it ourselves
   * 2) we will check that protein product is present on a transcript instead of looking at CDS
   */
  it('displays amino acid length when transcript has CDS', () => {
    const expectedProteinLength =
      defaultProps.transcript.product_generating_contexts[0].product?.length;
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

  it('hides Download component by default', () => {
    expect(wrapper.find(InstantDownloadTranscript)).toHaveLength(0);
  });

  it('shows Download component by default if expandDownload is true', () => {
    wrapper = renderComponent({
      expandDownload: true
    });
    expect(wrapper.find(InstantDownloadTranscript)).toHaveLength(1);
  });

  it('calls correct callback when protein link is clicked', () => {
    const proteinId =
      defaultProps.transcript.product_generating_contexts[0].product.stable_id;
    const proteinLink = wrapper
      .find('a')
      .findWhere((element: any) => element.text() === proteinId)
      .first();

    proteinLink.simulate('click');
    expect(defaultProps.onProteinLinkClick).toHaveBeenCalled();
  });
});
