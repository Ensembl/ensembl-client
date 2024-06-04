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

import { useState, useEffect } from 'react';

import styles from './ColourCard.module.css';

type Props = {
  name: string;
  variableName: string;
};

const ColourCard = (props: Props) => {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    // read back from the DOM the color value
    // encoded by the color name custom property
    const rootElement = document.querySelector('html') as HTMLElement;
    const color = getComputedStyle(rootElement)
      .getPropertyValue(props.variableName)
      .trim();
    if (color) {
      setColor(color);
    }
  }, []);

  return (
    <div className={styles.colourCard}>
      <div
        className={styles.colourArea}
        style={{ backgroundColor: `var(${props.variableName})` }}
      />
      <div className={styles.colourInfo}>
        <div className={styles.colourName}>{props.name}</div>
        <div>{props.variableName}</div>
        {!!color && <div>{color}</div>}
      </div>
    </div>
  );
};

export default ColourCard;
