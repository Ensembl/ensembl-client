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
import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './GenomeBrowserError.module.css';

type Props = {
  error: { type: string; payload: unknown };
};

const GenomeBrowserError = (props: Props) => {
  const { error } = props;

  if (error.type === 'out-of-date') {
    return <GenomeBrowserVersionError />;
  } else {
    return <GenericGenomeBrowserError />;
  }
};

const GenomeBrowserVersionError = () => {
  return (
    <div className={styles.container}>
      <AlertButton />
      <div>
        <p className={styles.errorText}>We have updated the genome browser</p>
        <p>Please reload this page to continue</p>
      </div>
      <PrimaryButton onClick={reloadPage}>Reload</PrimaryButton>
    </div>
  );
};

const GenericGenomeBrowserError = () => {
  return (
    <div className={styles.container}>
      <AlertButton />
      <div>
        <p className={styles.errorText}>Genome browser has crashed</p>
        <p>Please try reloading the page</p>
      </div>
      <PrimaryButton onClick={reloadPage}>Reload</PrimaryButton>
    </div>
  );
};

const reloadPage = () => window.location.reload();

export default GenomeBrowserError;
