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

import type { ReactNode } from 'react';

import styles from './SpeciesSearchResultsTableWrapper.module.css';

/**
 * This is just a simple presentational component
 * whose purpose is to encapsulate the styles for species search results table
 * and for the paginator; and so to prevent the duplication of these styles
 * in consumer components.
 * Since react components, sadly, do not have a slot api,
 * this module exports several components:
 *
 * - The outer wrapper (for table and pagination)
 * - An inner wrapper for the table
 * - An inner wrapper for the pagination section
 */

type Props = {
  children: ReactNode;
};

export const SpeciesSearchResultsTableWrapper = (props: Props) => {
  return <div className={styles.container}>{props.children}</div>;
};

export const TableControlsSection = (props: Props) => {
  return <div className={styles.tableControls}>{props.children}</div>;
};

export const TableSection = (props: Props) => {
  return <div className={styles.tableSection}>{props.children}</div>;
};
