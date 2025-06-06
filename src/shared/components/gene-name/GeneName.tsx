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

import classNames from 'classnames';

import styles from './GeneName.module.css';

/**
 * This component addresses a common pattern to display gene symbol and/or stable id.
 *
 * A gene will always have a stable id, and sometimes will also have a symbol.
 *
 * - If a gene has a symbol, both the symbol and the stable id are displayed.
 * - If a gene does not have a symbol, then only the stable id is displayed.
 *
 * It is common for gene symbol to be displayed in a bold font.
 * The stable id will use a regular font weight gene symbol exists;
 * and may use a bold font if gene symbol does not exist.
 *
 * (Although technically, this component does not display gene name,
 * but rather gene symbol / stable id, calling it GeneName is probably
 * much more convenient that GeneSymbolAndStableId)
 *
 */

type Props = {
  symbol?: string | null;
  stable_id: string;
  className?: string;
};

const GeneName = ({
  symbol,
  stable_id,
  className: classNameFromProps
}: Props) => {
  const geneNamePrimary = symbol ?? stable_id;
  const geneNameSecondary = symbol ? stable_id : null;

  const componentClasses = classNames(styles.geneName, classNameFromProps);

  return (
    <span className={componentClasses}>
      <span className={styles.geneNamePrimary}>{geneNamePrimary}</span>
      {geneNameSecondary && <span>{geneNameSecondary}</span>}
    </span>
  );
};

export default GeneName;
