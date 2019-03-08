import React from 'react';
import { render } from 'enzyme';

import SpeciesSearchMatch from './SpeciesSearchMatch';

import styles from './SpeciesSearchMatch.scss';

const onClick = jest.fn;

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
  test('highlights a single match in the description field', () => {
    const renderedMatch = render(
      <SpeciesSearchMatch match={matchTemplate} onClick={onClick} />
    );
    const highlightedFragments = renderedMatch.find(
      `.${styles.speciesSearchMatchMatched}`
    );
    expect(highlightedFragments.length).toBe(1);
    expect(highlightedFragments.first().text()).toBe('Hum');
  });

  // test('highlights a single match in the scientific_name field', () => {

  // });

  // test('highlights multiple matches in the description field', () => {

  // });
});
