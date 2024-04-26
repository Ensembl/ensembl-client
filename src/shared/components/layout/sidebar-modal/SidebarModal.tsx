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

import { ReactNode } from 'react';
import classNames from 'classnames';

import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './SidebarModal.module.css';

export type SidebarModalProps = {
  title: string;
  children: ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
  onClose: () => void;
};

const SidebarModal = (props: SidebarModalProps) => {
  const { title, theme, className, onClose } = props;
  const themeClass = theme === 'dark' ? styles.darkTheme : styles.lightTheme;
  const wrapperClasses = classNames(styles.sidebarModal, themeClass, className);

  return (
    <div className={wrapperClasses}>
      <CloseButton className={styles.closeButton} onClick={onClose} />
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default SidebarModal;
