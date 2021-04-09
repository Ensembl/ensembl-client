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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import {
  TranscriptsListItemInfo,
  TranscriptsListItemInfoProps
} from './TranscriptsListItemInfo';

import { createGene } from 'tests/fixtures/entity-viewer/gene';
import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

jest.mock('src/shared/components/view-in-app/ViewInApp', () => () => (
  <div data-test-id="viewInApp">ViewInApp</div>
));

jest.mock('src/shared/components/instant-download', () => ({
  InstantDownloadTranscript: () => (
    <div data-test-id="instantDownloadTranscript">
      InstantDownloadTranscript
    </div>
  )
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
  return render(
    <MemoryRouter>
      <TranscriptsListItemInfo {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe('<TranscriptsListItemInfo /', () => {
  it('displays amino acid length when transcript has a protein product', () => {
    const { container } = renderComponent();
    const expectedProteinLength =
      defaultProps.transcript.product_generating_contexts[0].product?.length;
    expect(container.querySelector('.topMiddle strong')?.textContent).toMatch(
      `${expectedProteinLength}`
    );
  });

  it('contains the download link', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.downloadLink')).toBeTruthy();
  });

  it('renders ViewInApp component', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('viewInApp')).toBeTruthy();
  });

  it('hides Download component by default', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('instantDownloadTranscript')).toBeFalsy();
  });

  it('shows Download component if expandDownload is true', () => {
    const { queryByTestId } = renderComponent({
      expandDownload: true
    });
    expect(queryByTestId('instantDownloadTranscript')).toBeTruthy();
  });

  it('calls correct callback when protein link is clicked', () => {
    const { container } = renderComponent();
    const proteinId =
      defaultProps.transcript.product_generating_contexts[0].product.stable_id;
    const proteinLink = [...container.querySelectorAll('a')].find(
      (link) => link.textContent === proteinId
    ) as HTMLElement;

    userEvent.click(proteinLink);
    expect(defaultProps.onProteinLinkClick).toHaveBeenCalled();
  });
});
