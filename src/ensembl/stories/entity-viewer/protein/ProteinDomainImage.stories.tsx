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

import React, { useState, useEffect, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import { getTranscriptData } from '../transcripts/transcriptData';

import ProteinDomainImage from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './ProteinDomainImage.stories.scss';

const GRAPHIC_WIDTH = 695;
const TRANSCRIPT_ID = 'ENST00000380152';

const ProteinDomainImageStory = () => {
  const [id, setId] = useState(TRANSCRIPT_ID);
  const [data, setData] = useState<Transcript | null>(null);

  useEffect(() => {
    getTranscriptData(id).then((response) => setData(response as Transcript));
  }, [id]);

  const onIdChange = (id: string) => {
    setId(id);
  };

  let content;

  if (data?.product?.protein_domains_resources) {
    content = (
      <ProteinDomainImage
        width={GRAPHIC_WIDTH}
        proteinDomains={data.product.protein_domains_resources}
        trackLength={data.product.length}
      />
    );
  } else {
    content = (
      <div>
        There are no features available for the given protein. Please try a
        different id.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FeatureIdForm id={id} onChange={onIdChange} />
      {content}
    </div>
  );
};

const FeatureIdForm = (props: {
  id: string;
  onChange: (id: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const value = inputRef.current?.value;

    if (value) {
      props.onChange(value);
    }
  };

  return (
    <form className={styles.form}>
      <p>Enter transcript stable id to change view</p>
      <input ref={inputRef} defaultValue={props.id} />

      <button onClick={handleSubmit}>Get protein domains</button>
    </form>
  );
};

storiesOf('Components|EntityViewer/Protein', module).add(
  'ProteinDomainImage',
  ProteinDomainImageStory
);
