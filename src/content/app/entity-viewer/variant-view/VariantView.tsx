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

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';

import { useDefaultEntityViewerVariantQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import VariantImage from './variant-image/VariantImage';

import type { VariantAllele } from 'src/shared/types/variation-api/variantAllele';

import styles from './VariantView.module.css';

const VariantView = () => {
  const { activeGenomeId, genomeIdForUrl, entityIdForUrl, parsedEntityId } =
    useEntityViewerIds();

  const { objectId: variantId } = parsedEntityId ?? {};

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
    variantId: entityIdForUrl,
    variant: variantData
  });

  return (
    <div className={styles.container}>
      {activeGenomeId && variantId && variantData && (
        <>
          <div
            style={{
              height: '200px',
              position: 'sticky',
              top: '0',
              backgroundColor: 'var(--color-black)',
              textAlign: 'center'
            }}
          >
            Placeholder for navigation panel for variant {variantData.name}
          </div>
          <div>
            <VariantImage genomeId={activeGenomeId} variantId={variantId} />
          </div>
        </>
      )}
    </div>
  );
};

// A hook for choosing an allele
const useDefaultAlternativeAllele = (params: {
  genomeId?: string;
  variantId?: string;
  variant?: {
    alleles: Pick<VariantAllele, 'reference_sequence' | 'allele_sequence'>[];
  };
}) => {
  const { genomeId, variantId, variant } = params;
  const { search: urlQuery } = useLocation();
  const navigate = useNavigate();
  const alleleIndexInUrl = new URLSearchParams(urlQuery).get('allele');

  useEffect(() => {
    if (!genomeId || !variantId || !variant) {
      return;
    }

    // temporary solution for identifying alleles
    const parsedAlleleIndex = (alleleIndexInUrl &&
      parseInt(alleleIndexInUrl, 10)) as number;

    if (!alleleIndexInUrl || !variant?.alleles[parsedAlleleIndex]) {
      const firstAlternativeAlleleIndex = variant.alleles.findIndex(
        (allele) => allele.reference_sequence !== allele.allele_sequence
      );

      const url = `/entity-viewer/${genomeId}/${variantId}?allele=${firstAlternativeAlleleIndex}`;
      navigate(url, { replace: true });
    }
  }, [variant]);
};

export default VariantView;
