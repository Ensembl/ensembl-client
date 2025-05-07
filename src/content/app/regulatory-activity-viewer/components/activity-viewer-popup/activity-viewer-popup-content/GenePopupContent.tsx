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

import { useRef } from 'react';

import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import TextButton from 'src/shared/components/text-button/TextButton';

import { Strand } from 'src/shared/types/core-api/strand';
import type { GenePopupMessage } from '../activityViewerPopupMessageTypes';

import styles from './AcrivityViewerPopupContent.module.css';

type Props = {
  content: GenePopupMessage['content'];
  onClose: () => void;
};

const GenePopupContent = (props: Props) => {
  const { content: gene } = props;
  const componentRef = useRef<HTMLDivElement>(null);

  const onFocus = () => {
    const event = new CustomEvent('focus-gene', {
      bubbles: true,
      detail: gene
    });
    componentRef.current?.dispatchEvent(event);

    props.onClose();
  };

  const geneSymbolAndIdentifier = gene.symbol ? (
    <>
      <span>{gene.symbol}</span> <span>{gene.stable_id}</span>
    </>
  ) : (
    <span>{gene.stable_id}</span>
  );

  return (
    <div ref={componentRef}>
      <div className={styles.regularRow}>
        <span className={styles.light}>Gene </span>
        {geneSymbolAndIdentifier}
      </div>
      <div className={styles.regularRow}>
        <span className={styles.light}>Biotype </span>
        <span>{gene.biotype}</span>
      </div>
      <div className={styles.light}>
        <span className={styles.strand}>
          {/* TODO: Change Strand enum into a union type */}
          {getStrandDisplayName(gene.strand as Strand)}{' '}
        </span>
        <span>
          {getFormattedLocation({
            chromosome: gene.region_name,
            start: gene.start,
            end: gene.end
          })}
        </span>
      </div>
      <div>
        <TextButton onClick={onFocus}>Make focus</TextButton>
      </div>
    </div>
  );
};

export default GenePopupContent;
