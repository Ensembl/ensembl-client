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

import React, { memo } from 'react';

import { useGbVariantQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import VariantAllelesSequences from './variant-alleles-sequences/VariantAllelesSequences';
import VariantConsequence from './variant-consequence/VariantConsequence';
import VariantLocation from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-location/VariantLocation';
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

  const ancestralAllele = <AncestralAllele variant={variant} />;
  const minorAlleleFrequency = <MinorAlleleFrequency variant={variant} />;
  const highestMAF = <HighestPopulationMAF variant={variant} />;
  const mostSevereConsequence = <VariantConsequence variant={variant} />;
  const clinicalSignificance = <ClinicalSignificance variant={variant} />; // FIXME!
  const caddScores = <CADDScores variant={variant} />;
  const gerpScore = <GERPScore variant={variant} />;

  return (
    <>
      <div className={styles.row}>
        <div className={styles.label}>Variant</div>
        <div className={styles.value}>
          <span className={styles.strong}>{variant.name}</span>
          <span>? no variant type ?</span>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Source</div>
        <div className={styles.value}>
          <VariantDB variant={variant} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Alleles</div>
        <div className={styles.value}>
          <VariantAllelesSequences alleles={variant.alleles} />
        </div>
      </div>

      {ancestralAllele && (
        <div className={styles.row}>
          <div className={styles.label}>Ancestral</div>
          <div className={styles.value}>{ancestralAllele}</div>
        </div>
      )}

      {minorAlleleFrequency && (
        <div className={styles.row}>
          <div className={styles.label}>MAF</div>
          <div className={styles.value}>{minorAlleleFrequency}</div>
        </div>
      )}

      {highestMAF && (
        <div className={styles.row}>
          <div className={styles.label}>Highest population MAF</div>
          <div className={styles.value}>{highestMAF}</div>
        </div>
      )}

      {mostSevereConsequence && (
        <div className={styles.row}>
          <div className={styles.label}>Most severe consequence</div>
          <div className={styles.value}>{mostSevereConsequence}</div>
        </div>
      )}

      {clinicalSignificance && (
        <div className={styles.row}>
          <div className={styles.label}>Clinical significance</div>
          <div className={styles.value}>{clinicalSignificance}</div>
        </div>
      )}

      {caddScores && (
        <div className={styles.row}>
          <div className={styles.label}>CADD</div>
          <div className={styles.value}>{caddScores}</div>
        </div>
      )}

      {gerpScore && (
        <div className={styles.row}>
          <div className={styles.label}>GERP</div>
          <div className={styles.value}>{gerpScore}</div>
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.label}>Location</div>
        <div className={styles.value}>
          <VariantLocation variant={variant} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>VCF</div>
        <div className={styles.value}></div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Synonyms</div>
      </div>
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
        <span className={styles.light}>Release {primary_source.release}</span>
      )}
    </div>
  );
};

const AncestralAllele = (props: { variant: VariantQueryResult['variant'] }) => {
  const ancestralAllelePrediction = props.variant.prediction_results.find(
    (prediction) => {
      return prediction.analysis_method.tool === 'AncestralAllele';
    }
  );

  if (!ancestralAllelePrediction) {
    return null; // shouldn't happen
  }

  return <span>{ancestralAllelePrediction.result}</span>;
};

// There could be 1-20 VariantAlleles and 0-50 PopulationAlleleFrequency records for each
const MinorAlleleFrequency = memo(
  (props: { variant: VariantQueryResult['variant'] }) => {
    let minorAlleleFrequency:
      | { sequence: string; frequency: number }
      | undefined;

    for (const variantAllele of props.variant.alleles) {
      for (const populationFrequency of variantAllele.population_frequencies) {
        if (populationFrequency.is_minor_allele) {
          minorAlleleFrequency = {
            sequence: variantAllele.allele_sequence,
            frequency: populationFrequency.allele_frequency
          };
          break;
        }
      }
    }

    if (!minorAlleleFrequency) {
      return null;
    }

    return (
      <span>
        {minorAlleleFrequency.frequency} ({minorAlleleFrequency.sequence})
      </span>
    );
  }
);

// There could be 1-20  VariantAlleles and 0-50 PopulationAlleleFrequency records for each
const HighestPopulationMAF = memo(
  (props: { variant: VariantQueryResult['variant'] }) => {
    let highestMAF: { sequence: string; frequency: number } | undefined;

    for (const variantAllele of props.variant.alleles) {
      for (const populationFrequency of variantAllele.population_frequencies) {
        if (populationFrequency.is_hpmaf) {
          highestMAF = {
            sequence: variantAllele.allele_sequence,
            frequency: populationFrequency.allele_frequency
          };
          break;
        }
      }
    }

    if (!highestMAF) {
      return null;
    }

    return <span>{highestMAF.frequency}</span>;
  }
);

const ClinicalSignificance = memo(
  (props: { variant: VariantQueryResult['variant'] }) => {
    const clinicalSignificanceData: {
      sequence: string;
      significance: string;
    }[] = [];

    for (const variantAllele of props.variant.alleles) {
      for (const phenotypeAssertion of variantAllele.phenotype_assertions) {
        for (const evidence of phenotypeAssertion.evidence) {
          for (const attribute of evidence.attributes) {
            if (attribute.type === 'clin_sig') {
              clinicalSignificanceData.push({
                sequence: variantAllele.allele_sequence,
                significance: attribute.value
              });
            }
          }
        }
      }
    }

    if (!clinicalSignificanceData.length) {
      return null;
    }

    return (
      <>
        {clinicalSignificanceData.map((data, index) => (
          <span key={index}>
            {data.significance} ({data.sequence})
          </span>
        ))}
      </>
    );
  }
);

const CADDScores = memo((props: { variant: VariantQueryResult['variant'] }) => {
  const caddScores: {
    sequence: string;
    score: number;
  }[] = [];

  for (const variantAllele of props.variant.alleles) {
    for (const predictionResult of variantAllele.prediction_results) {
      if (
        predictionResult.analysis_method.tool === 'CADD' &&
        predictionResult.score
      ) {
        caddScores.push({
          sequence: variantAllele.allele_sequence,
          score: predictionResult.score
        });
      }
    }
  }

  if (!caddScores.length) {
    return null;
  }

  const caddScoreString = caddScores
    .map((data) => `${data.sequence}:${data.score}`)
    .join(', ');

  return <span>{caddScoreString}</span>;
});

const GERPScore = memo((props: { variant: VariantQueryResult['variant'] }) => {
  const gerpPrediction = props.variant.prediction_results.find(
    (prediction) => prediction.analysis_method.tool === 'GERP'
  );

  if (!gerpPrediction) {
    return null;
  }

  return <span>{gerpPrediction.score}</span>;
});

export default VariantSummary;
