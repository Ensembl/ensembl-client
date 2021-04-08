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

import {
  DefaultTranscriptListItem,
  DefaultTranscriptListItemProps
} from './DefaultTranscriptListItem';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';
import {
  createGene,
  createRulerTicks
} from 'tests/fixtures/entity-viewer/gene';

jest.mock('../transcripts-list-item-info/TranscriptsListItemInfo', () => () => (
  <div className="transcriptsListItemInfo">TranscriptsListItemInfo</div>
));

jest.mock(
  'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript',
  () => () => <div className="unsplicedTranscript">UnsplicedTranscript</div>
);

const toggleTranscriptInfo = jest.fn();

describe('<DefaultTranscriptListItem />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    gene: createGene(),
    transcript: createTranscript(),
    rulerTicks: createRulerTicks(),
    expandTranscript: false,
    expandDownload: false,
    toggleTranscriptInfo: toggleTranscriptInfo
  };

  const renderComponent = (props?: Partial<DefaultTranscriptListItemProps>) =>
    render(<DefaultTranscriptListItem {...defaultProps} {...props} />);

  it('displays unspliced transcript', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.unsplicedTranscript')).toBeTruthy();
  });

  it('toggles transcript item info onClick', () => {
    const { container } = renderComponent();
    const clickableArea = container.querySelector(
      '.clickableTranscriptArea'
    ) as HTMLElement;
    const transcriptLabel = container.querySelector('.right') as HTMLElement;

    userEvent.click(clickableArea);
    expect(toggleTranscriptInfo).toHaveBeenCalledTimes(1);

    userEvent.click(transcriptLabel);
    expect(toggleTranscriptInfo).toHaveBeenCalledTimes(2);
  });

  it('hides transcript info by default', () => {
    const { container } = renderComponent();

    expect(container.querySelector('.transcriptsListItemInfo')).toBeFalsy();
  });

  it('displays transcript info if expandTranscript is true', () => {
    const { container } = renderComponent({ expandTranscript: true });

    expect(container.querySelector('.transcriptsListItemInfo')).toBeTruthy();
  });

  it('displays selected transcript', () => {
    const { container } = renderComponent({ isDefault: true });
    expect(
      container.querySelector('.transcriptQualityLabel')?.textContent
    ).toBe('Selected');
  });
});
