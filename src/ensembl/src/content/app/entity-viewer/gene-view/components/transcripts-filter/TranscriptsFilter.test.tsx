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
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import set from 'lodash/fp/set';

import { Status } from 'src/shared/types/status';
import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';
import TranscriptsFilter from './TranscriptsFilter';

import RadioGroup from 'src/shared/components/radio-group/RadioGroup';

const mockState = {
  entityViewer: {
    general: {
      activeGenomeId: 'human',
      activeEnsObjectIds: {
        human: 'gene:brca2'
      }
    },
    geneView: {
      transcripts: {
        human: {
          'gene:brca2': {
            expandedIds: [],
            expandedDownloadIds: [],
            filters: [],
            sortingRule: 'default'
          }
        }
      }
    },
    sidebar: {
      human: {
        status: Status.OPEN
      }
    }
  }
};

const mockStore = configureMockStore([thunk]);

const createProteinCodingTranscript = () => createTranscript();
const createNonCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.product_generating_contexts = [];
  return transcript;
};

const proteinCodingTranscript1 = createProteinCodingTranscript();
const proteinCodingTranscript2 = createProteinCodingTranscript();
const nonCodingTranscript1 = createNonCodingTranscript();
const nonCodingTranscript2 = createNonCodingTranscript();

const defaultTranscripts = [
  proteinCodingTranscript1,
  proteinCodingTranscript2,
  nonCodingTranscript1,
  nonCodingTranscript2
];

const mockToggleFilter = jest.fn();

const wrapInRedux = (
  state: typeof mockState = mockState,
  transcripts = defaultTranscripts
) => {
  return mount(
    <Provider store={mockStore(state)}>
      <TranscriptsFilter
        transcripts={transcripts}
        toggleFilter={mockToggleFilter}
      />
    </Provider>
  );
};

describe('<TranscriptsFilter />', () => {
  it('shows correct sorting option as selected', () => {
    // default sorting option
    let wrapper = wrapInRedux();
    const defaultSortingLabel = wrapper
      .find('label')
      .findWhere((el) => el.text() === 'Default');
    const defaultSortingRadioButton = defaultSortingLabel.find('input');
    expect(defaultSortingRadioButton.prop('checked')).toBe(true);

    // after we change sorting option
    const updatedState = set(
      'entityViewer.geneView.transcripts.human.gene:brca2.sortingRule',
      'spliced_length_longest_to_shortest',
      mockState
    );
    wrapper = wrapInRedux(updatedState);

    const secondSortingLabel = wrapper
      .find('label')
      .findWhere(
        (el) => el.text() === 'Combined exon length: longest – shortest'
      );
    const secondSortingRadioButton = secondSortingLabel.find('input');

    expect(secondSortingRadioButton.prop('checked')).toBe(true);
  });

  it('correctly handles sorting order change', () => {
    const store = mockStore(mockState);
    const wrapper = mount(
      <Provider store={store}>
        <TranscriptsFilter
          transcripts={defaultTranscripts}
          toggleFilter={mockToggleFilter}
        />
      </Provider>
    );
    const radioGroup = wrapper.find(RadioGroup);

    const onRadioChange = radioGroup.prop('onChange');
    const newSortingRule = 'spliced_length_longest_to_shortest';
    onRadioChange(newSortingRule);

    const sortingActions = store
      .getActions()
      .filter(
        (action) =>
          action.type ===
          'entity-viewer-gene-view-transcripts/updateSortingRule'
      );

    expect(sortingActions.length).toBe(1);
    expect(sortingActions[0].payload.sortingRule).toBe(newSortingRule);
  });
});
