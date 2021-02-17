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
  isProteinCodingTranscript,
  getFeatureCoordinates,
  getRegionName,
  getNumberOfCodingExons,
  getSplicedRNALength,
  getProductAminoAcidLength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import { toggleTranscriptDownload } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import { clearExpandedProteins } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSlice';

import { Gene } from 'src/shared/types/thoas/gene';
import { Transcript } from 'src/shared/types/thoas/transcript';
import { View } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './TranscriptsListItemInfo.scss';

export type TranscriptsListItemInfoProps = {
  gene: Gene;
  transcript: Transcript;
  expandDownload: boolean;
  toggleTranscriptDownload: (id: string) => void;
  onProteinLinkClick: () => void;
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

  const splicedRNALength = getCommaSeparatedNumber(
    getSplicedRNALength(transcript)
  );

  const mainStyles = classNames(transcriptsListStyles.row, styles.listItemInfo);
  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  const focusIdForUrl = buildFocusIdForUrl({
    type: 'gene',
    objectId: props.gene.unversioned_stable_id
  });

  const getLinkToProteinView = (proteinStableId: string) => {
    const proteinViewUrl = urlFor.entityViewer({
      genomeId,
      entityId,
      view: View.PROTEIN,
      proteinId: proteinStableId
    });

    return (
      <Link onClick={() => props.onProteinLinkClick()} to={proteinViewUrl}>
        {proteinStableId}
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
            <strong>{transcript.so_term}</strong>
          </div>
          <div>{getTranscriptLocation()}</div>
        </div>
        <div className={styles.topMiddle}>
          {isProteinCodingTranscript(transcript) && (
            <>
              <div>
                <strong>{getProductAminoAcidLength(transcript)} aa</strong>
              </div>
              {getLinkToProteinView(
                transcript.product_generating_contexts[0]?.product.stable_id
              )}
            </>
          )}
        </div>
        <div className={styles.topRight}>
          <div>
            Combined exon length <strong>{splicedRNALength}</strong> bp
          </div>
          <div>
            Coding exons <strong>{getNumberOfCodingExons(transcript)}</strong>{' '}
            of {transcript.spliced_exons.length}
          </div>
        </div>
        <div className={styles.downloadLink}>
          {props.expandDownload ? (
            <CloseButton
              className={styles.closeButton}
              onClick={() =>
                props.toggleTranscriptDownload(transcript.stable_id)
              }
            />
          ) : (
            <span
              onClick={() =>
                props.toggleTranscriptDownload(transcript.stable_id)
              }
            >
              Download
            </span>
          )}
        </div>
        {props.expandDownload && renderInstantDownload({ ...props, genomeId })}
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
  transcript,
  gene,
  genomeId
}: TranscriptsListItemInfoProps & {
  genomeId: string;
}) => {
  return (
    <div className={styles.download}>
      <InstantDownloadTranscript
        genomeId={genomeId}
        transcript={{
          id: transcript.unversioned_stable_id,
          so_term: transcript.so_term
        }}
        gene={{ id: gene.unversioned_stable_id }}
      />
    </div>
  );
};

const mapDispatchToProps = {
  toggleTranscriptDownload,
  onProteinLinkClick: clearExpandedProteins
};

export default connect(null, mapDispatchToProps)(TranscriptsListItemInfo);
