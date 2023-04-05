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

import { useGbVariantQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import { Spinner } from 'src/content/app/genome-browser/components/drawer/DrawerSpinner';

import { VariantDrawerView } from 'src/content/app/genome-browser/state/drawer/types';

type Props = {
  drawerView: VariantDrawerView;
};

const VariantSummary = (props: Props) => {
  const { variantId } = props.drawerView;
  const { activeGenomeId } = useGenomeBrowserIds();

  const { currentData: variantData, isFetching } = useGbVariantQuery(
    {
      genomeId: activeGenomeId || '',
      variantId // TODO: change this to the appropriate id with which to query variation api
    },
    {
      skip: !activeGenomeId
    }
  );

  if (!activeGenomeId || isFetching) {
    return <Spinner />;
  }

  if (!variantData?.variant) {
    return <div>No data available</div>;
  }

  const { variant } = variantData;

  return (
    <div>
      <span>Variant</span>
      <span>{variant.name}</span>

      <span>Source</span>

      <span>Alleles</span>

      <span>Ancestral</span>

      <span>MAF</span>

      <span>Highest population MAF</span>

      <span>Most severe consequence</span>

      <span>Clinical significance</span>

      <span>CADD</span>

      <span>GERP</span>

      <span>Location</span>

      <span>VCF</span>

      <span>Synonyms</span>
    </div>
  );
};

export default VariantSummary;
