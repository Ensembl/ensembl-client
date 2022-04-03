import { configureStore } from '@reduxjs/toolkit';
import { BehaviorSubject } from 'rxjs';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { createEpicMiddleware, combineEpics, ofType } from 'redux-observable';

import rootReducer from 'src/root/rootReducer';
import * as blastEpics from 'src/content/app/tools/blast/state/epics/blastEpics';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import {
  createBlastSubmissionResponse,
  createSuccessfulBlastJobInSubmissionResponse,
  createRunningJobStatusResponse,
  createFinishedJobStatusResponse
} from 'src/content/app/tools/blast/state/epics/tests/fixtures/blastSubmissionFixtures';

const server = setupServer(
  rest.post('/api/tools//blast/job', (req, res, ctx) => {
    return res(ctx.json(successfulSubmission));
  }),
);

const firstJobInResponse = createSuccessfulBlastJobInSubmissionResponse();
const secondJobInResponse = createSuccessfulBlastJobInSubmissionResponse();

const successfulSubmission = createBlastSubmissionResponse({
  jobs: [firstJobInResponse, secondJobInResponse]
});

const buildReduxStore = () => {
  const epicMiddleware = createEpicMiddleware();
  const middleware = [
    epicMiddleware,
    restApiSlice.middleware
  ];

  const rootEpic = combineEpics(...Object.values(blastEpics));
  const epic$ = new BehaviorSubject(rootEpic);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware) as any,
  });

  epicMiddleware.run();

  return store;
};

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

