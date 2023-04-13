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
import classNames from 'classnames';

import { useGbVariantQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import prepareVariantSummaryData from './prepareVariantSummaryData';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import VariantAllelesSequences from './variant-alleles-sequences/VariantAllelesSequences';
import VariantConsequence from './variant-consequence/VariantConsequence';
import VariantLocation from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-location/VariantLocation';
import VariantVCF, { getVCFStringParts } from './variant-vcf/VariantVCF';
import Copy from 'src/shared/components/copy/Copy';
import { Spinner } from 'src/content/app/genome-browser/components/drawer/DrawerSpinner';

import type { VariantDrawerView } from 'src/content/app/genome-browser/state/drawer/types';
import type { VariantQueryResult } from 'src/content/app/genome-browser/state/api/queries/variantQuery';

import styles from './VariantSummary.scss';

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
  const preparedSummaryData = prepareVariantSummaryData(variant);
  const vcfStringParts = getVCFStringParts(variant);

  return (
    <>
      <div className={styles.row}>
        <div className={styles.label}>Variant</div>
        <div className={styles.value}>
          <span className={styles.strong}>{variant.name}</span>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Source</div>
        <div className={styles.value}>
          <VariantDB variant={variant} />
        </div>
      </div>

      <div className={classNames(styles.row, styles.newRowGroup)}>
        <div className={styles.label}>Alleles</div>
        <div className={styles.value}>
          <VariantAllelesSequences alleles={variant.alleles} />
        </div>
      </div>

      {preparedSummaryData.ancestralAllele && (
        <div className={styles.row}>
          <div className={styles.label}>Ancestral</div>
          <div className={styles.value}>
            {preparedSummaryData.ancestralAllele}
          </div>
        </div>
      )}

      {preparedSummaryData.minorAlleleFrequency && (
        <div className={classNames(styles.row, styles.newRowGroup)}>
          <div className={styles.label}>MAF</div>
          <div className={styles.value}>
            {preparedSummaryData.minorAlleleFrequency.frequency} (
            {preparedSummaryData.minorAlleleFrequency.sequence})
          </div>
        </div>
      )}

      {preparedSummaryData.highestMAF && (
        <div className={styles.row}>
          <div className={styles.label}>Highest population MAF</div>
          <div className={styles.value}>
            {preparedSummaryData.highestMAF.frequency}
          </div>
        </div>
      )}

      {preparedSummaryData.mostSevereConsequence && (
        <div className={classNames(styles.row, styles.newRowGroup)}>
          <div className={styles.label}>Most severe consequence</div>
          <div className={classNames(styles.value, styles.alignBottom)}>
            <VariantConsequence variant={variant} />
          </div>
        </div>
      )}

      {!!preparedSummaryData.clinicalSignificance.length && (
        <div className={classNames(styles.row, styles.newRowGroup)}>
          <div className={styles.label}>Clinical significance</div>
          <div className={styles.value}>
            <ClinicalSignificance
              data={preparedSummaryData.clinicalSignificance}
            />
          </div>
        </div>
      )}

      {!!preparedSummaryData.caddScores.length && (
        <div className={classNames(styles.row, styles.newRowGroup)}>
          <div className={styles.label}>CADD</div>
          <div className={styles.value}>
            <CADDScores data={preparedSummaryData.caddScores} />
          </div>
        </div>
      )}

      {preparedSummaryData.gerpScore && (
        <div className={styles.row}>
          <div className={styles.label}>GERP</div>
          <div className={styles.value}>{preparedSummaryData.gerpScore}</div>
        </div>
      )}

      <div className={classNames(styles.row, styles.newRowGroup)}>
        <div className={styles.label}>Location</div>
        <div className={styles.value}>
          <VariantLocation variant={variant} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>VCF</div>
        <div className={styles.value}>
          <VariantVCF vcfStringParts={vcfStringParts} />
          <Copy
            value={vcfStringParts.vcfString}
            className={styles.withSpaceLeft}
          />
        </div>
      </div>

      {!!variant.alternative_names.length && (
        <div className={styles.row}>
          <div className={styles.label}>Synonyms</div>
          <div className={styles.value}>
            <VariantSynonyms variant={variant} />
          </div>
        </div>
      )}
    </>
  );
};

const VariantDB = (props: { variant: VariantQueryResult['variant'] }) => {
  const { primary_source } = props.variant;

  let dbElement;

  if (!primary_source.url) {
    dbElement = <span>{primary_source.name}</span>;
  } else {
    dbElement = (
      <ExternalLink to={primary_source.url} linkText={primary_source.name} />
    );
  }

  return (
    <div>
      {dbElement}
      {primary_source.release && (
        <span className={classNames(styles.light, styles.withSpaceLeft)}>
          Release {primary_source.release}
        </span>
      )}
    </div>
  );
};

const ClinicalSignificance = (props: {
  data: { sequence: string; significance: string }[];
}) => {
  return (
    <div className={styles.clinicalSignificance}>
      {props.data.map((data, index) => (
        <span key={index}>
          {data.significance} ({data.sequence})
        </span>
      ))}
    </div>
  );
};

const CADDScores = (props: { data: { sequence: string; score: number }[] }) => {
  const caddScoreString = props.data
    .map((data) => `${data.sequence}:${data.score}`)
    .join(', ');

  return <span>{caddScoreString}</span>;
};

// FIXME: links should be grouped by sources. Does ExternalReference component do this?
const VariantSynonyms = (props: { variant: VariantQueryResult['variant'] }) => {
  const xrefElements = props.variant.alternative_names.map(
    (reference, index) => {
      if (reference.url) {
        return (
          <ExternalLink
            key={index}
            to={reference.url}
            linkText={reference.name}
          />
        );
      } else {
        return <span key={index}>{reference.name}</span>;
      }
    }
  );

  return <>{xrefElements}</>;
};

export default VariantSummary;
