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
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';

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
import { toggleTranscriptDownload } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import { expandProtein } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSlice';
import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './TranscriptsListItemInfo.scss';
import { View } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

export type TranscriptsListItemInfoProps = {
  gene: Gene;
  transcript: Transcript;
  expandDownload: boolean;
  toggleTranscriptDownload: (id: string) => void;
  expandProtein: (id: string) => void;
};

export const TranscriptsListItemInfo = (
  props: TranscriptsListItemInfoProps
) => {
  const { transcript } = props;
  const params: { [key: string]: string } = useParams();
  const { genomeId, entityId } = params;

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

  const buildUrlForProteinView = (transcriptId: string) => {
    if (transcript.so_term !== 'protein_coding') {
      // TODO: Use Protein ID
      return transcriptId;
    }
    const proteinViewUrl = urlFor.entityViewer({
      genomeId,
      entityId,
      view: View.PROTEIN,
      transcriptId
    });

    return (
      <Link
        onClick={() => props.expandProtein(transcript.id)}
        to={proteinViewUrl}
      >
        {/* TODO: Use Protein ID */}
        {transcriptId}
      </Link>
    );
  };

  const getBrowserLink = () => {
    const { genomeId } = params;
    return urlFor.browser({ genomeId: genomeId, focus: focusIdForUrl });
  };
  return (
    <div className={mainStyles}>
      <div className={transcriptsListStyles.left}></div>
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
              {buildUrlForProteinView(transcript.id)}
            </>
          )}
        </div>
        <div className={styles.topRight}>
          <div>
            Spliced RNA length <strong>{splicedRNALength} </strong> bp
          </div>
          <div>
            Coding exons <strong>{getNumberOfCodingExons(transcript)}</strong>{' '}
            of {transcript.exons.length}
          </div>
        </div>
        <div className={styles.downloadLink}>
          {props.expandDownload ? (
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => props.toggleTranscriptDownload(transcript.id)}
            />
          ) : (
            <span onClick={() => props.toggleTranscriptDownload(transcript.id)}>
              Download
            </span>
          )}
        </div>
        {props.expandDownload && renderInstantDownload(props)}
      </div>
      <div className={transcriptsListStyles.right}>
        <div className={styles.transcriptName}>
          <strong>{transcript.symbol}</strong>
        </div>
        <div className={styles.viewInApp}>
          <ViewInApp links={{ genomeBrowser: getBrowserLink() }} />
        </div>
      </div>
    </div>
  );
};

const renderInstantDownload = ({
  gene,
  transcript
}: TranscriptsListItemInfoProps) => {
  return (
    <div className={styles.download}>
      <InstantDownloadTranscript transcript={transcript} gene={gene} />
    </div>
  );
};

const mapDispatchToProps = {
  toggleTranscriptDownload,
  expandProtein
};

export default connect(null, mapDispatchToProps)(TranscriptsListItemInfo);
