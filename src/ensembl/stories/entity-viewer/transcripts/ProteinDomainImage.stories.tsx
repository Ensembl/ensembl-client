import React, { useState, useEffect, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import { getTranscriptData } from './transcriptData';

import ProteinDomainImage from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';

import { Transcript as TranscriptType } from 'src/content/app/entity-viewer/types/transcript';

import styles from './ProteinDomainImage.stories.scss';

const GRAPHIC_WIDTH = 1200;
const TranscriptId = 'ENST00000380152';

const ProteinDomainImageStory = () => {
  const [id, setId] = useState(TranscriptId);
  const [data, setData] = useState<TranscriptType | null>(null);

  useEffect(() => {
    getTranscriptData(id).then((response) =>
      setData(response as TranscriptType)
    );
  }, [id]);

  const onIdChange = (id: string) => {
    setId(id);
  };

  let content;

  if (data && data.translation && !data.translation.protein_features.length) {
    content = (
      <div>
        There are no features available for the given transcript. Please try a
        different id.
      </div>
    );
  } else if (data) {
    content = <ProteinDomainImage width={GRAPHIC_WIDTH} transcript={data} />;
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
      <p>Enter gene or transcript stable id to change view</p>
      <input ref={inputRef} defaultValue={props.id} />

      <button onClick={handleSubmit}>Get transcripts</button>
    </form>
  );
};

storiesOf('Components|EntityViewer/Transcripts', module).add(
  'ProteinDomain',
  ProteinDomainImageStory
);
