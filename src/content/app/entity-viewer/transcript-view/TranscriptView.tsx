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

import { useEffect, useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getViewForTranscript } from 'src/content/app/entity-viewer/state/transcript-view/general/transcriptViewGeneralSelectors';

import { updatePreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSlice';
import useTranscriptViewIds from 'src/content/app/entity-viewer/transcript-view/hooks/useTranscriptViewIds';
import { useDefaultEntityViewerTranscriptQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import {
  setView,
  isValidView,
  defaultView,
  type ViewName as TranscriptViewName
} from 'src/content/app/entity-viewer/state/transcript-view/general/transcriptViewGeneralSlice';

import GeneOverviewImage from './components/gene-overview-image/GeneOverviewImage';
import TranscriptViewTabs from './components/transcript-view-tabs/TranscriptViewTabs';
import TranscriptDetails from './components/transcript-details/TranscriptDetails';
import TranscriptFunction from './components/transcript-function/TranscriptFunction';
import ExonsView from './components/transcript-exons/ExonsView';

import type { TicksAndScale } from 'src/shared/components/feature-length-ruler/FeatureLengthRuler';

import styles from './TranscriptView.module.css';

const TranscriptView = () => {
  const { activeGenomeId, genomeIdForUrl, transcriptId } =
    useTranscriptViewIds();
  const [rulerTicks, setRulerTicks] = useState<TicksAndScale | null>(null);
  const [searchParams] = useSearchParams();
  const { currentData } = useDefaultEntityViewerTranscriptQuery(
    {
      genomeId: activeGenomeId ?? '',
      transcriptId: transcriptId ?? ''
    },
    {
      skip: !activeGenomeId || !transcriptId
    }
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!activeGenomeId || !currentData?.transcript) {
      return;
    }
    const { transcript } = currentData;

    return () => {
      dispatch(
        updatePreviouslyViewedEntities({
          genomeId: activeGenomeId,
          entity: {
            id: transcript.stable_id,
            urlId: transcript.unversioned_stable_id,
            label: transcript.stable_id,
            type: 'transcript'
          }
        })
      );
    };
  }, [activeGenomeId, currentData, dispatch]);

  const viewInUrl = searchParams.get('view');

  const { view, navigateToView } = useTranscriptViewRouter({
    genomeId: activeGenomeId ?? '',
    transcriptId: transcriptId ?? '',
    viewInUrl
  });

  if (!activeGenomeId || !transcriptId || !currentData) {
    return null; // FIXME: show a spinner?
  }

  const onViewChange = (view: string) => {
    navigateToView({ view });
  };

  return (
    <div className={styles.container}>
      <GeneOverviewImage
        transcript={currentData.transcript}
        gene={currentData.transcript.gene}
        onTicksCalculated={setRulerTicks}
      />
      <div className={classNames(styles.tabsSection, styles.gridColumns)}>
        <div className={styles.tabs}>
          <TranscriptViewTabs activeView={view} onViewChange={onViewChange} />
        </div>
      </div>
      {view === defaultView && rulerTicks && (
        <TranscriptDetails
          genomeId={activeGenomeId}
          genomeIdForUrl={genomeIdForUrl ?? activeGenomeId}
          transcript={currentData.transcript}
          rulerTicks={rulerTicks}
        />
      )}
      {view === 'protein' && (
        <TranscriptFunction transcript={currentData.transcript} />
      )}
      {view === 'exons' && (
        <ExonsView genomeId={activeGenomeId} transcriptId={transcriptId} />
      )}
    </div>
  );
};

const useTranscriptViewRouter = ({
  genomeId,
  transcriptId,
  viewInUrl
}: {
  genomeId: string;
  transcriptId: string;
  viewInUrl: string | null;
}) => {
  const prevViewInUrl = useRef(viewInUrl);
  const viewInRedux = useAppSelector((state) =>
    getViewForTranscript(state, genomeId, transcriptId)
  );
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const navigateToView = useCallback(
    ({ view, replace = false }: { view: string | null; replace?: boolean }) => {
      const searchParams = new URLSearchParams(location.search);
      if (!view || view === defaultView) {
        searchParams.delete('view');
      } else {
        searchParams.set('view', view);
      }
      const url = `${location.pathname}?${searchParams.toString()}`;
      navigate(url, { replace });
    },
    [location.pathname, location.search, navigate]
  );

  const updateReduxData = useCallback(() => {
    const view = viewInUrl ?? defaultView;
    dispatch(
      setView({
        genomeId,
        transcriptId,
        view: view as TranscriptViewName
      })
    );
  }, [dispatch, genomeId, transcriptId, viewInUrl]);

  useEffect(() => {
    if (viewInUrl) {
      if (!isValidView(viewInUrl)) {
        // this can only happen if user edited the url
        // remove the view information from the url
        navigateToView({ view: null, replace: true });
      }
      // always trust the url
      if (viewInUrl !== viewInRedux) {
        updateReduxData();
      }
    } else {
      // choose between showing the default view or updating url with view stored in redux
      if (!prevViewInUrl.current) {
        // this is the first navigation to the transcripts view
        // check redux for stored view
        if (viewInRedux !== defaultView) {
          navigateToView({ view: viewInRedux, replace: true });
        }
      } else {
        updateReduxData();
      }
    }

    prevViewInUrl.current = viewInUrl;
  }, [viewInUrl, navigateToView, updateReduxData, viewInRedux]);

  return {
    view: viewInRedux,
    navigateToView
  };
};

export default TranscriptView;
