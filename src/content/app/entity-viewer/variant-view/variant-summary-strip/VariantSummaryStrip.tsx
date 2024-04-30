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

import classNames from 'classnames';
import type { ComponentProps } from 'react';
import type { Pick2 } from 'ts-multipick';

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';
import { useDefaultEntityViewerVariantQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import VariantConsequence from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-consequence/VariantConsequence';
import VariantAllelesSequences from 'src/shared/components/variant-alleles-sequences/VariantAllelesSequences';
import VariantLocation from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-location/VariantLocation';

import type { Variant } from 'src/shared/types/variation-api/variant';

import styles from './VariantSummaryStrip.module.css';

/**
 * NOTE:
 * This component is largely a duplicate of VariantSummaryStrip from shared components.
 * The reason this component is created is because the VariantSummaryStrip in shared components
 * uses a graphql query from the Genome Browser app, which is completely unnecessary
 * when we already have all the required data.
 * Hopefully, we'll be able to either refactor the FeatureSummaryStrip in shared components,
 * or move it into the genome browser directory so that it does not confuse developers.
 *
 * Note also that, in contrast to variant feature summary in genome browser,
 * this component has variant type in it
 */

type MinimalVariant = ComponentProps<typeof VariantConsequence>['variant'] & {
  alleles: ComponentProps<typeof VariantAllelesSequences>['alleles'];
} & ComponentProps<typeof VariantLocation>['variant'] &
  Pick<Variant, 'name'> &
  Pick2<Variant, 'allele_type', 'value'>;
type VariantSummaryStripProps = {
  variant: MinimalVariant;
  className?: string;
};

const VariantSummaryStripWithData = () => {
  const { activeGenomeId, parsedEntityId } = useEntityViewerIds();

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

  return currentData ? (
    <VariantSummaryStrip
      variant={currentData.variant}
      className={styles.outer}
    />
  ) : null;
};

// This is a presentation component; it can be extracted into a shared component if necessary
export const VariantSummaryStrip = (props: VariantSummaryStripProps) => {
  const { variant, className: classNameFromProps } = props;

  const mostSevereConsequence = (
    <VariantConsequence variant={variant} withColour={false} />
  );

  const componentClasses = classNames(styles.strip, classNameFromProps);

  return (
    <div className={componentClasses}>
      <div className={styles.section}>
        <span className={styles.label}>Variant</span>
        <span className={styles.variantName}>{variant.name}</span>
        <span className={styles.variantType}>{variant.allele_type.value}</span>
      </div>
      {mostSevereConsequence && (
        <div className={styles.section}>
          <span className={styles.label}>Most severe consequence</span>
          {mostSevereConsequence}
        </div>
      )}
      <div className={styles.section}>
        <VariantAllelesSequences alleles={variant.alleles} />
      </div>
      <div className={styles.section}>
        <VariantLocation variant={variant} />
      </div>
    </div>
  );
};

export default VariantSummaryStripWithData;
