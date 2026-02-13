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

import { useMemo } from 'react';

import { useAppSelector } from 'src/store';

import {
  getSidebarView,
  getSidebarModalView
} from 'src/content/app/structural-variants/state/sidebar/sidebarSelectors';

import Sidebar from 'src/shared/components/layout/sidebar/Sidebar';
import DefaultSidebarView from './sidebar-default-view/SidebarDefaultView';
import SidebarConfigurationView from './sidebar-configuration-view/SidebarConfigurationView';
import StructuralVariantsSidebarModal from 'src/content/app/structural-variants/components/structural-variants-sidebar/structural-variants-sidebar-modal/StructuralVariantsSidebarModal';

const StructuralVariantsSidebar = () => {
  const sidebarView = useAppSelector(getSidebarView);
  const sidebarModalView = useAppSelector(getSidebarModalView);

  const content = useMemo(() => {
    if (sidebarView === 'default') {
      return <DefaultSidebarView />;
    } else {
      return <SidebarConfigurationView />;
    }
  }, [sidebarView]);

  if (sidebarModalView) {
    return <StructuralVariantsSidebarModal />;
  }

  return <Sidebar>{content}</Sidebar>;
};

export default StructuralVariantsSidebar;
