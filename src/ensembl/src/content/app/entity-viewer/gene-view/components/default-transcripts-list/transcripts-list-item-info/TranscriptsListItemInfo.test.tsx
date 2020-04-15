import React from 'react';
import { mount } from 'enzyme';

import TranscriptsListItemInfo from './TranscriptsListItemInfo';

import { createGene } from 'tests/fixtures/entity-viewer/gene';
import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

describe('<TranscriptsListItemInfo /', () => {
  let wrapper: any;
  const transcript = createTranscript();
  const gene = createGene({ transcripts: [transcript] });
  const props = {
    gene,
    transcript
  };

  beforeEach(() => {
    wrapper = mount(<TranscriptsListItemInfo {...props} />);
  });

  it('displays amino acid length when transcript has CDS', () => {
    expect(wrapper.find('.topMiddle strong')).toHaveLength(1);
  });

  it('contains the download link', () => {
    expect(wrapper.find('.downloadLink')).toHaveLength(1);
  });
});
