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

import React from 'react';
import classNames from 'classnames';

import styles from './SidebarLoader.scss';

type Props = {
  className?: string;
};

const SidebarLoader = (props: Props) => {
  const className = classNames(styles.listLoader, props.className);

  return (
    <div className={className}>
      <div className={styles.listHeading}></div>
      <section>
        <div className={styles.shortItem}></div>
        <div className={styles.shortItem}></div>
        <div className={styles.shortItem}></div>
        <div className={styles.shortItem}></div>
      </section>
      <section>
        <div className={styles.shortItem}></div>
        <div className={styles.shortItem}></div>
      </section>
      <section>
        <div className={styles.longItem}></div>
        <div className={styles.longItem}></div>
        <div className={styles.longItem}></div>
        <div className={styles.longItem}></div>
        <div className={styles.longItem}></div>
        <div className={styles.longItem}></div>
        <div className={styles.longItem}></div>
        <div className={styles.longItem}></div>
      </section>
    </div>
  );
};

export default SidebarLoader;
