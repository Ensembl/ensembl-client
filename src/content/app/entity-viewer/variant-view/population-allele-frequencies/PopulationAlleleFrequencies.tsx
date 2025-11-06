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

import { useState } from 'react';

import { createSmallNumberFormatter } from 'src/shared/helpers/formatters/numberFormatter';

import usePopulationAlleleFrequenciesData, {
  PreparedPopulationFrequencyData
} from './usePopulationAlleleFrequenciesData';

import Panel from 'src/shared/components/panel/Panel';
import { CircularProportionIndicator } from 'src/shared/components/proportion-indicator/CircularProportionIndicator';
import { Table, ColumnHead } from 'src/shared/components/table';
import { CircleLoader } from 'src/shared/components/loader';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

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

  const { currentData, isLoading } = usePopulationAlleleFrequenciesData({
    genomeId,
    variantId,
    activeAlleleId
  });

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

  const panelHeader = <PanelHeader variant={variant} />;

  if (
    !currentAllele ||
    !currentAllele.globalAlleleFrequencies.length ||
    !populationGroups.length
  ) {
    return (
      <Panel header={panelHeader}>
        <div className={styles.container}>No data</div>
      </Panel>
    );
  }

  // using the `key` properties for components below to re-create them from scratch when allele changes
  // (this will reset the expanded population frequency sections in these components)
  if (currentAllele && currentAllele.populationFrequencies.length === 0) {
    return (
      <OnlyGlobalFrequencies
        key={currentAllele.alleleId}
        variant={variant}
        allele={currentAllele}
        populationGroups={populationGroups}
      />
    );
  } else {
    return (
      <PopulationAndGlobalFrequencies
        key={currentAllele.alleleId}
        variant={variant}
        allele={currentAllele}
        populationGroups={populationGroups}
      />
    );
  }
};

const OnlyGlobalFrequencies = ({
  variant,
  populationGroups,
  allele
}: {
  variant: PopulationFrequencyData['variant'];
  populationGroups: string[];
  allele: PopulationFrequencyData['allele'];
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const globalAlleleFrequencies = allele.globalAlleleFrequencies;
  const globalFrequenciesCount = getGlobalFrequenciesCount({
    populationGroups,
    allele
  });

  const smallNumberFormatter = createSmallNumberFormatter();

  return (
    <Panel header={<PanelHeader variant={variant} />}>
      <div className={styles.container}>
        <div className={styles.accordionTitleWrapper}>
          <ShowHide
            onClick={toggleExpanded}
            isExpanded={isExpanded}
            label={
              <span>
                <span className={styles.accordionHeader}>
                  Frequency data for individual populations
                </span>
                {globalFrequenciesCount}
              </span>
            }
          />
        </div>
        {isExpanded && (
          <Table className={styles.table}>
            <thead>
              <tr>
                <ColumnHead>Population</ColumnHead>
                <ColumnHead></ColumnHead>
                <ColumnHead>
                  <span className={styles.alleleColumnTitle}>Allele</span>
                </ColumnHead>
              </tr>
            </thead>
            <tbody>
              {populationGroups.map((group) => {
                const globalAlleleFrequency = globalAlleleFrequencies.find(
                  (popFreq) => popFreq.display_group_name === group
                );
                if (!globalAlleleFrequency) {
                  return null;
                }

                return (
                  <tr key={group}>
                    <td>{group}</td>
                    <td>
                      <CircleDiagram
                        alleleFrequency={globalAlleleFrequency.allele_frequency}
                      />
                    </td>
                    <td>
                      {smallNumberFormatter.format(
                        globalAlleleFrequency.allele_frequency
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </Panel>
  );
};

const PopulationAndGlobalFrequencies = ({
  variant,
  populationGroups,
  allele
}: {
  variant: PopulationFrequencyData['variant'];
  populationGroups: string[];
  allele: PopulationFrequencyData['allele'];
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0])
  );

  const toggleSection = (sectionIndex: number) => {
    const updatedSections = new Set(expandedSections);
    if (expandedSections.has(sectionIndex)) {
      updatedSections.delete(sectionIndex);
      setExpandedSections(updatedSections);
    } else {
      updatedSections.add(sectionIndex);
      setExpandedSections(updatedSections);
    }
  };

  return (
    <Panel header={<PanelHeader variant={variant} />}>
      <div className={styles.container}>
        {populationGroups.map((group, index) => {
          const isSectionExpanded = expandedSections.has(index);

          return (
            <div key={group} className={styles.accordionWrapper}>
              <div className={styles.accordionTitleWrapper}>
                <ShowHide
                  className={styles.showHide}
                  onClick={() => toggleSection(index)}
                  isExpanded={expandedSections.has(index)}
                  label={
                    <span>
                      <span className={styles.accordionHeader}>{group}</span>
                      {getPopulationFrequenciesCount({
                        populationFrequencies: allele.populationFrequencies,
                        group
                      })}
                    </span>
                  }
                />
                <GlobalFrequenciesHeader
                  allele={allele}
                  currentPopulationGroup={group}
                />
              </div>
              {isSectionExpanded && (
                <PopulationFrequenciesTable
                  allele={allele}
                  currentPopulationGroup={group}
                />
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const PanelHeader = (props: {
  variant: PopulationFrequencyData['variant'];
}) => {
  const { variant } = props;

  return (
    <div className={styles.panelHeader}>
      <span className={styles.variantName}>{variant.name}</span>
      <span className={styles.variantType}>{variant.allele_type.value}</span>
      <span className={styles.colonSeparator}>:</span>
      <span className={styles.alleleFreqTitle}>Allele frequency</span>
    </div>
  );
};

const GlobalFrequenciesHeader = (props: {
  allele: NonNullable<PopulationFrequencyData['allele']>;
  currentPopulationGroup: string;
}) => {
  const { allele, currentPopulationGroup } = props;

  const alleleGlobalFreqs = allele.globalAlleleFrequencies;
  const alleleGlobalFreq = alleleGlobalFreqs.find(
    (popFreq) => popFreq.display_group_name === currentPopulationGroup
  );
  if (!alleleGlobalFreq) {
    return null;
  }
  const smallNumberFormatter = createSmallNumberFormatter();

  return (
    <div className={styles.globalFrequencyHeader}>
      <span>Global</span>
      <CircleDiagram alleleFrequency={alleleGlobalFreq.allele_frequency} />
      <span>
        {smallNumberFormatter.format(alleleGlobalFreq.allele_frequency)}
      </span>
    </div>
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

  return filteredAllelePopFreqs.length ? (
    <Table className={styles.table}>
      <thead>
        <tr>
          <ColumnHead>Population</ColumnHead>
          <ColumnHead></ColumnHead>
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
  ) : null;
};

const CircleDiagram = (props: { alleleFrequency: number }) => {
  const percentage = props.alleleFrequency * 100;

  return <CircularProportionIndicator value={percentage} />;
};

const getGlobalFrequenciesCount = ({
  populationGroups,
  allele
}: {
  populationGroups: string[];
  allele: PopulationFrequencyData['allele'];
}) => {
  return populationGroups.reduce((total, group) => {
    return (
      total +
      getPopulationFrequenciesCount({
        populationFrequencies: allele.globalAlleleFrequencies,
        group
      })
    );
  }, 0);
};

const getPopulationFrequenciesCount = ({
  populationFrequencies,
  group
}: {
  populationFrequencies: PreparedPopulationFrequencyData[];
  group: string;
}) => {
  return populationFrequencies.filter(
    (freq) => freq.display_group_name === group
  ).length;
};

export default PopulationAlleleFrequencies;
