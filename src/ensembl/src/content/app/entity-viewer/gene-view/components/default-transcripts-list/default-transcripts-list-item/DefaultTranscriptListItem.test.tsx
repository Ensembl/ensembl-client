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

import DefaultTranscriptListItem from './DefaultTranscriptListItem';
import TranscriptsListItemInfo from '../transcripts-list-item-info/TranscriptsListItemInfo';
import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';
import {
  createGene,
  createRulerTicks
} from 'tests/fixtures/entity-viewer/gene';

jest.mock('../transcripts-list-item-info/TranscriptsListItemInfo', () => () => (
  <div>TranscriptsListItemInfo</div>
));

jest.mock(
  'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript',
  () => () => <div>UnsplicedTranscript</div>
);

describe('<DefaultTranscriptListItem />', () => {
  let wrapper: any;

  beforeEach(() => {
    const props = {
      gene: createGene(),
      transcript: createTranscript(),
      rulerTicks: createRulerTicks(),
      expandTranscript: false,
      expandDownload: false
    };

    wrapper = mount(<DefaultTranscriptListItem {...props} />);
  });

  it('displays unspliced transcript', () => {
    expect(wrapper.exists(UnsplicedTranscript)).toBe(true);
  });

  it('toggles transcript item info', () => {
    wrapper.find('.middle').simulate('click');
    expect(wrapper.exists(TranscriptsListItemInfo)).toBe(true);

    wrapper.find('.right').simulate('click');
    expect(wrapper.exists(TranscriptsListItemInfo)).toBe(false);
  });
});
