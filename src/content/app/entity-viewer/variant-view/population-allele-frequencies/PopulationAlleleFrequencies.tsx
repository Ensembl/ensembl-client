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

import { useEffect, useState } from 'react';

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
  const [isGlobalAlleleFreqAccordionOpen, setIsGlobalAlleleFreqAccordionOpen] =
    useState(true);
  const [populationFreqAccordionState, setPopulationFreqAccordionState] =
    useState<Record<string, boolean>>({});

  const { currentData, isLoading } = usePopulationAlleleFrequenciesData({
    genomeId,
    variantId,
    activeAlleleId
  });

  useEffect(() => {
    const groups = currentData?.populationGroups;

    if (
      groups?.length &&
      Object.keys(populationFreqAccordionState).length === 0
    ) {
      const initialState = Object.fromEntries(
        groups.map((group, index) => [group, index === 0])
      );
      setPopulationFreqAccordionState(initialState);
    }
  }, [currentData?.populationGroups]);

  const frequencyCount = (
    freqs: PreparedPopulationFrequencyData[],
    group: string
  ) => {
    return freqs.filter((freq) => freq.display_group_name === group).length;
  };

  const toggleGlobalAlleleFreqAccordion = () => {
    setIsGlobalAlleleFreqAccordionOpen(!isGlobalAlleleFreqAccordionOpen);
  };

  const togglePopulationFreqAccordion = (group: string) => {
    setPopulationFreqAccordionState((prevState) => ({
      ...prevState,
      [group]: !prevState[group]
    }));
  };

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

  if (currentAllele && currentAllele.populationFrequencies.length === 0) {
    const globalFrequencyCount = populationGroups.reduce((count, group) => {
      return (
        count + frequencyCount(currentAllele.globalAlleleFrequencies, group)
      );
    }, 0);

    return (
      <Panel header={panelHeader}>
        <div className={styles.container}>
          <div className={styles.accordionTitleWrapper}>
            <ShowHide
              onClick={toggleGlobalAlleleFreqAccordion}
              isExpanded={isGlobalAlleleFreqAccordionOpen}
              label={
                <span>
                  <span className={styles.accordionHeader}>
                    Frequency data for individual populations
                  </span>
                  ({globalFrequencyCount})
                </span>
              }
            />
          </div>
          {isGlobalAlleleFreqAccordionOpen && (
            <GlobalFrequenciesTable
              allele={currentAllele}
              populationGroups={populationGroups}
            />
          )}
        </div>
      </Panel>
    );
  }

  return (
    <Panel header={panelHeader}>
      <div className={styles.container}>
        {populationGroups.map((group) => (
          <div key={group} className={styles.accordionWrapper}>
            <div className={styles.accordionTitleWrapper}>
              <div className={styles.accordionHeaderContainer}>
                <ShowHide
                  onClick={() => togglePopulationFreqAccordion(group)}
                  isExpanded={populationFreqAccordionState[group]}
                  label={
                    <span>
                      <span className={styles.accordionHeader}>{group}</span>(
                      {frequencyCount(
                        currentAllele.populationFrequencies,
                        group
                      )}
                      )
                    </span>
                  }
                />
              </div>
              <GlobalFrequenciesHeader
                allele={currentAllele}
                currentPopulationGroup={group}
              />
            </div>
            {populationFreqAccordionState[group] && (
              <PopulationFrequenciesTable
                allele={currentAllele}
                currentPopulationGroup={group}
              />
            )}
          </div>
        ))}
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

const GlobalFrequenciesTable = (props: {
  allele: NonNullable<PopulationFrequencyData['allele']>;
  populationGroups: string[];
}) => {
  const { allele, populationGroups } = props;
  const smallNumberFormatter = createSmallNumberFormatter();

  const alleleGlobalFreqs = allele.globalAlleleFrequencies;

  return (
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
          const alleleGlobalFreq = alleleGlobalFreqs.find(
            (popFreq) => popFreq.display_group_name === group
          );

          return (
            <tr key={group}>
              <td>{group}</td>
              <td>
                {alleleGlobalFreq ? (
                  <CircleDiagram
                    alleleFrequency={alleleGlobalFreq.allele_frequency}
                  />
                ) : null}
              </td>
              <td>
                {alleleGlobalFreq
                  ? smallNumberFormatter.format(
                      alleleGlobalFreq.allele_frequency
                    )
                  : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
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
      {smallNumberFormatter.format(alleleGlobalFreq.allele_frequency)}
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

export default PopulationAlleleFrequencies;
