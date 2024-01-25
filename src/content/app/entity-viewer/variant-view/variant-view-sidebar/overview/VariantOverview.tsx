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
import { useLocation } from 'react-router-dom';

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';
import { useDefaultEntityViewerVariantQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import variantGroups from 'src/content/app/genome-browser/constants/variantGroups';

import MainAccordion from './MainAccordion';
import { VariantDB } from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/VariantSummary';
import VariantConsequence, {
  getMostSevereVariantConsequence
} from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-consequence/VariantConsequence';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import styles from './VariantOverview.module.css';

const VariantOverview = () => {
  const { activeGenomeId, genomeIdForUrl, parsedEntityId } =
    useEntityViewerIds();
  const { search: urlQuery } = useLocation();

  const alleleIdInUrl = new URLSearchParams(urlQuery).get('allele');

  const { objectId: variantId } = parsedEntityId ?? {};

  const { currentData, isFetching } = useDefaultEntityViewerVariantQuery(
    {
      genomeId: activeGenomeId ?? '',
      variantId: variantId ?? ''
    },
    {
      skip: !activeGenomeId || !variantId
    }
  );

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!genomeIdForUrl || !variantId || !currentData?.variant) {
    return <div>No data to display</div>;
  }

  const { variant } = currentData;

  const mostSevereConsequence = <VariantConsequence variant={variant} />;

  const variantConsequence = getMostSevereVariantConsequence(variant);

  if (!variantConsequence) {
    return null;
  }

  const currentVariantGroup = variantGroups.find(({ variant_types }) =>
    variant_types.find(({ label }) => label === variantConsequence)
  );

  const currentVariantType = currentVariantGroup?.variant_types.find(
    ({ label }) => label === variantConsequence
  );

  return (
    <div className={styles.overviewContainer}>
      <section className={styles.sectionContent}>
        <div>
          <span className={styles.labelTextStrong}>{variant.name}</span>
          <span className={styles.variantType}>
            {variant.allele_type.value}
          </span>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Source</div>
          <div className={styles.value}>
            <VariantDB variant={variant} />
          </div>
        </div>

        {mostSevereConsequence && (
          <div className={styles.newRowGroup}>
            <span className={styles.label}>Most severe consequence</span>
            {mostSevereConsequence}
          </div>
        )}
        <div className={styles.externalLink}>
          {currentVariantType &&
            (currentVariantType.url ? (
              <ExternalLink
                to={currentVariantType.url}
                linkText={currentVariantType.so_accession_id}
              />
            ) : (
              <span>{currentVariantType.so_accession_id}</span>
            ))}
        </div>
        <div className={styles.newRowGroup}>
          <span className={styles.labelText}>{currentVariantGroup?.label}</span>
        </div>
      </section>

      <MainAccordion
        genomeId={genomeIdForUrl}
        variantId={variantId}
        variant={variant}
        activeAlleleId={alleleIdInUrl}
      />
    </div>
  );
};

export default VariantOverview;
