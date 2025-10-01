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

import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import createRootReducer from 'src/root/rootReducer';
import restApiSlice from 'src/shared/state/api-slices/restSlice';
import {
  setBlastDatabase,
  setBlastProgram,
  setSequenceType
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import blastSettingsConfig from 'tests/fixtures/blast/blastSettingsConfig';

import BlastSettings from './BlastSettings';

vi.mock('config', () => ({
  toolsApiBaseUrl: 'http://tools-api' // need to provide absolute urls to the fetch running in Node
}));

// BlastSettings component depends on useBlastForm hook, which fetches the config
const mockServer = setupServer(
  http.get('http://tools-api/blast/config', () => {
    return HttpResponse.json(blastSettingsConfig);
  })
);

const renderBlastSettings = () => {
  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([restApiSlice.middleware])
  });

  const renderedComponent = render(
    <MemoryRouter>
      <Provider store={store}>
        <BlastSettings config={blastSettingsConfig} />
      </Provider>
    </MemoryRouter>
  );

  return {
    ...renderedComponent,
    store
  };
};

beforeAll(() =>
  mockServer.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  })
);
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

/**
 * - supported BLAST programs: blastn, tblastx, blastx, tblastn, blastp
 */

describe('BlastSettings', () => {
  let renderResult: ReturnType<typeof renderBlastSettings>;

  beforeEach(async () => {
    renderResult = renderBlastSettings();
    const { container, store, getByText } = renderResult;

    await act(() => {
      store.dispatch(
        setBlastDatabase({ database: 'dna_sm', config: blastSettingsConfig })
      );
    });

    // making sure that the component has rendered something
    await waitFor(() => {
      expect(container.querySelector('select')).toBeTruthy();
    });

    // open the parameters section
    const parametersSectionToggle = getByText('Parameters');
    await userEvent.click(parametersSectionToggle);
  });

  describe('match/mismatch score selector', () => {
    it('is only available for blastn', async () => {
      // Default options
      const { store, getByLabelText, queryByLabelText } = renderResult;

      let programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getAllSelectableValues(programSelector)).toEqual([
        'blastn',
        'tblastx'
      ]);
      expect(getSelectedValueFromSelect(programSelector)).toBe('blastn');

      const matchScoreSelector = getByLabelText(
        'Match/mismatch scores'
      ) as HTMLSelectElement;
      expect(getAllSelectableValues(matchScoreSelector).sort()).toEqual(
        Object.keys(
          blastSettingsConfig.gap_penalties.options.match_scores
        ).sort()
      );

      // switch to tblastx
      await act(() => {
        store.dispatch(
          setBlastProgram({ program: 'tblastx', config: blastSettingsConfig })
        );
      });

      programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getSelectedValueFromSelect(programSelector)).toBe('tblastx');
      let missingMatchScoreSelector = queryByLabelText('Match/mismatch scores');
      expect(missingMatchScoreSelector).toBe(null);

      // switch to blastx
      await act(() => {
        store.dispatch(
          setBlastDatabase({ database: 'pep', config: blastSettingsConfig })
        );
      });

      programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getSelectedValueFromSelect(programSelector)).toBe('blastx');
      missingMatchScoreSelector = queryByLabelText('Match/mismatch scores');
      expect(missingMatchScoreSelector).toBe(null);

      // switch to blastp
      await act(() => {
        store.dispatch(
          setSequenceType({
            sequenceType: 'protein',
            config: blastSettingsConfig
          })
        );
      });

      programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getSelectedValueFromSelect(programSelector)).toBe('blastp');
      missingMatchScoreSelector = queryByLabelText('Match/mismatch scores');
      expect(missingMatchScoreSelector).toBe(null);

      // switch to tblastn
      await act(() => {
        store.dispatch(
          setBlastDatabase({ database: 'dna_sm', config: blastSettingsConfig })
        );
      });

      programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getSelectedValueFromSelect(programSelector)).toBe('tblastn');
      missingMatchScoreSelector = queryByLabelText('Match/mismatch scores');
      expect(missingMatchScoreSelector).toBe(null);
    });

    it('controls values of gap penalties', async () => {
      const { getByLabelText } = renderResult;

      const matchScoreSelector = getByLabelText(
        'Match/mismatch scores'
      ) as HTMLSelectElement;
      const matchScoreOptionElements =
        getAllSelectOptionElements(matchScoreSelector);

      for (const optionElement of matchScoreOptionElements) {
        const matchScore = optionElement.value;
        await userEvent.selectOptions(matchScoreSelector, optionElement);
        const gepPenaltySelector = getByLabelText(
          'Gap penalties'
        ) as HTMLSelectElement;
        const gapPenaltyOptions = getAllSelectableValues(
          gepPenaltySelector
        ).map((string) => string.split(','));

        const expectedPenalties =
          blastSettingsConfig.gap_penalties.options.match_scores[matchScore];

        expect(gapPenaltyOptions).toEqual(expectedPenalties);
      }
    });
  });

  describe('scoring matrix selector', () => {
    it('is available with appropriate programs', async () => {
      // Default
      const { store, getByLabelText, queryByLabelText } = renderResult;

      let programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getAllSelectableValues(programSelector)).toEqual([
        'blastn',
        'tblastx'
      ]);
      expect(getSelectedValueFromSelect(programSelector)).toBe('blastn');

      let scoringMatrixSelector = queryByLabelText('Matrix');
      expect(scoringMatrixSelector).toBe(null);

      // switch to tblastx
      await act(() => {
        store.dispatch(
          setBlastProgram({ program: 'tblastx', config: blastSettingsConfig })
        );
      });

      programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getSelectedValueFromSelect(programSelector)).toBe('tblastx');

      scoringMatrixSelector = queryByLabelText('Matrix');
      expect(scoringMatrixSelector).toBeTruthy();

      expect(
        getAllSelectableValues(
          scoringMatrixSelector as HTMLSelectElement
        ).sort()
      ).toEqual(
        Object.keys(blastSettingsConfig.gap_penalties.options.matrix).sort()
      );

      // switch to blastx
      await act(() => {
        store.dispatch(
          setBlastDatabase({ database: 'pep', config: blastSettingsConfig })
        );
      });

      programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getSelectedValueFromSelect(programSelector)).toBe('blastx');
      scoringMatrixSelector = queryByLabelText('Matrix');
      expect(scoringMatrixSelector).toBeTruthy();

      // switch to blastp
      await act(() => {
        store.dispatch(
          setSequenceType({
            sequenceType: 'protein',
            config: blastSettingsConfig
          })
        );
      });

      programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getSelectedValueFromSelect(programSelector)).toBe('blastp');
      scoringMatrixSelector = queryByLabelText('Matrix');
      expect(scoringMatrixSelector).toBeTruthy();

      // switch to tblastn
      await act(() => {
        store.dispatch(
          setBlastDatabase({ database: 'dna_sm', config: blastSettingsConfig })
        );
      });

      programSelector = getByLabelText('Program') as HTMLSelectElement;
      expect(getSelectedValueFromSelect(programSelector)).toBe('tblastn');
      scoringMatrixSelector = queryByLabelText('Matrix');
      expect(scoringMatrixSelector).toBeTruthy();
    });

    it('controls values of gap penalties', async () => {
      const { store, getByLabelText } = renderResult;

      // switch to blastx to see both the scoring matrix selector and the gap penalties selector
      await act(() => {
        store.dispatch(
          setBlastProgram({ program: 'blastx', config: blastSettingsConfig })
        );
      });

      const scoringMatrixSelector = getByLabelText(
        'Matrix'
      ) as HTMLSelectElement;
      const matrixOptionElements = getAllSelectOptionElements(
        scoringMatrixSelector
      );

      for (const optionElement of matrixOptionElements) {
        const matchScore = optionElement.value;
        await userEvent.selectOptions(scoringMatrixSelector, optionElement);
        const gepPenaltySelector = getByLabelText(
          'Gap penalties'
        ) as HTMLSelectElement;
        const gapPenaltyOptions = getAllSelectableValues(
          gepPenaltySelector
        ).map((string) => string.split(','));

        const expectedPenalties =
          blastSettingsConfig.gap_penalties.options.matrix[matchScore];

        expect(gapPenaltyOptions).toEqual(expectedPenalties);
      }
    });
  });
});

const getSelectedValueFromSelect = (element: HTMLSelectElement) => {
  return element.value;
};

const getAllSelectableValues = (element: HTMLSelectElement) => {
  return [...element.querySelectorAll('option')].map((option) => option.value);
};

const getAllSelectOptionElements = (element: HTMLSelectElement) => {
  return [...element.querySelectorAll('option')];
};
