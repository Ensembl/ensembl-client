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

import React, { type HTMLAttributes } from 'react';

import styles from './SimpleSelect.scss';

type Props = HTMLAttributes<HTMLSelectElement>;

// This is just a simple wrapper for the native HTML select element.
// The purpose of this React component is to style the select button,
// since it's the only part of the native select element that can be styled.

// NOTE: when interacting with SimpleSelect component,
// pass your event handler to the onInput rather than the onChange property,
// because onInput fires immediately, while the onChange fires when the select gets unfocussed.

const SimpleSelect = (props: Props) => {
  return (
    <div className={styles.select}>
      <select className={styles.selectResetDefaults} {...props} />
    </div>
  );
};

export default SimpleSelect;
