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
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getReferenceAndAltAlleles,
  getMostSevereVariantConsequence,
  getVariantGroupLabel
} from 'src/shared/helpers/variantHelpers';

import { useDefaultEntityViewerVariantQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import VariantViewTab from './variant-view-tab/VariantViewTab';

import styles from './VariantViewNavigationPanel.module.css';

type Props = {
  genomeId: string;
  genomeIdForUrl: string;
  variantId: string;
  activeAlleleId: string;
  view: string | null;
};

const VariantViewNavigationPanel = (props: Props) => {
  const { genomeIdForUrl, variantId, activeAlleleId, view } = props;
  const { currentData } = useVariantViewNavigationData(props);
  const navigate = useNavigate();

  if (!currentData) {
    return null;
  }

  const { variant, alleleSequence, isReferenceAlleleActive } = currentData;

  const mostSevereVariantConsequence = getMostSevereVariantConsequence(variant);
  const variantGroupLabel = getVariantGroupLabel(mostSevereVariantConsequence);

  const commonUrlParams = {
    genomeId: genomeIdForUrl,
    variantId,
    alleleId: activeAlleleId
  };

  const onVariantDefaultTabClick = () => {
    const url = urlFor.entityViewerVariant(commonUrlParams);
    navigate(url);
  };

  const onAlleleFrequenciesClick = () => {
    const url = urlFor.entityViewerVariant({
      ...commonUrlParams,
      view: 'allele-frequencies'
    });
    navigate(url);
  };

  const componentClasses = classNames(styles.grid, {
    [styles.withBottomBorder]: !props.view
  });

  return (
    <div className={componentClasses}>
      <VariantViewTab
        viewId="default"
        tabText={variant.name}
        labelText={variantGroupLabel}
        onClick={onVariantDefaultTabClick}
        pressed={view === null}
      />
      <VariantViewTab
        viewId="transcript-consequences"
        tabText="Transcript consequences"
        labelText="Features"
        pillContent="0"
        pressed={false}
        disabled={true}
      />
      <VariantViewTab
        viewId="regulatory-consequences"
        tabText="Regulatory consequences"
        labelText="Features"
        pillContent="0"
        pressed={false}
        disabled={true}
      />
      <VariantViewTab
        viewId="allele-frequencies"
        tabText="Allele frequency"
        labelText={isReferenceAlleleActive ? 'Ref allele' : alleleSequence}
        pillContent="0"
        onClick={onAlleleFrequenciesClick}
        pressed={view === 'allele-frequencies'}
      />
      <VariantViewTab
        viewId="genes"
        tabText="Genes"
        labelText="Features"
        pillContent="0"
        pressed={false}
        disabled={true}
      />
      <VariantViewTab
        viewId="variant-phenotypes"
        tabText="Variant phenotypes"
        labelText="Associations"
        pillContent="0"
        pressed={false}
        disabled={true}
      />
      <VariantViewTab
        viewId="gene-phenotypes"
        tabText="Gene phenotypes"
        labelText="Associations"
        pillContent="0"
        pressed={false}
        disabled={true}
      />
      <VariantViewTab
        viewId="publications"
        tabText="Citations"
        labelText="Publications"
        pillContent="0"
        pressed={false}
        disabled={true}
      />
      <VariantViewTab
        viewId="compara"
        tabText="Comparative genomic context"
        pressed={false}
        unavailable={true}
      />
    </div>
  );
};

const useVariantViewNavigationData = (params: Props) => {
  const { genomeId, variantId, activeAlleleId } = params;

  const { currentData, isLoading, isError } =
    useDefaultEntityViewerVariantQuery({
      genomeId,
      variantId
    });

  if (!currentData) {
    return {
      currentData: null,
      isLoading,
      isError
    };
  }

  const variant = currentData.variant;
  const { referenceAllele } = getReferenceAndAltAlleles(variant.alleles);
  const activeAllele = variant.alleles.find(
    (allele) => allele.urlId === activeAlleleId
  );

  let alleleSequence = activeAllele?.allele_sequence ?? '';
  if (alleleSequence.length > 18) {
    const truncatedSequence = alleleSequence.slice(0, 17);
    const ellipsis = '…';

    alleleSequence = `${truncatedSequence}${ellipsis}`;
  }
  const isReferenceAlleleActive = referenceAllele?.urlId === activeAlleleId;

  return {
    currentData: {
      variant: currentData.variant,
      alleleSequence,
      isReferenceAlleleActive
    },
    isLoading,
    isError
  };
};

export default VariantViewNavigationPanel;
