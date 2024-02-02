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

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import usePopulationAlleleFrequenciesData, {
  type PreparedPopulationFrequencyData
} from './usePopulationAlleleFrequenciesData';

import Panel from 'src/shared/components/panel/Panel';
import { CircularProportionIndicator } from 'src/shared/components/proportion-indicator/CircularProportionIndicator';
import { Table, ColumnHead } from 'src/shared/components/table';

import styles from './PopulationAlleleFrequencies.module.css';

type Props = {
  genomeId: string;
  variantId: string;
  activeAlleleId: string;
};

/**
 * TODO:
 * - Figure out how to store the current view in redux
 */

type PopulationFrequencyData = NonNullable<
  ReturnType<typeof usePopulationAlleleFrequenciesData>['currentData']
>;

const PopulationAlleleFrequencies = (props: Props) => {
  const { genomeId, variantId, activeAlleleId } = props;
  const [populationGroup, setPopulationGroup] = useState('');

  const { currentData } = usePopulationAlleleFrequenciesData({
    genomeId,
    variantId,
    activeAlleleId
  });

  useEffect(() => {
    if (currentData?.populationGroups && !populationGroup) {
      setPopulationGroup(currentData.populationGroups[0]);
    }
  }, [currentData?.populationGroups]);

  if (!currentData) {
    return null;
  }

  const { variant, referenceAllele, altAllele, populationGroups } = currentData;

  const panelHeader = (
    <PanelHeader
      variant={variant}
      populationGroups={populationGroups}
      currentPopulationGroup={populationGroup}
      onPopulationGroupChange={setPopulationGroup}
    />
  );

  return (
    <Panel header={panelHeader}>
      <div className={styles.container}>
        <GlobalFrequenciesTable
          referenceAllele={referenceAllele}
          altAllele={altAllele}
          currentPopulationGroup={populationGroup}
        />
        <PopulationFrequenciesTable
          referenceAllele={referenceAllele}
          altAllele={altAllele}
          currentPopulationGroup={populationGroup}
        />
      </div>
    </Panel>
  );
};

const PanelHeader = (props: {
  variant: PopulationFrequencyData['variant'];
  populationGroups: string[];
  currentPopulationGroup: string;
  onPopulationGroupChange: (group: string) => void; // FIXME: this may not be needed; a group may just be a link
}) => {
  const {
    variant,
    populationGroups,
    currentPopulationGroup,
    onPopulationGroupChange
  } = props;

  return (
    <div className={styles.panelHeader}>
      <span className={styles.variantName}>{variant.name}</span>
      <span className={styles.variantType}>{variant.allele_type.value}</span>
      <span className={styles.colonSeparator}>:</span>
      <span className={styles.alleleFreqTitle}>Allele frequency</span>
      <div className={styles.populationGroups}>
        {populationGroups.map((group) => (
          <button
            key={group}
            className={styles.populationGroup}
            onClick={() => onPopulationGroupChange(group)}
            disabled={group === currentPopulationGroup}
          >
            {group}
          </button>
        ))}
      </div>
    </div>
  );
};

const GlobalFrequenciesTable = (props: {
  referenceAllele: PopulationFrequencyData['referenceAllele'];
  altAllele: PopulationFrequencyData['altAllele'];
  currentPopulationGroup: string;
}) => {
  const { referenceAllele, altAllele, currentPopulationGroup } = props;

  const refAlleleGlobalFreqs = referenceAllele.globalAlleleFrequencies;
  const altAlleleGlobalFreqs = altAllele?.globalAlleleFrequencies ?? [];

  const refAlleleGlobalFreq = refAlleleGlobalFreqs.find(
    (popFreq) => popFreq.display_group_name === currentPopulationGroup
  );
  const altAlleleGlobalFreq = altAlleleGlobalFreqs.find(
    (popFreq) => popFreq.display_group_name === currentPopulationGroup
  );

  const tableClasses = classNames(styles.table, styles.tablePlain);

  const diagram =
    refAlleleGlobalFreq && altAlleleGlobalFreq ? (
      <CircleForAltToRefRatio
        refAlleleFrequency={refAlleleGlobalFreq.allele_frequency}
        altAlleleFrequency={altAlleleGlobalFreq.allele_frequency}
      />
    ) : refAlleleGlobalFreq ? (
      <CircleForRefToAllRatio
        refAlleleFrequency={refAlleleGlobalFreq.allele_frequency}
      />
    ) : null;

  return (
    <table className={tableClasses}>
      <tbody>
        <tr>
          <td>Global</td>
          <td>{refAlleleGlobalFreq?.allele_frequency}</td>
          <td>{diagram}</td>
        </tr>
      </tbody>
    </table>
  );
};

