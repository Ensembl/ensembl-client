import React, { useState, useEffect, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import { getTranscriptData } from '../transcripts/transcriptData';

import { ProteinDomainImageWithData as ProteinDomainImage } from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './ProteinDomainImage.stories.scss';

const GRAPHIC_WIDTH = 1200;
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

  if (!data?.product?.protein_domains_resources.length) {
    content = (
      <div>
        There are no features available for the given protein. Please try a
        different id.
      </div>
    );
  } else if (data?.product) {
    content = (
      <ProteinDomainImage width={GRAPHIC_WIDTH} product={data.product} />
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
