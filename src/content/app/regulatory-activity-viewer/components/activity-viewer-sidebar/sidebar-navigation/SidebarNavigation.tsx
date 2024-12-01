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

import { useAppSelector, useAppDispatch } from 'src/store';

import { getSidebarView } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';

import {
  setSidebarView,
  type SidebarView
} from 'src/content/app/regulatory-activity-viewer/state/ui/uiSlice';

import TextButton from 'src/shared/components/text-button/TextButton';

import styles from './SidebarNavigation.module.css';

type Props = {
  genomeId: string | null;
};

const SidebarNavigation = (props: Props) => {
  const { genomeId } = props;
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state) =>
    getSidebarView(state, genomeId ?? '')
  );

  if (!genomeId) {
    return null;
  }

  const onViewChange = (view: SidebarView) => {
    dispatch(
      setSidebarView({
        genomeId,
        view
      })
    );
  };

  return (
    <div className={styles.container}>
      <TextButton
        onClick={() => onViewChange('default')}
        disabled={activeView === 'default'}
      >
        In this region
      </TextButton>
      <TextButton
        onClick={() => onViewChange('epigenome-filters')}
        disabled={activeView === 'epigenome-filters'}
      >
        Region activity
      </TextButton>
    </div>
  );
};

export default SidebarNavigation;
