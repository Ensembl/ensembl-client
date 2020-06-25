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

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import {
  getFeatureCoordinates,
  getRegionName,
  getFirstAndLastCodingExonIndexes,
  getNumberOfCodingExons,
  getSplicedRNALength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './TranscriptsListItemInfo.scss';

type ItemInfoProps = {
  gene: Gene;
  transcript: Transcript;
};

const ItemInfo = (props: ItemInfoProps) => {
  const [isDownloadShown, setIsDownloadShown] = useState(false);
  const { transcript } = props;
  const params: { [key: string]: string } = useParams();

  const openDownload = () => setIsDownloadShown(true);
  const closeDownload = () => setIsDownloadShown(false);

  const getTranscriptLocation = () => {
    const { start, end } = getFeatureCoordinates(transcript);
    const chromosome = getRegionName(transcript);

    return getFormattedLocation({
      chromosome,
      start,
      end
    });
  };

  // FIXME: remove this when the amino acid length can be retrieved via the API
  const getAminoAcidLength = () => {
    const { exons, cds } = transcript;

    if (cds) {
      const {
        firstCodingExonIndex,
        lastCodingExonIndex
      } = getFirstAndLastCodingExonIndexes(transcript);
      if (firstCodingExonIndex === lastCodingExonIndex) {
        return Math.floor((cds.end - cds.start + 1) / 3);
      }

      let cdsLength = 0;

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

      const aminoAcidLength = Math.floor(cdsLength / 3);
      return aminoAcidLength;
    } else {
      return 0;
    }
  };

  const splicedRNALength = getCommaSeparatedNumber(
    getSplicedRNALength(transcript)
  );

  const mainStyles = classNames(transcriptsListStyles.row, styles.listItemInfo);
  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  const focusIdForUrl = buildFocusIdForUrl({
    type: 'gene',
    objectId: props.gene.id
  });

  const getBrowserLink = () => {
    const { genomeId } = params;
    return urlFor.browser({ genomeId: genomeId, focus: focusIdForUrl });
  };
  return (
    <div className={mainStyles}>
      <div className={transcriptsListStyles.left}>bottom left</div>
      <div className={midStyles}>
        <div className={styles.topLeft}>
          <div>
            <strong>{transcript.biotype}</strong>
          </div>
          <div>{getTranscriptLocation()}</div>
        </div>
        <div className={styles.topMiddle}>
          {transcript.cds && (
            <>
              <div>
                <strong>{getAminoAcidLength()} aa</strong>
              </div>
              <div>ENSP1000000000</div>
            </>
          )}
        </div>
        <div className={styles.topRight}>
          <div>
            Spliced RNA length <strong>{splicedRNALength} bp</strong>
          </div>
          <div>
            Coding exons <strong>{getNumberOfCodingExons(transcript)}</strong>{' '}
            of {transcript.exons.length}
          </div>
        </div>
        <div className={styles.downloadLink}>
          {isDownloadShown ? (
            <CloseIcon className={styles.closeIcon} onClick={closeDownload} />
          ) : (
            <span onClick={openDownload}>Download</span>
          )}
        </div>
        {isDownloadShown && renderInstantDownload(props)}
      </div>
      <div className={transcriptsListStyles.right}>
        <div>{transcript.symbol}</div>
        <div>
          <ViewInApp links={{ genomeBrowser: getBrowserLink() }} />
        </div>
      </div>
    </div>
  );
};

const renderInstantDownload = ({ gene, transcript }: ItemInfoProps) => {
  return (
    <div className={styles.download}>
      <InstantDownloadTranscript transcript={transcript} gene={gene} />
    </div>
  );
};

export default ItemInfo;
