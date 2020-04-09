import React from 'react';
import classNames from 'classnames';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import {
  getFeatureCoordinates,
  getRegionName
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './TranscriptsListItemInfo.scss';

type ItemInfoProps = {
  transcript: Transcript;
};

const ItemInfo = (props: ItemInfoProps) => {
  const { transcript } = props;

  const getTranscriptLocation = () => {
    const { start, end } = getFeatureCoordinates(transcript);
    const chromosome = getRegionName(transcript);

    return getFormattedLocation({
      chromosome,
      start,
      end
    });
  };

  const getSplicedRNALength = () => {
    const rnaLength = transcript.exons.reduce((length, exon) => {
      const { start, end } = getFeatureCoordinates(exon);
      return length + (end - start + 1);
    }, 0);

    return getCommaSeparatedNumber(rnaLength);
  };

  const getFirstAndLastCodingExonIndexes = () => {
    const { exons, cds } = transcript;
    let firstCodingExonIndex = 0;
    let lastCodingExonIndex = exons.length - 1;

    if (cds) {
      firstCodingExonIndex = exons.findIndex((exon) => {
        const { start: exonStart, end: exonEnd } = getFeatureCoordinates(exon);
        return exonStart <= cds.start && exonEnd >= cds.start ? true : false;
      });

      lastCodingExonIndex = exons.findIndex((exon) => {
        const { start: exonStart, end: exonEnd } = getFeatureCoordinates(exon);
        return exonStart <= cds.end && exonEnd >= cds.end ? true : false;
      });
    }

    return {
      firstCodingExonIndex,
      lastCodingExonIndex
    };
  };

  // FIXME: remove this when the amino acid length can be retrieved via the API
  const getAminoAcidLength = () => {
    const { exons, cds } = transcript;

    if (cds) {
      const {
        firstCodingExonIndex,
        lastCodingExonIndex
      } = getFirstAndLastCodingExonIndexes();
      let cdsLength = 0;

      if (firstCodingExonIndex !== -1 && lastCodingExonIndex !== -1) {
        // add coding length of the first coding exon
        const { end: firstCodingExonEnd } = getFeatureCoordinates(
          exons[firstCodingExonIndex]
        );
        cdsLength += firstCodingExonEnd - cds.start + 1;

        // add coding length of the last coding exon
        const { start: lastCodingExonStart } = getFeatureCoordinates(
          exons[lastCodingExonIndex]
        );
        cdsLength += cds.end - lastCodingExonStart + 1;

        // add coding length of exons between first and last coding exons
        for (
          let index = firstCodingExonIndex + 1;
          index <= lastCodingExonIndex - 1;
          index += 1
        ) {
          const { start, end } = getFeatureCoordinates(exons[index]);
          cdsLength += end - start + 1;
        }
      }

      const aminoAcidLength = Math.floor(cdsLength / 3);
      return aminoAcidLength;
    } else {
      return 0;
    }
  };

  const getNumberOfCodingExons = () => {
    const {
      firstCodingExonIndex,
      lastCodingExonIndex
    } = getFirstAndLastCodingExonIndexes();
    return getCommaSeparatedNumber(
      lastCodingExonIndex - firstCodingExonIndex + 1
    );
  };

  const mainStyles = classNames(transcriptsListStyles.row, styles.listItemInfo);
  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  return (
    <div className={mainStyles}>
      <div className={transcriptsListStyles.left}>bottom left</div>
      <div className={midStyles}>
        <div className={styles.column}>
          <div>
            <strong>{transcript.biotype}</strong>
          </div>
          <div>{getTranscriptLocation()}</div>
        </div>
        <div className={styles.column}>
          {transcript.cds && (
            <>
              <div id="amino-acid-length">
                <strong>{getAminoAcidLength()} aa</strong>
              </div>
              <div>ENSP1000000000</div>
            </>
          )}
        </div>
        <div className={styles.column}>
          <div>
            Spliced RNA length <strong>{getSplicedRNALength()} bp</strong>
          </div>
          <div>
            Coding exons <strong>{getNumberOfCodingExons()}</strong> of{' '}
            {transcript.exons.length}
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.downloadLink}>Download</div>
        </div>
      </div>
      <div className={transcriptsListStyles.right}>{transcript.symbol}</div>
    </div>
  );
};

export default ItemInfo;
