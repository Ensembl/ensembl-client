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

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getViewForVariant,
  getAlleleIdForVariant
} from 'src/content/app/entity-viewer/state/variant-view/general/variantViewGeneralSelectors';

import { useAppSelector, useAppDispatch } from 'src/store';
import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';

import {
  setView,
  setAllele,
  views as variantViews,
  type ViewName as VariantViewName
} from 'src/content/app/entity-viewer/state/variant-view/general/variantViewGeneralSlice';
import { useDefaultEntityViewerVariantQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import { updatePreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSlice';

import VariantViewNavigationPanel from './variant-view-navigation-panel/VariantViewNavigationPanel';
import VariantImage from './variant-image/VariantImage';
import PopulationAlleleFrequencies from './population-allele-frequencies/PopulationAlleleFrequencies';
import TranscriptConsequences from './transcript-consequences/TranscriptConsequences';

import type { VariantAllele } from 'src/shared/types/variation-api/variantAllele';

import styles from './VariantView.module.css';

const VariantView = () => {
  const { genomeId, genomeIdForUrl, parsedEntityId } = useEntityViewerIds();
  const navigate = useNavigate();
  const { search: urlQuery } = useLocation();
  const dispatch = useAppDispatch();

  const { objectId: variantId } = parsedEntityId ?? {};
  const urlSearchParams = new URLSearchParams(urlQuery);
  const alleleIdInUrl = urlSearchParams.get('allele');
  const view = urlSearchParams.get('view');

  const { currentData } = useDefaultEntityViewerVariantQuery(
    {
      genomeId: genomeId ?? '',
      variantId: variantId ?? ''
    },
    {
      skip: !genomeId || !variantId
    }
  );

  const variantData = currentData?.variant;

  useVariantViewRouting({
    genomeId,
    genomeIdForUrl,
    variantId,
    alleleIdInUrl,
    viewInUrl: view,
    variant: variantData
  });

  useEffect(() => {
    if (!genomeId || !variantId || !currentData) {
      return;
    }

    return () => {
      const { variant } = currentData;
      dispatch(
        updatePreviouslyViewedEntities({
          genomeId,
          entity: {
            id: variantId,
            urlId: variantId,
            label: variant.name,
            type: 'variant'
          }
        })
      );
    };
  }, [genomeId, variantId, currentData]);

  const onAlleleChange = (alleleId: string) => {
    const url = urlFor.entityViewerVariant({
      genomeId: genomeIdForUrl,
      variantId,
      alleleId
    });
    navigate(url);
  };

  return (
    <div className={styles.container}>
      {genomeId && variantId && variantData && (
        <>
          <VariantViewNavigationPanel
            genomeId={genomeId}
            genomeIdForUrl={genomeIdForUrl as string}
            variantId={variantId}
            activeAlleleId={alleleIdInUrl || ''}
            view={view}
          />
          <MainContent
            view={view}
            genomeId={genomeId}
            genomeIdForUrl={genomeIdForUrl as string}
            variantId={variantId}
            activeAlleleId={alleleIdInUrl || ''}
            onAlleleChange={onAlleleChange}
          />
        </>
      )}
    </div>
  );
};

const MainContent = (props: {
  view: string | null;
  genomeId: string;
  genomeIdForUrl: string;
  variantId: string;
  activeAlleleId: string;
  onAlleleChange: (id: string) => void;
}) => {
  const { view, ...otherProps } = props;

  if (!view) {
    return <VariantImage {...otherProps} />;
  } else if (view === 'allele-frequencies') {
    return <PopulationAlleleFrequencies {...otherProps} />;
  } else if (view === 'transcript-consequences') {
    return <TranscriptConsequences {...otherProps} />;
  }
};

/**
 * The intention of the hook below is such that when user switches between genomes within Entity Viewer,
 * or between Entity Viewer and other pages on the site, we could reconstruct the allele
 * that the user was viewing, and the view that they used to inspect that allele.
 */
const useVariantViewRouting = (params: {
  genomeId: string | undefined;
  genomeIdForUrl?: string;
  variantId?: string;
  viewInUrl: string | null;
  alleleIdInUrl: string | null;
  variant?: {
    alleles: Pick<VariantAllele, 'reference_sequence' | 'allele_sequence'>[];
  };
}) => {
  const {
    genomeId,
    genomeIdForUrl,
    variantId,
    viewInUrl,
    alleleIdInUrl,
    variant
  } = params;
  const viewInRedux = useAppSelector((state) =>
    getViewForVariant(state, genomeId ?? '', variantId ?? '')
  );
  const alleleIdInRedux = useAppSelector((state) =>
    getAlleleIdForVariant(state, genomeId ?? '', variantId ?? '')
  );
  const currentView = viewInUrl || 'default';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!genomeId || !genomeIdForUrl || !variantId || !variant) {
      // this shouldn't really be the case in this component; but will make typescript happy
      return;
    }

    const isValidAlleleId = checkAlleleValidity(alleleIdInUrl, variant);

    const shouldChangeUrl =
      !isValidAlleleId || !isValidVariantView(currentView);

    if (shouldChangeUrl) {
      const alleleId = isValidAlleleId
        ? alleleIdInUrl
        : alleleIdInRedux || chooseActiveAllele(variant);
      const view =
        viewInUrl && isValidVariantView(viewInUrl)
          ? viewInUrl
          : viewInRedux !== 'default'
            ? viewInRedux
            : null;

      const url = urlFor.entityViewerVariant({
        genomeId: genomeIdForUrl,
        variantId,
        alleleId,
        view
      });
      navigate(url, { replace: true });

      updateReduxData({
        alleleId: alleleId as string,
        view: view || 'default'
      });
    } else {
      if (alleleIdInUrl && alleleIdInUrl !== alleleIdInRedux) {
        updateReduxData({ alleleId: alleleIdInUrl });
      }
      if (currentView !== viewInRedux) {
        updateReduxData({ view: currentView });
      }
    }
  }, [
    genomeId,
    genomeIdForUrl,
    variantId,
    variant,
    alleleIdInUrl,
    currentView,
    viewInRedux,
    alleleIdInRedux
  ]);

  const updateReduxData = ({
    alleleId,
    view
  }: {
    alleleId?: string;
    view?: string;
  }) => {
    if (!genomeId || !variantId) {
      return;
    }

    if (alleleId) {
      dispatch(
        setAllele({
          genomeId,
          variantId,
          alleleId
        })
      );
    }
    if (view) {
      dispatch(
        setView({
          genomeId,
          variantId,
          view: view as VariantViewName
        })
      );
    }
  };

  const isValidVariantView = (view: string) => {
    return variantViews.includes(view as VariantViewName);
  };

  const checkAlleleValidity = (
    alleleIdString: string | null,
    variant: {
      alleles: Pick<VariantAllele, 'reference_sequence' | 'allele_sequence'>[];
    }
  ) => {
    if (alleleIdString === null) {
      return false;
    }

    // temporary solution for identifying alleles
    const parsedAlleleIndex = parseInt(alleleIdString, 10) as number;

    return (
      typeof parsedAlleleIndex === 'number' &&
      Boolean(variant?.alleles[parsedAlleleIndex])
    );
  };

  const chooseActiveAllele = (variant: {
    alleles: Pick<VariantAllele, 'reference_sequence' | 'allele_sequence'>[];
  }) => {
    const firstAlternativeAlleleIndex = variant.alleles.findIndex(
      (allele) => allele.reference_sequence !== allele.allele_sequence
    );
    return `${firstAlternativeAlleleIndex}`;
  };
};

export default VariantView;
