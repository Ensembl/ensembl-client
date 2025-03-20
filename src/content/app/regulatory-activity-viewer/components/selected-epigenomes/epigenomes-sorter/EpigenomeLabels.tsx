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

import useHover from 'src/shared/hooks/useHover';

import { stringifyDimensionValue } from './sortEpigenomes';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';

import styles from './EpigenomeLabels.module.css';

type Props = {
  epigenomes: Epigenome[];
  displayDimensions: string[];
  sortingDimensions: string[];
  className?: string;
};

// colours used as input for generating colour scales
const colors1 = ['#80ccff', '#fcb6b5'];
const colors2 = ['#0399ff', '#b6e1ff'];
const colors3 = ['#024b02', '#cce5cd'];

const EpigenomeLabels = (props: Props) => {
  const { epigenomes, sortingDimensions, displayDimensions } = props;

  const epigenomeLabelsData = getEpigenomeLabels({
    epigenomes,
    sortingDimensions
  });

  return (
    <div className={styles.container}>
      {epigenomeLabelsData.map((labelData, index) => (
        <EpigenomeLabel
          key={index}
          epigenome={epigenomes[index]}
          data={labelData}
          displayDimensions={displayDimensions}
        />
      ))}
    </div>
  );
};

/**
 * Produces data to render epigenome labels.
 *
 * TODO:
 *  - update function name (getEpigenomeLabelsData)?
 *  - move the function out into its own file?
 */
export const getEpigenomeLabels = ({
  epigenomes,
  sortingDimensions
}: {
  epigenomes: Epigenome[];
  sortingDimensions: string[];
}) => {
  const labelData = sortingDimensions.map((dimension, index) => {
    const distinctDimensionValues = getDistinctValuesForDimension(
      epigenomes,
      dimension
    );
    const colorScale = getColorScaleForValues(distinctDimensionValues, index);
    const colorMap = createValuesToColorsMap(
      distinctDimensionValues,
      colorScale
    );
    const labelsDataForDimension = buildEpigenomeLabelsDataForDimension({
      epigenomes,
      dimension,
      colorMap
    });
    return labelsDataForDimension;
  });

  // The above array is created by mapping sorting dimensions
  // to label data for each of those dimensions.
  // This means that the length of this array is the same
  // as the length of the array of sorting dimensions.
  // It is much more practical to transform it into an array that is as long
  // as the list of epigenomes instead.

  const result: typeof labelData = [];
  const dataColumn = labelData[0];

  for (let i = 0; i < dataColumn.length; i++) {
    const dataForDimensions: (typeof labelData)[number] = [];

    for (const dataPerDimension of labelData) {
      dataForDimensions.push(dataPerDimension[i]);
    }

    result.push(dataForDimensions);
  }

  return result;
};

const EpigenomeLabel = ({
  data,
  epigenome,
  displayDimensions
}: {
  data: ReturnType<typeof getEpigenomeLabels>[number];
  epigenome: Epigenome;
  displayDimensions: string[];
}) => {
  return (
    <div className={styles.epigenomeLabel}>
      <EpigenomeTextLabel
        epigenome={epigenome}
        displayDimensions={displayDimensions}
      />
      <EpigenomeColorLabel data={data} />
    </div>
  );
};

const EpigenomeTextLabel = ({
  epigenome,
  displayDimensions
}: {
  epigenome: Epigenome;
  displayDimensions: string[];
}) => {
  const [hoverRef, isHovered] = useHover<HTMLSpanElement>();

  const [mainDimension, ...otherDimensions] = displayDimensions;

  const labelHeight = 40; // FIXME: import the constant

  return (
    <div className={styles.epigenomeTextLabel} style={{ height: labelHeight }}>
      <span ref={hoverRef}>{epigenome[mainDimension]}</span>

      {isHovered && (
        <Tooltip anchor={hoverRef.current}>
          <LabelPopupContents
            epigenome={epigenome}
            displayDimensions={otherDimensions}
          />
        </Tooltip>
      )}
    </div>
  );
};

const LabelPopupContents = ({
  epigenome,
  displayDimensions
}: {
  epigenome: Epigenome;
  displayDimensions: string[];
}) => {
  const lines = displayDimensions
    .map((dimension) => {
      if (dimension in epigenome) {
        const line = Array.isArray(epigenome[dimension])
          ? epigenome[dimension].join(', ')
          : epigenome[dimension];
        return line;
      }
    })
    .filter((line) => !!line);

  return (
    <div>
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
};

const EpigenomeColorLabel = ({
  data
}: {
  data: ReturnType<typeof getEpigenomeLabels>[number];
}) => {
  const labelHeight = 40; // FIXME: import the constant

  return (
    <div className={styles.epigenomeColorLabel}>
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

const buildEpigenomeLabelsDataForDimension = ({
  epigenomes,
  dimension,
  colorMap
}: {
  epigenomes: Epigenome[];
  dimension: string;
  colorMap: Record<string, string>;
}) => {
  return epigenomes.map((epigenome) => {
    const value = epigenome[dimension];
    const stringifiedValue = stringifyDimensionValue(epigenome, dimension);
    const color = colorMap[stringifiedValue];

    return {
      dimension,
      value,
      stringifiedValue,
      color
    };
  });
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

export default EpigenomeLabels;
