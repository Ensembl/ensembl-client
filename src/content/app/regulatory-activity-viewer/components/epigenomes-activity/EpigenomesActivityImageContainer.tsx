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

import { memo } from 'react';

import EpigenomesTable from '../epigenomes-activity/epigenomes-table/EpigenomesTable';
import EpigenomeActivityImage, {
  type Props as EpigenomeActivityImageProps
} from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/EpigenomesActivityImage';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './EpigenomesActivityContainer.module.css';

/**
 * Container for the epigenomes activity image,
 * and the epigenomes table
 */

const EpigenomesActivityImageContainer = (
  props: EpigenomeActivityImageProps & { isPending: boolean }
) => {
  const { isPending, ...otherProps } = props;

  return (
    <div className={styles.container}>
      {isPending && <Loader />}
      {!isPending && <EpigenomesTable />}
      <EpigenomeActivityImage {...otherProps} />
    </div>
  );
};

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <CircleLoader />
    </div>
  );
};

export default memo(EpigenomesActivityImageContainer);
