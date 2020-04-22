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
});
