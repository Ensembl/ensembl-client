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

import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { replace } from 'connected-react-router';
import classNames from 'classnames';
import { Pick2 } from 'ts-multipick';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getProductAminoAcidLength } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { getExpandedTranscriptIds } from '../../../../state/gene-view/transcripts/geneViewTranscriptsSelectors';
import { toggleTranscriptInfo } from '../../../../state/gene-view/transcripts/geneViewTranscriptsSlice';

import ProteinsListItemInfo, {
  Props as ProteinsListItemInfoProps
} from '../proteins-list-item-info/ProteinsListItemInfo';
import { TranscriptQualityLabel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';
import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';
import { Product as FullProduct } from 'src/shared/types/thoas/product';
import { ExternalReference as FullExternalReference } from 'src/shared/types/thoas/externalReference';
import { View } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

import { SWISSPROT_SOURCE } from '../protein-list-constants';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './ProteinsListItem.scss';

type Product = Pick<
  FullProduct,
  'stable_id' | 'length' | 'unversioned_stable_id'
> & {
  external_references: Array<
    Pick<FullExternalReference, 'accession_id' | 'name' | 'description'> &
      Pick2<FullExternalReference, 'source', 'id'>
  >;
};

type Transcript = Pick<FullTranscript, 'stable_id' | 'metadata'> &
  ProteinsListItemInfoProps['transcript'] & {
    product_generating_contexts: Array<
      Pick<FullProductGeneratingContext, 'product_type'> & {
        product: Product;
      }
    >;
  };

export type Props = {
  transcript: Transcript;
  trackLength: number;
};

const ProteinsListItem = (props: Props) => {
  const { transcript, trackLength } = props;
  const expandedTranscriptIds = useSelector(getExpandedTranscriptIds);
  const dispatch = useDispatch();

  const params: { [key: string]: string } = useParams();
  const { genomeId, entityId } = params;
  const { search } = useLocation();
  const proteinIdToFocus = new URLSearchParams(search).get('protein_id');

  const { product } = transcript.product_generating_contexts[0];

  const toggleListItemInfo = () => {
    if (proteinIdToFocus) {
      const url = urlFor.entityViewer({
        genomeId,
        entityId,
        view: View.PROTEIN
      });

      dispatch(replace(url));
    }

    dispatch(toggleTranscriptInfo(transcript.stable_id));
  };

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (product.stable_id === proteinIdToFocus) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);

      if (!expandedTranscriptIds.includes(transcript.stable_id)) {
        dispatch(toggleTranscriptInfo(transcript.stable_id));
      }
    }
  }, [proteinIdToFocus]);

  const getProteinDescription = () => {
    const swissprotReference = product.external_references.find(
      (reference: Product['external_references'][number]) =>
        reference.source.id === SWISSPROT_SOURCE
    );

    return swissprotReference?.description;
  };

  return (
    <div className={styles.proteinListItem}>
      <span className={styles.scrollRef} ref={itemRef}></span>
      <div className={transcriptsListStyles.row}>
        <div className={transcriptsListStyles.left}>
          <TranscriptQualityLabel metadata={transcript.metadata} />
        </div>
        <div onClick={toggleListItemInfo} className={midStyles}>
          <div>{getProductAminoAcidLength(transcript)} aa</div>
          <div>{getProteinDescription()}</div>
          <div>{product?.stable_id}</div>
        </div>
        <div
          className={transcriptsListStyles.right}
          onClick={toggleListItemInfo}
        >
          <span className={styles.transcriptId}>{transcript.stable_id}</span>
        </div>
      </div>
      {expandedTranscriptIds.includes(transcript.stable_id) ? (
        <ProteinsListItemInfo
          transcript={transcript}
          trackLength={trackLength}
        />
      ) : null}
    </div>
  );
};

export default ProteinsListItem;
