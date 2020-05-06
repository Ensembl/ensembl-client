import React, { useState, useEffect, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import { getProteinData } from '../protein/proteinData';

import { ProteinDomainImageWithData as ProteinDomainImage } from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';

import { Protein as ProteinType } from 'src/content/app/entity-viewer/types/protein';

import styles from './ProteinDomainImage.stories.scss';

const GRAPHIC_WIDTH = 1200;
const PROTEIN_ID = 'ENSP00000369497';

const ProteinDomainImageStory = () => {
  const [id, setId] = useState(PROTEIN_ID);
  const [data, setData] = useState<ProteinType | null>(null);

  useEffect(() => {
    getProteinData(id).then((response) => setData(response as ProteinType));
  }, [id]);

  const onIdChange = (id: string) => {
    setId(id);
  };

  let content;

  if (data?.product?.protein_domains_resources.length) {
    content = (
      <div>
        There are no features available for the given protein. Please try a
        different id.
      </div>
    );
  } else if (data) {
    content = <ProteinDomainImage width={GRAPHIC_WIDTH} protein={data} />;
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
      <p>Enter protein stable id to change view</p>
      <input ref={inputRef} defaultValue={props.id} />

      <button onClick={handleSubmit}>Get protein domains</button>
    </form>
  );
};

storiesOf('Components|EntityViewer/Protein', module).add(
  'ProteinDomainImage',
  ProteinDomainImageStory
);
