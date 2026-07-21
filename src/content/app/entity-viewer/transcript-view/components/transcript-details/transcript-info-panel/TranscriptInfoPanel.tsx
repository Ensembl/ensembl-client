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

import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import classNames from 'classnames';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import {
  isProteinCodingTranscript,
  getFeatureCoordinates,
  getRegionName,
  getNumberOfCodingExons,
  getSplicedRNALength,
  getProductAminoAcidLength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import type { DefaultEntityViewerTranscript } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';
import type {
  GetSplicedRNALengthParam,
  GetProductAminoAcidLengthParam
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import styles from './TranscriptInfoPanel.module.css';

type GeneFields = {
  stable_id: string;
};

type TranscriptFields = Pick<
  DefaultEntityViewerTranscript,
  | 'stable_id'
  | 'slice'
  | 'metadata'
  | 'external_references'
  | 'product_generating_contexts'
  | 'spliced_exons'
> &
  GetSplicedRNALengthParam &
  GetProductAminoAcidLengthParam;

export type Props = {
  genomeId: string;
  gene: GeneFields;
  transcript: TranscriptFields;
  className?: string;
};

export const TranscriptsListItemInfo = (props: Props) => {
  const { transcript } = props;
  const [isMoreInfoExpanded, setMoreInfoExpanded] = useState(false);
  const [isDownloadExpanded, setDownloadExpanded] = useState(false);
  const location = useLocation();

  const getTranscriptLocation = () => {
    const { start, end } = getFeatureCoordinates(transcript);
    const chromosome = getRegionName(transcript);

    return getFormattedLocation({
      chromosome,
      start,
      end
    });
  };

  const splicedRNALength = formatNumber(getSplicedRNALength(transcript));

  const aminoAcidLength = formatNumber(getProductAminoAcidLength(transcript));

  const { hasMoreInfo, moreInfoComponent } = useMemo(() => {
    const hasLeftColumnElements = (
      ['gencode_basic', 'tsl', 'appris'] as const
    ).some((key) => transcript.metadata[key]);
    const consensusCDS = transcript.external_references.find(
      (xref) => xref.source.name === 'CCDS'
    );
    const transcriptNCBI = transcript.metadata.mane?.ncbi_transcript;

    const hasRightColumnElements = Boolean(consensusCDS || transcriptNCBI);

    const moreInfoComponent = (
      <MoreTranscriptInfo
        genomeId={props.genomeId}
        transcript={props.transcript}
        gene={props.gene}
        consensusCDS={consensusCDS}
        hasLeftColumnElements={hasLeftColumnElements}
        hasRightColumnElements={hasRightColumnElements}
      />
    );

    return {
      hasMoreInfo: hasLeftColumnElements || hasRightColumnElements,
      moreInfoComponent
    };
  }, [
    props.transcript,
    props.gene,
    props.genomeId,
    transcript.external_references,
    transcript.metadata
  ]);

  const getLinkToProteinView = () => {
    const { pathname } = location;
    const searchParams = new URLSearchParams();
    searchParams.set('view', 'protein');
    return `${pathname}?${searchParams.toString()}`;
  };

  const proteinIdClasses = classNames(styles.normalText, styles.wrapText);
  const product = transcript.product_generating_contexts[0].product;

  return (
    <div className={classNames(styles.container, props.className)}>
      <div className={styles.topLeft}>
        <div>
          Biotype{' '}
          <span className={styles.normalText}>
            {transcript.metadata.biotype.label}
          </span>
        </div>
        <div>{getTranscriptLocation()}</div>
      </div>
      <div>
        {isProteinCodingTranscript(transcript) && (
          <>
            <div className={styles.normalText} data-test-id="proteinLength">
              {aminoAcidLength} aa
            </div>
            <div className={proteinIdClasses}>
              {product && (
                <Link to={getLinkToProteinView()}>{product.stable_id}</Link>
              )}
            </div>
          </>
        )}
      </div>
      <div className={styles.topRight}>
        <div>
          Combined exon length{' '}
          <span className={styles.normalText}>{splicedRNALength}</span> bp
        </div>
        <div>
          Coding exons{' '}
          <span className={styles.normalText}>
            {getNumberOfCodingExons(transcript)}
          </span>{' '}
          of {transcript.spliced_exons.length}
        </div>
      </div>

      {hasMoreInfo && (
        <ShowHide
          onClick={() => setMoreInfoExpanded((prev) => !prev)}
          label="More information"
          isExpanded={isMoreInfoExpanded}
          className={styles.moreInfoShowHide}
        />
      )}

      {isMoreInfoExpanded && (
        <div className={styles.moreInformation}>{moreInfoComponent}</div>
      )}

      <ShowHide
        onClick={() => setDownloadExpanded((prev) => !prev)}
        label="Download"
        isExpanded={isDownloadExpanded}
        className={styles.downloadShowHide}
      />
      {isDownloadExpanded && (
        <div className={styles.download}>
          <InstantDownloadTranscript
            genomeId={props.genomeId}
            transcript={{
              id: transcript.stable_id,
              isProteinCoding: isProteinCodingTranscript(transcript)
            }}
            gene={{ id: props.gene.stable_id }}
          />
        </div>
      )}
    </div>
  );
};

const MoreTranscriptInfo = (
  props: Props & {
    consensusCDS:
      | DefaultEntityViewerTranscript['external_references'][0]
      | undefined;
    hasLeftColumnElements: boolean;
    hasRightColumnElements: boolean;
  }
) => {
  const {
    transcript,
    consensusCDS,
    hasLeftColumnElements,
    hasRightColumnElements
  } = props;
  const transcriptNCBI = transcript.metadata.mane?.ncbi_transcript;

  if (!hasLeftColumnElements && !hasRightColumnElements) {
    return null;
  }

  return (
    <>
      {hasLeftColumnElements && (
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
      {hasRightColumnElements && (
        <div className={styles.moreInfoColumn}>
          {!!transcriptNCBI && (
            <ExternalReference label="RefSeq match" to={transcriptNCBI.url}>
              <span className={styles.externalRefLink}>
                {transcriptNCBI.id}
              </span>
            </ExternalReference>
          )}
          {consensusCDS?.url && (
            <ExternalReference label="CCDS" to={consensusCDS.url}>
              <span className={styles.externalRefLink}>
                {consensusCDS.accession_id}
              </span>
            </ExternalReference>
          )}
        </div>
      )}
    </>
  );
};

export default TranscriptsListItemInfo;
