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
import type { Pick2 } from 'ts-multipick';
import { scaleLinear, interpolateRound, ScaleLinear } from 'd3';

import { measureText } from 'src/shared/helpers/textHelpers';

import ChevronDown from 'static/icons/icon_chevron.svg';

import type { SplicedExon } from 'src/shared/types/core-api/exon';
import type { FullCDS } from 'src/shared/types/core-api/cds';
import type { VariantRelativeLocation } from 'src/shared/types/variation-api/variantPredictedMolecularConsequence';
import type { ExonWithRelativeLocationInCDS } from 'src/shared/helpers/exon-helpers/exonHelpers';

import styles from './TranscriptVariantCDS.module.css';

type ExonFields = Pick<SplicedExon, 'index'> &
  Pick2<SplicedExon, 'relative_location', 'start' | 'end'>;
type CDSFields = Pick<
  FullCDS,
  'relative_start' | 'relative_end' | 'nucleotide_length'
>;
type VariantRelativeLocationFields = Pick<
  VariantRelativeLocation,
  'start' | 'end'
>;

/**
 * Specs
 * - Exon
 *  - height: 12px
 *  - color: $grey
 * - White space to the right of exon: 1px
 *
 * - Min exon width: 2px
 * - Min exon width with arrow: 18px
 *  - Arrow:
 *    - height: 9px
 *    - color: $white, opacity: 50%
 *
 * - Line representing the variant:
 *  - height: 18px
 *  - width: 2px
 *  - color: $black
 *  - centered vertically relative to exon block
 *
 */

type Props = {
  exons: Array<ExonFields & ExonWithRelativeLocationInCDS>;
  cds: CDSFields;
  allele: {
    type: string;
    relativeLocation: VariantRelativeLocationFields;
  };
};

const MIN_EXON_BLOCK_WIDTH = 2;
const EXON_MARGIN_WIDTH = 1;
const EXON_BLOCK_HEIGHT = 12;
const MIN_EXON_BLOCK_WITH_ARROW_WIDTH = 18;
const VARIANT_MARKER_HEIGHT = 18;
const VATIANT_MARKER_WIDTH = 2;
const DIAGRAM_HEIGHT = 42;

const EXON_BLOCK_OFFSET_TOP = (VARIANT_MARKER_HEIGHT - EXON_BLOCK_HEIGHT) / 2;

const TranscriptVariantCDS = (props: Props) => {
  const { exons, allele, cds } = props;
  const width = 700;

  const scale = scaleLinear()
    .domain([1, cds.nucleotide_length])
    .range([1, width])
    .interpolate(interpolateRound)
    .clamp(true);

  const exonsWithWidths = getExonWidths({
    exons,
    containerWidth: width,
    scale
  });

  return (
    <svg
      width={width}
      height={DIAGRAM_HEIGHT}
      viewBox={`0 0 ${width} ${DIAGRAM_HEIGHT}`}
      overflow="visible"
    >
      <Exons exons={exonsWithWidths} />
      <VariantMark
        exons={exonsWithWidths}
        allele={allele}
        scale={scale}
        containerWidth={width}
      />
    </svg>
  );
};

const Exons = (props: { exons: Array<{ width: number }> }) => {
  let x = 0;

  const exonBlocks = props.exons.map((exon, index) => {
    const width = exon.width;
    const currentX = x;
    x += width + EXON_MARGIN_WIDTH;

    return <ExonBlock key={index} x={currentX} width={width} />;
  });

  return <g>{exonBlocks}</g>;
};

const ExonBlock = (props: { x: number; width: number }) => {
  const { x, width } = props;
  const desiredArrowHeight = 9;

  if (width >= MIN_EXON_BLOCK_WITH_ARROW_WIDTH) {
    // FIXME: instead of desiredArrowHeight, i.e. the width of the chevron, subtract half the true height of the chevron
    const arrowX = x + width / 2 - desiredArrowHeight;

    // for each arrow, define the rotation origin to be exactly in the middle of the arrow
    const rotateOriginX = arrowX + desiredArrowHeight / 2;
    const rotateOriginY = EXON_BLOCK_OFFSET_TOP + EXON_BLOCK_HEIGHT / 2;

    return (
      <>
        <rect
          className={styles.exonBlock}
          x={x}
          y={EXON_BLOCK_OFFSET_TOP}
          width={width}
          height={EXON_BLOCK_HEIGHT}
        />
        {/* 
          Wrapping ChevronDown in a group element,
          because browsers have not yet implemented transform attribute on svg element itself;
          and therefore, we cannot rotate the chevron directly
          (https://stackoverflow.com/a/50416852/3925302)
        */}
        <g transform={`rotate(-90 ${rotateOriginX} ${rotateOriginY})`}>
          <ChevronDown
            className={styles.exonBlockArrow}
            x={arrowX}
            y={EXON_BLOCK_OFFSET_TOP + EXON_BLOCK_HEIGHT / 2}
            width={desiredArrowHeight}
            height="5.625"
          />
        </g>
      </>
    );
  } else {
    return <rect x={x} width={width} height={EXON_BLOCK_HEIGHT} />;
  }
};

