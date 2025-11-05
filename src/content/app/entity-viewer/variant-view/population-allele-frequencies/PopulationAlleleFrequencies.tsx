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

import { createSmallNumberFormatter } from 'src/shared/helpers/formatters/numberFormatter';

import usePopulationAlleleFrequenciesData, {
  PreparedPopulationFrequencyData
} from './usePopulationAlleleFrequenciesData';

import Panel from 'src/shared/components/panel/Panel';
import { CircularProportionIndicator } from 'src/shared/components/proportion-indicator/CircularProportionIndicator';
import { Table, ColumnHead } from 'src/shared/components/table';
import { CircleLoader } from 'src/shared/components/loader';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';

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

  const frequencyCount = (
    freqs:
      | PreparedPopulationFrequencyData[]
      | PreparedPopulationFrequencyData[],
    group: string
  ) => {
    return freqs.filter((freq) => freq.display_group_name === group).length;
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

  if (!currentAllele || !currentAllele.globalAlleleFrequencies.length) {
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
          <Accordion preExpanded={['global']} className={styles.accordion}>
            <AccordionItem uuid={'global'}>
              <AccordionItemHeading className={styles.accordionHeading}>
                <AccordionItemButton className={styles.accordionButton}>
                  <span>Frequency data for Individual populations</span>
                  <span className={styles.frequencyCount}>
                    ({globalFrequencyCount})
                  </span>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className={styles.accordionItemContent}>
                <GlobalFrequenciesTable
                  allele={currentAllele}
                  populationGroups={populationGroups}
                />
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
      </Panel>
    );
  }

  return (
    <Panel header={panelHeader}>
      <div className={styles.container}>
        <Accordion
          preExpanded={populationGroups}
          className={styles.accordion}
          allowMultipleExpanded={true}
        >
          {populationGroups.map((group) => (
            <AccordionItem
              uuid={group}
              key={group}
              className={styles.accordionItem}
            >
              <div className={styles.accordionTitleContainer}>
                <div className={styles.accordionHeadingContainer}>
                  <AccordionItemHeading className={styles.accordionHeading}>
                    <AccordionItemButton className={styles.accordionButton}>
                      <span>{group}</span>
                      <span className={styles.frequencyCount}>
                        (
                        {frequencyCount(
                          currentAllele.populationFrequencies,
                          group
                        )}
                        )
                      </span>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                </div>
                <GlobalFrequenciesHeader
                  allele={currentAllele}
                  currentPopulationGroup={group}
                />
              </div>
              <AccordionItemPanel className={styles.accordionItemContent}>
                <PopulationFrequenciesTable
                  allele={currentAllele}
                  currentPopulationGroup={group}
                />
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>
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
            <span className={styles.alleleColumnTitle}>Alt Allele</span>
          </ColumnHead>
          <th />
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
            <span className={styles.alleleColumnTitle}>Alt Allele</span>
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
