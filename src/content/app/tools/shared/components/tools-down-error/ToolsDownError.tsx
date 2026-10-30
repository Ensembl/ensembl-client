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

import AlertButton from 'src/shared/components/alert-button/AlertButton';

import styles from './ToolsDownError.module.css';

/**
 * The screen to show when the tools are down
 */

type Props = {
  toolName: string;
  description?: string;
};

const ToolsDownError = (props: Props) => {
  const { toolName, description } = props;
  const errorMessage = `${toolName} is not available`;

  return (
    <div className={styles.container}>
      <AlertButton className={styles.alertButton} />
      <div className={styles.errorMessage}>{errorMessage}</div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
};

export default ToolsDownError;
