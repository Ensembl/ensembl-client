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
import { useDispatch } from 'react-redux';
import { Pick2, Pick3, Pick4 } from 'ts-multipick';

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
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import {
  toggleTranscriptDownload,
  toggleTranscriptMoreInfo
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { FullGene } from 'src/shared/types/thoas/gene';
import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { SplicedExon, PhasedExon } from 'src/shared/types/thoas/exon';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';
import { View } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './TranscriptsListItemInfo.scss';

type Gene = Pick<FullGene, 'unversioned_stable_id' | 'stable_id'>;
type Transcript = Pick<
  FullTranscript,
  'stable_id' | 'unversioned_stable_id' | 'external_references' | 'metadata'
> &
  Pick2<FullTranscript, 'slice', 'location'> &
  Pick3<FullTranscript, 'slice', 'region', 'name'> & {
    spliced_exons: Array<
      Pick2<SplicedExon, 'exon', 'stable_id'> &
        Pick4<SplicedExon, 'exon', 'slice', 'location', 'length'>
    >;
  } & {
    product_generating_contexts: Array<
      Pick<FullProductGeneratingContext, 'product_type'> &
        Pick<FullProductGeneratingContext, 'product'> & {
          phased_exons: Array<
            Pick<PhasedExon, 'start_phase' | 'end_phase'> &
              Pick2<PhasedExon, 'exon', 'stable_id'>
          >;
        }
    >;
  };

export type TranscriptsListItemInfoProps = {
  gene: Gene;
  transcript: Transcript;
  expandDownload: boolean;
  expandMoreInfo: boolean;
};

export const TranscriptsListItemInfo = (
  props: TranscriptsListItemInfoProps
) => {
  const { transcript } = props;
  const params: { [key: string]: string } = useParams();
  const { genomeId, entityId } = params;

  const dispatch = useDispatch();

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

  const aminoAcidLength = getCommaSeparatedNumber(
    getProductAminoAcidLength(transcript)
  );

  const mainStyles = classNames(transcriptsListStyles.row, styles.listItemInfo);
  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);
  const transcriptCCDS = transcript.external_references.find(
    (xref) => xref.source.name === 'CCDS'
  );
  const transcriptNCBI = transcript.metadata.mane?.ncbi_transcript;

  const hasRelevantMetadata = (
    ['gencode_basic', 'tsl', 'appris'] as const
  ).some((key) => transcript.metadata[key]);

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

    return <Link to={proteinViewUrl}>{proteinStableId}</Link>;
  };

  const getBrowserLink = () => {
    const { genomeId } = params;
    return urlFor.browser({ genomeId: genomeId, focus: focusIdForUrl });
  };

  const moreInfoContent = () => {
    return (
      <>
        {hasRelevantMetadata && (
          <div className={styles.moreInfoColumn}>
            {transcript.metadata.gencode_basic?.label && (
              <div>{transcript.metadata.gencode_basic?.label}</div>
            )}
            {transcript.metadata?.tsl && (
              <div>{transcript.metadata.tsl?.label}</div>
            )}
            {transcript.metadata?.appris && (
              <div>{transcript.metadata.appris?.label}</div>
            )}
          </div>
        )}
        {(!!transcriptCCDS || !!transcriptNCBI) && (
          <div className={styles.moreInfoColumn}>
            {!!transcriptNCBI && (
              <ExternalReference
                classNames={{ label: styles.normalText }}
                label={'RefSeq match'}
                to={transcriptNCBI.url}
                linkText={transcriptNCBI.id}
              />
            )}
            {!!transcriptCCDS && (
              <ExternalReference
                classNames={{ label: styles.normalText }}
                label={'CCDS'}
                to={transcriptCCDS.url}
                linkText={transcriptCCDS.accession_id}
              />
            )}
          </div>
        )}
      </>
    );
  };

  const product = transcript.product_generating_contexts[0].product;
  return (
    <div className={mainStyles}>
      <div className={transcriptsListStyles.left}></div>
      <div className={midStyles}>
        <div className={styles.topLeft}>
          <div>
            <strong>{transcript.metadata.biotype.label}</strong>
          </div>
          <div>{getTranscriptLocation()}</div>
        </div>
        <div className={styles.topMiddle}>
          {isProteinCodingTranscript(transcript) && (
            <>
              <div>
                <strong>{aminoAcidLength} aa</strong>
              </div>
              {product && getLinkToProteinView(product?.stable_id)}
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

        {(hasRelevantMetadata || !!transcriptCCDS) && (
          <ShowHide
            onClick={() =>
              dispatch(toggleTranscriptMoreInfo(transcript.stable_id))
            }
            label="More information"
            isExpanded={props.expandMoreInfo}
            classNames={{ wrapper: styles.moreInformationLink }}
          />
        )}

        {props.expandMoreInfo && (
          <div className={styles.moreInformation}>{moreInfoContent()}</div>
        )}

        <ShowHide
          onClick={() =>
            dispatch(toggleTranscriptDownload(transcript.stable_id))
          }
          label="Download"
          isExpanded={props.expandDownload}
          classNames={{ wrapper: styles.downloadLink }}
        />
        {props.expandDownload && renderInstantDownload({ ...props, genomeId })}
      </div>
      <div className={transcriptsListStyles.right}>
        <div className={styles.viewInApp}>
          <ViewInApp links={{ genomeBrowser: { url: getBrowserLink() } }} />
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
          id: transcript.stable_id,
          biotype: transcript.metadata.biotype.value
        }}
        gene={{ id: gene.stable_id }}
      />
    </div>
  );
};

export default TranscriptsListItemInfo;
