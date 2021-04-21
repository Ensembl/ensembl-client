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
import { render } from '@testing-library/react';
import faker from 'faker';

import { TrackPanelList, TrackPanelListProps } from './TrackPanelList';

import { createEnsObject } from 'tests/fixtures/ens-object';
import { TrackSet } from '../trackPanelConfig';
import { createGenomeCategories } from 'tests/fixtures/genomes';
import { createTrackStates } from 'tests/fixtures/track-panel';

jest.mock('./TrackPanelListItem', () => () => (
  <div className="trackPanelListItem" />
));

describe('<TrackPanelList />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelListProps = {
    activeGenomeId: faker.lorem.words(),
    isDrawerOpened: true,
    activeEnsObject: createEnsObject(),
    selectedTrackPanelTab: TrackSet.GENOMIC,
    genomeTrackCategories: createGenomeCategories(),
    trackStates: createTrackStates()
  };

  const mountTrackPanelList = (props?: Partial<TrackPanelListProps>) =>
    render(<TrackPanelList {...defaultProps} {...props} />);

  describe('rendering', () => {
    it('renders track panel items', () => {
      const { container } = mountTrackPanelList();
      expect(
        container.querySelectorAll('.trackPanelListItem').length
      ).toBeGreaterThan(0);
    });

    it('does not render main track if the focus feature is a region', () => {
      const { container } = mountTrackPanelList({
        activeEnsObject: createEnsObject('region')
      });
      expect(container.querySelector('.mainTrackItem')).toBeFalsy();
    });
  });
});
