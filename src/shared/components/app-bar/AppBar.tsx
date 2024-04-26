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

import * as React from 'react';

import ConversationIcon from 'src/shared/components/communication-framework/ConversationIcon';

import styles from './AppBar.module.css';

type AppBarProps = {
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  mainContent: React.ReactNode;
  aside?: React.ReactNode;
};

export const AppBar = (props: AppBarProps) => (
  <section className={styles.appBar}>
    {props.topLeft && (
      <div className={styles.appBarTopLeft}>{props.topLeft}</div>
    )}
    {props.topRight && (
      <div className={styles.appBarTopRight}>{props.topRight}</div>
    )}
    <div className={styles.appBarMain}>{props.mainContent}</div>
    <div className={styles.appBarAside}>
      {props.aside}
      <div className={styles.conversationIcon}>
        <ConversationIcon />
      </div>
    </div>
  </section>
);

export const AppName = ({ children }: { children: React.ReactNode }) => {
  return <span className={styles.appName}>{children}</span>;
};

export default AppBar;
