import React from 'react';
import { mount, render } from 'enzyme';

import SpeciesSearchMatch from './SpeciesSearchMatch';

import styles from './SpeciesSearchMatch.scss';

const onClick = jest.fn();

const matchTemplate = {
  description: 'Human GRCh38.p12',
  scientific_name: 'Homo sapiens',
  matched_substrings: [
    {
      length: 3,
      offset: 0,
      match: 'description' as 'description'
    }
  ],
  genome: 'GRCh38_demo'
};

describe('<SpeciesSearchMatch />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('highlights a single match in the description field', () => {
    const renderedMatch = render(
      <SpeciesSearchMatch match={matchTemplate} onClick={onClick} />
    );
    const highlightedFragments = renderedMatch.find(
      `.${styles.speciesSearchMatchMatched}`
    );
    expect(highlightedFragments.length).toBe(1);
    // highlighting Hum in Human
    expect(highlightedFragments.first().text()).toBe('Hum');
  });

  test('highlights a single match in the scientific_name field', () => {
    const match = {
      ...matchTemplate,
      matched_substrings: [
        {
          length: 3,
          offset: 0,
          match: 'scientific_name' as 'scientific_name'
        }
      ]
    };
    const renderedMatch = render(
      <SpeciesSearchMatch match={match} onClick={onClick} />
    );
    const highlightedFragments = renderedMatch.find(
      `.${styles.speciesSearchMatchScientificName}
      .${styles.speciesSearchMatchMatched}`
    );
    expect(highlightedFragments.length).toBe(1);
    // highlighting Hom in Homo sapiens
    expect(highlightedFragments.first().text()).toBe('Hom');
  });

  test('highlights multiple matches in the description field', () => {
    const match = {
      ...matchTemplate,
      description: 'Bacillus subtilis',
      matched_substrings: [
        {
          length: 3,
          offset: 0,
          match: 'description' as 'description'
        },
        {
          length: 3,
          offset: 9,
          match: 'description' as 'description'
        }
      ]
    };
    delete match.scientific_name;

    const renderedMatch = render(
      <SpeciesSearchMatch match={match} onClick={onClick} />
    );
    const highlightedFragments = renderedMatch.find(
      `.${styles.speciesSearchMatchMatched}`
    );
    expect(highlightedFragments.length).toBe(2);
    // highlighting Bac in Bacillus and sub in subtilis
    expect(highlightedFragments.first().text()).toBe('Bac');
    expect(highlightedFragments.last().text()).toBe('sub');
  });

  test('calls click handler when clicked', () => {
    const renderedMatch = mount(
      <SpeciesSearchMatch match={matchTemplate} onClick={onClick} />
    );
    renderedMatch.simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
