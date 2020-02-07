import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import BasePairsRuler from 'src/content/app/entity-viewer/components/base-pairs-ruler/BasePairsRuler';

import styles from './BasePairsRuler.stories.scss';

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

storiesOf('Components|EntityViewer/BasePairsRuler', module).add(
  'default',
  () => {
    const initialLength = 80792;
    const [length, setLength] = useState(initialLength);

    const handleLenghtChange = (length: number) => {
      setLength(length);
    };

    return (
      <div className={styles.container}>
        <BasePairsRuler length={length} width={800} standalone={true} />
        <div>
          <LengthInputForm value={length} onChange={handleLenghtChange} />
        </div>
      </div>
    );
  }
);
