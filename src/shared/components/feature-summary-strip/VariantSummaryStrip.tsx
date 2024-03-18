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

import React, {
  forwardRef,
  type ComponentProps,
  type ForwardedRef
} from 'react';
import classNames from 'classnames';

import VariantConsequence from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-consequence/VariantConsequence';
import VariantAllelesSequences from 'src/shared/components/variant-alleles-sequences/VariantAllelesSequences';
import VariantLocation from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-location/VariantLocation';

import { useGbVariantQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import type { FocusVariant } from 'src/shared/types/focus-object/focusObjectTypes';

import styles from './VariantSummaryStrip.module.css';
import featureStripStyles from './FeatureSummaryStrip.module.css';

export type VariantForSummaryStrip = ComponentProps<
  typeof VariantConsequence
>['variant'] &
  ComponentProps<typeof VariantLocation>['variant'] & {
    name: string;
    allele_type: {
      value: string;
    };
    alleles: ComponentProps<typeof VariantAllelesSequences>['alleles'];
  };

const VariantSummaryStrip = (
  props: {
    variant: FocusVariant;
    isGhosted?: boolean;
    className?: string;
  },
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { variant, isGhosted } = props;
  const { genome_id: genomeId, variant_id: variantId } = variant;
  const { currentData: variantData } = useGbVariantQuery({
    genomeId,
    variantId
  });

  if (!variantData) {
    return null;
  }

  const stripClasses = classNames(
    featureStripStyles.featureSummaryStrip,
    props.className,
    {
      [featureStripStyles.featureSummaryStripGhosted]: isGhosted
    }
  );

  return (
    <div className={stripClasses} ref={ref}>
      <FullContent variant={variantData?.variant} />
    </div>
  );
};

const FullContent = ({ variant }: { variant: VariantForSummaryStrip }) => {
  const mostSevereConsequence = (
    <VariantConsequence variant={variant} withColour={false} />
  );

  return (
    <>
      <div className={featureStripStyles.section}>
        <span className={featureStripStyles.featureSummaryStripLabel}>
          Variant
        </span>
        <span className={featureStripStyles.featureNameEmphasized}>
          {variant.name}
        </span>
        <span className={styles.variantType}>{variant.allele_type.value}</span>
      </div>
      {mostSevereConsequence && (
        <div className={featureStripStyles.section}>
          <span className={featureStripStyles.featureSummaryStripLabel}>
            Most severe consequence
          </span>
          {mostSevereConsequence}
        </div>
      )}
      <div className={featureStripStyles.section}>
        <VariantAllelesSequences alleles={variant.alleles} />
      </div>
      <div className={featureStripStyles.section}>
        <VariantLocation variant={variant} />
      </div>
    </>
  );
};

export default forwardRef(VariantSummaryStrip);
