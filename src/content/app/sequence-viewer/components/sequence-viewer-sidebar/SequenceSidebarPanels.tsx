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

import {
  CollapsibleSection,
  CollapsibleSectionHead,
  CollapsibleSectionBody
} from 'src/shared/components/collapsible-section/CollapsibleSection';
import SidebarSectionHeading from 'src/shared/components/sidebar-section-heading/SidebarSectionHeading';
import {
  SequenceOptionsSection,
  FlankingSequences
} from './sequence-options/SequenceOptions';
import SidebarLegend from './sidebar-legend/SidebarLegend';

import type { SequenceSidebarPanel } from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';
import type { SequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

type Props = {
  panels: SequenceSidebarPanel[];
  appliedSettings: SequenceSettings['options'];
  onSettingsChange: (settings: SequenceSettings['options']) => void;
};

const SequenceSidebarPanels = ({
  panels,
  appliedSettings,
  onSettingsChange
}: Props) => {
  return panels.map((panel) => {
    let content;
    switch (panel.type) {
      case 'sequence_options':
        content = (
          <SequenceOptionsSection
            section={panel}
            appliedSettings={appliedSettings}
            onSettingsChange={onSettingsChange}
          />
        );
        break;
      case 'flanking':
        content = (
          <FlankingSequences
            flanking={panel.settings}
            appliedSettings={appliedSettings}
            onSettingsChange={onSettingsChange}
          />
        );
        break;
      case 'legend':
        if (panel.value === null) {
          return null;
        }
        content = <SidebarLegend template={panel.value} />;
        break;
    }
    const key = `${panel.type}:${panel.label}`;
    if (panel.is_collapsible) {
      return (
        <CollapsibleSection key={key} isOpen={panel.expanded_by_default}>
          <CollapsibleSectionHead>{panel.label}</CollapsibleSectionHead>
          <CollapsibleSectionBody>{content}</CollapsibleSectionBody>
        </CollapsibleSection>
      );
    }
    return (
      <div key={key}>
        <SidebarSectionHeading>{panel.label}</SidebarSectionHeading>
        {content}
      </div>
    );
  });
};

export default SequenceSidebarPanels;