const PopulationFrequenciesTable = (props: {
  referenceAllele: PopulationFrequencyData['referenceAllele'];
  altAllele: PopulationFrequencyData['altAllele'];
  currentPopulationGroup: string;
}) => {
  const { referenceAllele, altAllele, currentPopulationGroup } = props;

  if (!altAllele) {
    // this must be the reference allele
    return (
      <ReferenceAlleleFrequenciesTable
        referenceAllele={referenceAllele}
        currentPopulationGroup={currentPopulationGroup}
      />
    );
  }

  const refAllelePopFreqs = referenceAllele.populationFrequencies;
  const altAllelePopFreqs = altAllele?.populationFrequencies ?? [];

  const pairs: Array<{
    refAlleleFreq: PreparedPopulationFrequencyData | null;
    altAlleleFreq: PreparedPopulationFrequencyData;
  }> = [];

  const filteredAltAllelePopFreqs = altAllelePopFreqs.filter(
    (popFreq) => popFreq.display_group_name === currentPopulationGroup
  );

  for (const altAllelePopFreq of filteredAltAllelePopFreqs) {
    const populationName = altAllelePopFreq.name;
    const refAllelePopFreq =
      refAllelePopFreqs.find((popFreq) => popFreq.name === populationName) ??
      null;

    const pair = {
      refAlleleFreq: refAllelePopFreq,
      altAlleleFreq: altAllelePopFreq
    };

    pairs.push(pair);
  }

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          <ColumnHead>Population</ColumnHead>
          <ColumnHead>
            <span className={styles.alleleColumnTitle}>Allele</span>
          </ColumnHead>
          <th />
        </tr>
      </thead>
      <tbody>
        {pairs.map(({ refAlleleFreq, altAlleleFreq }, index) => (
          <tr key={index}>
            <td>{altAlleleFreq.description}</td>
            <td>{altAlleleFreq?.allele_frequency}</td>
            <td>
              {refAlleleFreq && (
                <CircleDiagram
                  alleleFrequency={altAlleleFreq.allele_frequency}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const ReferenceAlleleFrequenciesTable = (props: {
  referenceAllele: PopulationFrequencyData['referenceAllele'];
  currentPopulationGroup: string;
}) => {
  const { referenceAllele, currentPopulationGroup } = props;
  const populationFrequencies = referenceAllele.populationFrequencies.filter(
    (popFreq) => popFreq.display_group_name === currentPopulationGroup
  );

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          <ColumnHead>Population</ColumnHead>
          <ColumnHead>
            <span className={styles.alleleColumnTitle}>Allele</span>
          </ColumnHead>
          <th />
        </tr>
      </thead>
      <tbody>
        {populationFrequencies.map((popFreq, index) => (
          <tr key={index}>
            <td>{popFreq.description}</td>
            <td>{popFreq?.allele_frequency}</td>
            <td>
              {popFreq && (
                <CircleDiagram alleleFrequency={popFreq.allele_frequency} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const CircleForAltToRefRatio = (props: {
  altAlleleFrequency: number;
  refAlleleFrequency: number;
}) => {
  const { altAlleleFrequency, refAlleleFrequency } = props;

  const total = altAlleleFrequency + refAlleleFrequency;
  const altToRefRatio = (altAlleleFrequency / total) * 100; // expressed as percentage

  return <CircularProportionIndicator value={altToRefRatio} />;
};

const CircleForRefToAllRatio = (props: { refAlleleFrequency: number }) => {
  const percentage = props.refAlleleFrequency * 100;

  return <CircularProportionIndicator value={percentage} />;
};

const CircleDiagram = (props: { alleleFrequency: number }) => {
  const percentage = props.alleleFrequency * 100;

  return <CircularProportionIndicator value={percentage} />;
};

export default PopulationAlleleFrequencies;
