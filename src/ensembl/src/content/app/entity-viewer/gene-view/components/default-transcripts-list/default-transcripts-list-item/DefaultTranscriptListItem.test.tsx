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
      rulerTicks: createRulerTicks()
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
