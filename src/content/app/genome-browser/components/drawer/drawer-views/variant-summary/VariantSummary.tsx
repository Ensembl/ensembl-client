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

import { useAppSelector } from 'src/store';

import { getFocusObjectById } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';

import { useGbVariantQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import prepareVariantSummaryData from './prepareVariantSummaryData';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import VariantAllelesSequences from 'src/shared/components/variant-alleles-sequences/VariantAllelesSequences';
import VariantConsequence from './variant-consequence/VariantConsequence';
import VariantLocation from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-location/VariantLocation';
import VariantVCF from 'src/shared/components/variant-vcf/VariantVCF';
import { Spinner } from 'src/content/app/genome-browser/components/drawer/DrawerSpinner';

import type { FocusVariant } from 'src/shared/types/focus-object/focusObjectTypes';
import type { VariantDrawerView } from 'src/content/app/genome-browser/state/drawer/types';
import type { VariantQueryResult } from 'src/content/app/genome-browser/state/api/queries/variantQuery';

import TickCircleIcon from 'static/icons/icon_tick_circle.svg';

import styles from './VariantSummary.module.css';

type Props = {
  drawerView: VariantDrawerView;
};

const VariantSummary = (props: Props) => {
  const { variantId } = props.drawerView;
  const focusVariant = useAppSelector((state) =>
    getFocusObjectById(state, variantId)
  ) as FocusVariant | null;
  const { activeGenomeId } = useGenomeBrowserIds();

  const { currentData: variantData, isFetching } = useGbVariantQuery(
    {
      genomeId: activeGenomeId || '',
      variantId: focusVariant?.variant_id ?? '' // TODO: change this to the appropriate id with which to query variation api
    },
    {
      skip: !activeGenomeId || !focusVariant
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

  return (
    <>
      <div className={styles.row}>
        <div className={styles.label}>Variant</div>
        <div className={styles.value}>
          <span className={styles.strong}>{variant.name}</span>
          <span className={classNames(styles.light, styles.withSpaceLeft)}>
            {variant.allele_type.value}
          </span>
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
        <div className={classNames(styles.value, styles.variantSequenceBlock)}>
          <VariantAllelesSequences
            alleles={variant.alleles}
            isExpandable={true}
          />
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
            {preparedSummaryData.minorAlleleFrequency.frequency}
            <span
              className={classNames(
                styles.light,
                styles.wrappableSequence,
                styles.alleleSequenceOffset
              )}
            >
              {preparedSummaryData.minorAlleleFrequency.sequence}
            </span>
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

      {!!preparedSummaryData.hasPhenotypeAssociations && (
        <div
          className={classNames(
            styles.row,
            styles.newRowGroup,
            styles.phenotypeAssociations
          )}
        >
          <div className={styles.label}></div>
          <div className={styles.value}>
            <TickCircleIcon /> <span>has phenotype associations</span>
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
        <div className={classNames(styles.value, styles.variantSequenceBlock)}>
          <VariantVCF variant={variant} withCopy={true} />
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

export const VariantDB = (props: {
  variant: VariantQueryResult['variant'];
}) => {
  const { primary_source } = props.variant;

  let dbElement;

  if (!primary_source.url) {
    dbElement = <span>{primary_source.source.name}</span>;
  } else {
    dbElement = (
      <ExternalLink to={primary_source.url}>
        {primary_source.source.name}
      </ExternalLink>
    );
  }

  return (
    <div>
      {dbElement}
      {primary_source.source.release && (
        <span className={classNames(styles.light, styles.sourceRelease)}>
          Release {primary_source.source.release}
        </span>
      )}
    </div>
  );
};

export const CADDScores = (props: {
  data: { sequence: string; score: number }[];
}) => {
  const caddScores = props.data.map((data) => (
    <div className={styles.caddScore} key={data.sequence}>
      <span>{data.score}</span>{' '}
      <span
        className={classNames(
          styles.light,
          styles.wrappableSequence,
          styles.alleleSequenceOffset
        )}
      >
        {data.sequence}
      </span>
    </div>
  ));

  return <div>{caddScores}</div>;
};

// FIXME: links should be grouped by sources. Does ExternalReference component do this?
const VariantSynonyms = (props: { variant: VariantQueryResult['variant'] }) => {
  const xrefElements = props.variant.alternative_names.map(
    (reference, index) => {
      if (reference.url) {
        return (
          <ExternalLink key={index} to={reference.url}>
            {reference.name}
          </ExternalLink>
        );
      } else {
        return <span key={index}>{reference.name}</span>;
      }
    }
  );

  return <>{xrefElements}</>;
};

export default VariantSummary;
