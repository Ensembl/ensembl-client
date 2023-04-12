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

import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import VariantConsequence from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-consequence/VariantConsequence';
import VariantAllelesSequences from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-alleles-sequences/VariantAllelesSequences';
import VariantLocation from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-location/VariantLocation';

import { useGbVariantQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import type { FocusVariant } from 'src/shared/types/focus-object/focusObjectTypes';
import type { Variant } from 'src/shared/types/variation-api/variant';

import styles from './FeatureSummaryStrip.scss';

const MEDIUM_WIDTH = 720;

enum Display {
  FULL = 'full',
  MINIMAL = 'minimal'
}

const VariantSummaryWrapper = (props: {
  variant: FocusVariant;
  isGhosted?: boolean;
}) => {
  const [display, setDisplay] = useState(Display.MINIMAL);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver({ ref: containerRef });

  const { genome_id: genomeId, object_id: variantId } = props.variant;
  const { currentData: variantData } = useGbVariantQuery({
    genomeId,
    variantId
  });

  useEffect(() => {
    if (containerWidth < MEDIUM_WIDTH) {
      display !== Display.MINIMAL && setDisplay(Display.MINIMAL);
    } else {
      display !== Display.FULL && setDisplay(Display.FULL);
    }
  }, [containerWidth]);

  if (!variantData) {
    return null;
  }

  return (
    <div className={styles.featureSummaryStripWrapper} ref={containerRef}>
      <VariantSummaryStrip
        {...props}
        display={display}
        variant={variantData.variant}
      />
    </div>
  );
};

const VariantSummaryStrip = (props: {
  variant: Variant;
  isGhosted?: boolean;
  display: Display;
}) => {
  const { variant, isGhosted, display } = props;
  const stripClasses = classNames(styles.featureSummaryStrip, {
    [styles.featureSummaryStripGhosted]: isGhosted
  });

  let content;

  if (display === Display.MINIMAL) {
    content = <MinimalContent variant={variant} />;
  } else {
    content = <FullContent variant={variant} />;
  }

  return <div className={stripClasses}>{content}</div>;
};

const MinimalContent = ({ variant }: { variant: Variant }) => (
  <>
    <span className={styles.featureSummaryStripLabel}>Variant</span>
    <span className={styles.featureNameEmphasized}>{variant.name}</span>
  </>
);

const FullContent = ({ variant }: { variant: Variant }) => {
  const mostSevereConsequence = <VariantConsequence variant={variant} />;

  return (
    <>
      <MinimalContent variant={variant} />
      {mostSevereConsequence && (
        <div>
          <span className={styles.featureSummaryStripLabel}>
            Most severe consequence
          </span>
          {mostSevereConsequence}
        </div>
      )}
      <div>
        <VariantAllelesSequences alleles={variant.alleles} />
      </div>
      <div>
        <VariantLocation variant={variant} />
      </div>
    </>
  );
};

export default VariantSummaryWrapper;
