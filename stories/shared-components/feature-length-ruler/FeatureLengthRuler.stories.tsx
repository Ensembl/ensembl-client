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

import React, { useState, useRef } from 'react';

import FeatureLengthRuler from 'src/shared/components/feature-length-ruler/FeatureLengthRuler';

import styles from './FeatureLengthRuler.stories.scss';

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

export const FeatureLengthRulerStory = () => {
  const initialLength = 80792;
  const [length, setLength] = useState(initialLength);

  const handleLenghtChange = (length: number) => {
    setLength(length);
  };

  return (
    <div className={styles.container}>
      <FeatureLengthRuler
        length={length}
        width={800}
        unitsLabel="bp"
        standalone={true}
      />
      <div>
        <LengthInputForm value={length} onChange={handleLenghtChange} />
      </div>
    </div>
  );
};

FeatureLengthRulerStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/FeatureLengthRuler'
};
