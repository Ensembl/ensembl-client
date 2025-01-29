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

import { interpolateLab, quantize } from 'd3';

import { sortEpigenomes, stringifyDimensionValue } from './sortEpigenomes';

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';

import styles from './EpigenomesSorter.module.css';

type Props = {
  epigenomes: Epigenome[];
  className?: string;
};

/**
 * Add sorting by:
 *  - sex
 *  - life_stage
 *  - organ
 * If the value of a field is an array,
 * join it into a single string and use the whole string
 */

const sortingDimensions = ['sex', 'life_stage', 'organs'];

// colours used as input for generating colour scales
const colors1 = ['#80ccff', '#fcb6b5'];
const colors2 = ['#0399ff', '#b6e1ff'];
const colors3 = ['#024b02', '#cce5cd'];

const EpigenomesSorter = (props: Props) => {
  const { epigenomes } = props;

  const epigenomeLabelsData = transformEpigenomeLabelsData(
    getEpigenomeLabels({ epigenomes })
  );

  return (
    <div className={styles.container}>
      {epigenomeLabelsData.map((labelData, index) => (
        <EpigenomeLabel key={index} data={labelData} />
      ))}
    </div>
  );
};

/**
 * Produces data to render epigenome labels.
 * Returns an array of arrays of label data,
 * where the inner arrays have the same order as the sorting dimensions.
 *
 * TODO:
 *  - pass sorting dimensions as a parameter
 *  - transform the return value such that instead of being an array of three arrays it is an array of triplets
 *  - update function name (getEpigenomeLabelsData)?
 *  - move the function out into its own file?
 */
export const getEpigenomeLabels = ({ epigenomes }: Props) => {
  const sortedEpigenomes = sortEpigenomes({
    epigenomes,
    sortingDimensions
  });

  const labelData = sortingDimensions.map((dimension, index) => {
    const counts = getDistinctEpigenomeCountsForDimension(
      sortedEpigenomes,
      dimension
    );
    const distinctDimensionValues = getDistinctValuesForDimension(
      sortedEpigenomes,
      dimension
    );
    const colorScale = getColorScaleForValues(distinctDimensionValues, index);
    const colorMap = createValuesToColorsMap(
      distinctDimensionValues,
      colorScale
    );

    const accumulator: {
      dimension: string;
      value: Epigenome[string];
      stringifiedValue: string;
      color: string;
    }[] = [];

    for (const item of counts) {
      for (let i = 0; i < item.count; i++) {
        const labelData = {
          dimension,
          value: item.value,
          stringifiedValue: item.stringifiedValue,
          color: colorMap[item.stringifiedValue]
        };
        accumulator.push(labelData);
      }
    }

    return accumulator;
  });

  return labelData;
};

const transformEpigenomeLabelsData = (
  data: ReturnType<typeof getEpigenomeLabels>
) => {
  const result: ReturnType<typeof getEpigenomeLabels>[number][number][][] = []; // FIXME: improve type declaration

  const dataColumn = data[0];

  for (let i = 0; i < dataColumn.length; i++) {
    const labelData: ReturnType<typeof getEpigenomeLabels>[number][number][] =
      [];

    for (const dataPerDimension of data) {
      labelData.push(dataPerDimension[i]);
    }

    result.push(labelData);
  }

  return result;
};

const EpigenomeLabel = ({
  data
}: {
  data: ReturnType<typeof getEpigenomeLabels>[number];
}) => {
  const labelHeight = 40; // FIXME: import the constant

  return (
    <div className={styles.epigenomeLabel}>
      {data.map((item, index) => (
        <div
          key={index}
          className={styles.coloredBlock}
          style={{
            backgroundColor: item.color,
            height: `${labelHeight - 2}px`,
            margin: '1px 0'
          }}
        />
      ))}
    </div>
  );
};

/**
 * The purpose of the below function is to provide data for building the coloured labels.
 *
 * Given a list of epigenomes, and a single metadata dimension,
 * iterate over the epigenomes, and record after how many iterations
 * the value of the dimension changes.
 *
 */

const getDistinctEpigenomeCountsForDimension = (
  epigenomes: Epigenome[],
  dimension: string
) => {
  const result: {
    dimension: string;
    value: Epigenome[string];
    stringifiedValue: string;
    count: number;
  }[] = [];

  for (const epigenome of epigenomes) {
    const value = epigenome[dimension];
    if (!value) {
      continue;
    }

    const stringifiedValue = stringifyDimensionValue(epigenome, dimension);

    const lastItem = result.at(-1);
    if (!lastItem || lastItem.stringifiedValue !== stringifiedValue) {
      result.push({
        dimension,
        value,
        stringifiedValue,
        count: 1
      });
    } else {
      lastItem.count += 1;
    }
  }

  return result;
};

const getColorScaleForValues = (values: string[], order: number) => {
  const inputColors = [colors1, colors2, colors3][order] as [string, string];

  const interpolator = interpolateLab(...inputColors);
  return quantize(interpolator, values.length);
};

const getDistinctValuesForDimension = (
  epigenomes: Epigenome[],
  dimension: string
) => {
  const distinctValues = new Set<string>();

  for (const epigenome of epigenomes) {
    const stringifiedValue = stringifyDimensionValue(epigenome, dimension);
    if (!distinctValues.has(stringifiedValue)) {
      distinctValues.add(stringifiedValue);
    }
  }

  return [...distinctValues];
};

// array of epigenome dimension values and array of colors should have the same length
const createValuesToColorsMap = (values: string[], colors: string[]) => {
  const map: Record<string, string> = {};

  values.forEach((value, index) => {
    map[value] = colors[index];
  });

  return map;
};

export default EpigenomesSorter;
