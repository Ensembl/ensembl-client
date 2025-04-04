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

import styles from './Header.module.css';

import { useReleasesQuery } from 'src/shared/state/release/releaseApiSlice';

const EnsemblReleaseVersion = () => {
  const { data, isLoading } = useReleasesQuery();

  if (isLoading) {
    return null;
  }

  const integratedRelease = data?.find(
    (release) => release.is_current && release.type === 'integrated'
  );

  if (!integratedRelease) {
    return <div className={styles.release}>Beta</div>;
  }

  return (
    <div className={styles.release}>
      <span className={styles.light}>Beta Release </span>
      {integratedRelease.name}
    </div>
  );
};

export default EnsemblReleaseVersion;