const VariantMark = (props: {
  exons: ReturnType<typeof getExonWidths>;
  allele: Props['allele'];
  scale: ScaleLinear<number, number>;
  containerWidth: number;
}) => {
  const { allele, scale } = props;

  const variantPosition =
    allele.relativeLocation.start || allele.relativeLocation.end;

  if (!variantPosition) {
    // This shouldn't happen. If we are here, our CDS diagram is useless, because we can't project the variant onto the CDS
    return null;
  }

  const x = scale(variantPosition);

  return (
    <>
      <rect x={x} width={VATIANT_MARKER_WIDTH} height={VARIANT_MARKER_HEIGHT} />
      <VariantMarkLabel {...props} markX={x} />
    </>
  );
};

const VariantMarkLabel = (props: {
  exons: ReturnType<typeof getExonWidths>;
  allele: Props['allele'];
  markX: number; // the x-coordinate for positioning the variant mark
  containerWidth: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { allele, exons, markX, containerWidth } = props;

  const totalCodingExonsCount = exons.length;
  const variantPosition = (allele.relativeLocation.start ||
    allele.relativeLocation.end) as number;

  let affectedExonNumber = 1;

  for (let i = 0; i < exons.length; i++) {
    const exon = exons[i];
    const exonStart = exon.relative_location_in_cds!.start;
    const exonEnd = exon.relative_location_in_cds!.end;

    if (variantPosition >= exonStart && variantPosition <= exonEnd) {
      affectedExonNumber = i + 1;
      break;
    }
  }

  const labelText = `Coding exon ${affectedExonNumber} of ${totalCodingExonsCount}`;
  const labelFont = '11px Lato';

  const { width: predictedLabelWidth } = measureText({
    text: labelText,
    font: labelFont
  });

  let labelX = markX;
  let textAnchor = 'middle';

  if (predictedLabelWidth / 2 > labelX) {
    labelX = 0;
    textAnchor = 'start';
  } else if (labelX + predictedLabelWidth / 2 > containerWidth) {
    labelX = containerWidth;
    textAnchor = 'end';
  }

  return (
    <text
      className={styles.label}
      textAnchor={textAnchor}
      x={labelX}
      y="30"
      fontSize={11}
    >
      Coding exon{' '}
      <tspan className={styles.labelBold}>{affectedExonNumber}</tspan> of{' '}
      {exons.length}
    </text>
  );
};

// const WidthContainer = (props: { children: React.ReactNode }) => {
//   const [containerWidth, setContainerWidth] = useState(0);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useLayoutEffect(() => {
//     const measuredContainerWidth =
//       containerRef.current?.getBoundingClientRect().width ?? 0;
//     setContainerWidth(measuredContainerWidth);
//   }, []);

//   return (
//     <div ref={containerRef}>
//       { !!containerWidth && props.children }
//     </div>
//   );
// };

const getExonWidths = (params: {
  exons: Props['exons'];
  containerWidth: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { exons, scale, containerWidth } = params;

  const exonBlocks = exons.map((exon) => ({
    ...exon,
    width: scale(exon.relative_location_in_cds!.length) - EXON_MARGIN_WIDTH
  }));

  return adjustExonWidths({ exonBlocks, containerWidth });
};

const adjustExonWidths = <T extends { index: number; width: number }>(params: {
  exonBlocks: Array<T>;
  containerWidth: number;
}) => {
  const { exonBlocks, containerWidth } = params;
  const maxExonBlocksCount =
    containerWidth / (EXON_MARGIN_WIDTH + MIN_EXON_BLOCK_WIDTH);

  if (maxExonBlocksCount <= exonBlocks.length) {
    return exonBlocks.slice(0, maxExonBlocksCount).map((exon) => ({
      ...exon,
      width: MIN_EXON_BLOCK_WIDTH
    }));
  }

  // sort by width, shortest to longest
  exonBlocks.sort((exonA, exonB) => exonA.width - exonB.width);

  let currentShrinkableExonIndex = exonBlocks.length - 1;

  for (const exon of exonBlocks) {
    if (exon.width < MIN_EXON_BLOCK_WIDTH) {
      const extraWidth = MIN_EXON_BLOCK_WIDTH - exon.width;
      let donorExonBlock = exonBlocks[currentShrinkableExonIndex];

      if (donorExonBlock.width! > MIN_EXON_BLOCK_WIDTH) {
        currentShrinkableExonIndex = exonBlocks.length - 1;
        donorExonBlock = exonBlocks[currentShrinkableExonIndex];
      }

      if (donorExonBlock.width > MIN_EXON_BLOCK_WIDTH) {
        donorExonBlock.width -= extraWidth;
        exon.width += extraWidth;
        currentShrinkableExonIndex -= 1;
      } else {
        // After the previous if-clause we would expect the donor exon block's to be wider than the minimum width
        // But if, for whatever reason, it is not, it means that something has gone wrong, and we better skip any further adjustments
        break;
      }
    }
  }

  // sort by index
  exonBlocks.sort((exonA, exonB) => exonA.index - exonB.index);

  return exonBlocks;
};

export default TranscriptVariantCDS;
