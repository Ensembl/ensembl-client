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

import { useState, useEffect } from 'react';
import classNames from 'classnames';

import { createSmallNumberFormatter } from 'src/shared/helpers/formatters/numberFormatter';

import usePopulationAlleleFrequenciesData from './usePopulationAlleleFrequenciesData';

import Panel from 'src/shared/components/panel/Panel';
import { CircularProportionIndicator } from 'src/shared/components/proportion-indicator/CircularProportionIndicator';
import { Table, ColumnHead } from 'src/shared/components/table';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './PopulationAlleleFrequencies.module.css';

type Props = {
  genomeId: string;
  variantId: string;
  activeAlleleId: string;
};

type PopulationFrequencyData = NonNullable<
  ReturnType<typeof usePopulationAlleleFrequenciesData>['currentData']
>;

const PopulationAlleleFrequencies = (props: Props) => {
  const { genomeId, variantId, activeAlleleId } = props;
  const [populationGroup, setPopulationGroup] = useState('');

  const { currentData, isLoading } = usePopulationAlleleFrequenciesData({
    genomeId,
    variantId,
    activeAlleleId
  });

  useEffect(() => {
    if (currentData?.populationGroups && !populationGroup) {
      setPopulationGroup(currentData.populationGroups[0]);
    }
  }, [currentData?.populationGroups]);

  if (isLoading) {
    const panelHeader = (
      <div className={styles.panelHeader}>
        <span className={styles.alleleFreqTitle}>Allele frequency</span>
      </div>
    );

    return (
      <Panel header={panelHeader}>
        <div className={styles.container}>
          <CircleLoader />
        </div>
      </Panel>
    );
  } else if (!currentData) {
    return null;
  }

  const { variant, allele: currentAllele, populationGroups } = currentData;

  const panelHeader = (
    <PanelHeader
      variant={variant}
      populationGroups={populationGroups}
      currentPopulationGroup={populationGroup}
      onPopulationGroupChange={setPopulationGroup}
    />
  );

  if (!currentAllele || !currentAllele.populationFrequencies.length) {
    return (
      <Panel header={panelHeader}>
        <div className={styles.container}>No data</div>
      </Panel>
    );
  }

  return (
    <Panel header={panelHeader}>
      <div className={styles.container}>
        <GlobalFrequenciesTable
          allele={currentAllele}
          currentPopulationGroup={populationGroup}
        />
        <PopulationFrequenciesTable
          allele={currentAllele}
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
  allele: NonNullable<PopulationFrequencyData['allele']>;
  currentPopulationGroup: string;
}) => {
  const { allele, currentPopulationGroup } = props;

  const alleleGlobalFreqs = allele.globalAlleleFrequencies;

  const alleleGlobalFreq = alleleGlobalFreqs.find(
    (popFreq) => popFreq.display_group_name === currentPopulationGroup
  );

  const tableClasses = classNames(styles.table, styles.tablePlain);
  const smallNumberFormatter = createSmallNumberFormatter();

  const diagram = alleleGlobalFreq ? (
    <CircleDiagram alleleFrequency={alleleGlobalFreq.allele_frequency} />
  ) : null;
  const formattedFreq = alleleGlobalFreq
    ? smallNumberFormatter.format(alleleGlobalFreq.allele_frequency)
    : null;

  return (
    <table className={tableClasses}>
      <tbody>
        <tr>
          <td>Global</td>
          <td>{diagram}</td>
          <td>{formattedFreq}</td>
        </tr>
      </tbody>
    </table>
  );
};

const PopulationFrequenciesTable = (props: {
  allele: NonNullable<PopulationFrequencyData['allele']>;
  currentPopulationGroup: string;
}) => {
  const { allele, currentPopulationGroup } = props;
  const smallNumberFormatter = createSmallNumberFormatter();

  const allelePopFreqs = allele.populationFrequencies;

  const filteredAllelePopFreqs = allelePopFreqs.filter(
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
        {filteredAllelePopFreqs.map((popFreq, index) => (
          <tr key={index}>
            <td>{popFreq.description}</td>
            <td>
              <CircleDiagram alleleFrequency={popFreq.allele_frequency} />
            </td>
            <td>{smallNumberFormatter.format(popFreq.allele_frequency)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const CircleDiagram = (props: { alleleFrequency: number }) => {
  const percentage = props.alleleFrequency * 100;

  return <CircularProportionIndicator value={percentage} />;
};

export default PopulationAlleleFrequencies;
