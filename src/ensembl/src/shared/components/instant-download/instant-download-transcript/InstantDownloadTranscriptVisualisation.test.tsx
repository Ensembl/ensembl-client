import React from 'react';
import { render } from 'enzyme';

import InstantDownloadTranscriptVisualisation, {
  Props
} from './InstantDownloadTranscriptVisualisation';

describe('InstantDownloadTranscriptVisualisation', () => {
  const renderWrapper = (props: Partial<Props> = {}) => {
    return render(<InstantDownloadTranscriptVisualisation {...props} />);
  };

  it('renders an svg element', () => {
    const wrapper = renderWrapper();
    expect(wrapper.is('svg')).toBe(true);
  });

  it('contains 5 exons', () => {
    const wrapper = renderWrapper();
    expect(wrapper.find('.outerExon, .innerExon').length).toBe(5);
  });

  it('highlights only exons within coding sequence if CDS is enabled', () => {
    const wrapper = renderWrapper({ isCDSEnabled: true });
    expect(wrapper.find('.highlighted.innerExon').length).toBeTruthy();
    expect(wrapper.find('.highlighted.halfOuterExon').length).toBeTruthy();
    expect(wrapper.find('.highlighted.outerExon').length).toBe(0);
    expect(wrapper.find('.highlighted.backbone').length).toBe(0);
  });

  it('correctly highlights cDNA segments', () => {
    const wrapper = renderWrapper({ isCDNAEnabled: true });
    expect(wrapper.find('.highlighted.innerExon').length).toBeTruthy();
    expect(wrapper.find('.highlighted.halfOuterExon').length).toBeTruthy();
    expect(wrapper.find('.highlighted.outerExon').length).toBeTruthy();
    expect(wrapper.find('.highlighted.backbone').length).toBe(0);
  });

  it('correctly highlights complete genomic sequence', () => {
    const wrapper = renderWrapper({ isGenomicSequenceEnabled: true });
    expect(wrapper.find('.highlighted.innerExon').length).toBeTruthy();
    expect(wrapper.find('.highlighted.halfOuterExon').length).toBeTruthy();
    expect(wrapper.find('.highlighted.outerExon').length).toBeTruthy();
    expect(wrapper.find('.highlighted.intron').length).toBeTruthy();
  });

  it('shows protein segments if protein sequence option is enabled', () => {
    let wrapper = renderWrapper();
    expect(wrapper.find('.protein').length).toBe(0);

    wrapper = renderWrapper({ isProteinSequenceEnabled: true });
    expect(wrapper.find('.protein').length).toBeTruthy();
  });
});
