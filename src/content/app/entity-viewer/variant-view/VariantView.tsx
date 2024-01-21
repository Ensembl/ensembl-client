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

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';

import { useDefaultEntityViewerVariantQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import VariantViewNavigationPanel from './variant-view-navigation-panel/VariantViewNavigationPanel';
import VariantImage from './variant-image/VariantImage';

import type { VariantAllele } from 'src/shared/types/variation-api/variantAllele';

import styles from './VariantView.module.css';

const VariantView = () => {
  const { activeGenomeId, genomeIdForUrl, parsedEntityId } =
    useEntityViewerIds();
  const navigate = useNavigate();
  const { search: urlQuery } = useLocation();

  const { objectId: variantId } = parsedEntityId ?? {};
  const alleleIdInUrl = new URLSearchParams(urlQuery).get('allele');

  const { currentData } = useDefaultEntityViewerVariantQuery(
    {
      genomeId: activeGenomeId ?? '',
      variantId: variantId ?? ''
    },
    {
      skip: !activeGenomeId || !variantId
    }
  );

  const variantData = currentData?.variant;

  useDefaultAlternativeAllele({
    genomeId: genomeIdForUrl,
    variantId,
    alleleIdInUrl,
    variant: variantData
  });

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
      {activeGenomeId && variantId && variantData && (
        <>
          <VariantViewNavigationPanel />
          <VariantImage
            genomeId={activeGenomeId}
            variantId={variantId}
            activeAlleleId={alleleIdInUrl || ''}
            onAlleleChange={onAlleleChange}
          />
        </>
      )}
    </div>
  );
};

// A hook for choosing an allele
const useDefaultAlternativeAllele = (params: {
  genomeId?: string;
  variantId?: string;
  alleleIdInUrl: string | null;
  variant?: {
    alleles: Pick<VariantAllele, 'reference_sequence' | 'allele_sequence'>[];
  };
}) => {
  const { genomeId, variantId, alleleIdInUrl, variant } = params;

  const navigate = useNavigate();

  useEffect(() => {
    if (!genomeId || !variantId || !variant) {
      return;
    }

    // temporary solution for identifying alleles
    const parsedAlleleIndex = (alleleIdInUrl &&
      parseInt(alleleIdInUrl, 10)) as number;

    if (
      typeof parsedAlleleIndex !== 'number' ||
      !variant?.alleles[parsedAlleleIndex]
    ) {
      const firstAlternativeAlleleIndex = variant.alleles.findIndex(
        (allele) => allele.reference_sequence !== allele.allele_sequence
      );

      const url = urlFor.entityViewerVariant({
        genomeId,
        variantId,
        alleleId: `${firstAlternativeAlleleIndex}`
      });
      navigate(url, { replace: true });
    }
  }, [variant]);
};

export default VariantView;
