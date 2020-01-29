import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import FeatureLengthAxis from 'src/content/app/entity-viewer/components/feature-length-axis/FeatureLengthAxis';

import styles from './FeatureLengthAxis.story.scss';

type ContainerProps = {
  value: number;
  onChange: (length: number) => void;
};

const LengthInputForm = (props: ContainerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = inputRef.current?.value;
    const parsedValue = value ? parseInt(value, 10) : null;

    parsedValue && props.onChange(parsedValue);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input ref={inputRef} defaultValue={props.value} />
      <button>Change length</button>
    </form>
  );
};

storiesOf('Components|EntityViewer/FeatureLengthAxis', module).add(
  'default',
  () => {
    const initialLength = 80792;
    const [length, setLength] = useState(initialLength);

    const handleLenghtChange = (length: number) => {
      setLength(length);
    };

    return (
      <div className={styles.container}>
        <FeatureLengthAxis length={length} width={800} standalone={true} />
        <div>
          <LengthInputForm value={length} onChange={handleLenghtChange} />
        </div>
      </div>
    );
  }
);
