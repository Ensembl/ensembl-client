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
      minimalProps.transcript.exons.length
    );
  });
});
