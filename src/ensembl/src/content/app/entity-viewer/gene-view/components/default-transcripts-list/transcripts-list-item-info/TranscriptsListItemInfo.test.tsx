import React from 'react';
import { mount } from 'enzyme';

import TranscriptsListItemInfo from './TranscriptsListItemInfo';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

describe('<TranscriptsListItemInfo /', () => {
  let wrapper: any;

  beforeEach(() => {
    const props = {
      transcript: createTranscript()
    };

    wrapper = mount(<TranscriptsListItemInfo {...props} />);
  });

  it('displays amino acid length when transcript has CDS', () => {
    expect(wrapper.find('#amino-acid-length')).toHaveLength(1);
  });

  it('contains the download link', () => {
    expect(wrapper.find('.downloadLink')).toHaveLength(1);
  });
});
