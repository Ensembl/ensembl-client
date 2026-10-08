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

import { memo, useState, useCallback, useMemo } from 'react';

import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import SidebarSectionHeading from 'src/shared/components/sidebar-section-heading/SidebarSectionHeading';

import type {
  SequenceBooleanOption as SequenceBooleanOptionType,
  SequenceOptionsSection as SequenceOptionsSectionType,
  SequenceMultiselectOption as SequenceMultiselectOptionType
} from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';
import type {
  SequenceSettings,
  SequenceOptionValue
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

import styles from './SequenceOptions.module.css';

type AppliedSettings = SequenceSettings['options'];

export const SequenceOptionsSections = ({
  sections,
  appliedSettings,
  onSettingsChange
}: {
  sections: SequenceOptionsSectionType[];
  appliedSettings: AppliedSettings;
  onSettingsChange: (settings: AppliedSettings) => void;
}) => {
  return sections.map((section) => (
    <SequenceOptionsSection
      key={section.label}
      section={section}
      appliedSettings={appliedSettings}
      onSettingsChange={onSettingsChange}
    />
  ));
};

export const SequenceOptionsSection = ({
  section,
  appliedSettings,
  onSettingsChange
}: {
  section: SequenceOptionsSectionType;
  appliedSettings: AppliedSettings;
  onSettingsChange: (settings: AppliedSettings) => void;
}) => {
  const sectionChildren = useMemo(() => {
    return section.children.map((child) => {
      if (child.type === 'checkbox') {
        return (
          <SingleCheckboxOption
            key={child.id}
            option={child}
            appliedSettings={appliedSettings}
            onChange={onSettingsChange}
          />
        );
      } else if (child.type === 'checkbox-group') {
        return (
          <SequenceMultiselectOptions
            key={child.id}
            optionGroup={child}
            appliedSettings={appliedSettings}
            onSettingsChange={onSettingsChange}
          />
        );
      }
    });
  }, [section, appliedSettings, onSettingsChange]);

  return (
    <div>
      <SidebarSectionHeading>{section.label}</SidebarSectionHeading>
      <div className={styles.column}>{sectionChildren}</div>
    </div>
  );
};

export const SequenceMultiselectOptions = ({
  optionGroup,
  onSettingsChange,
  appliedSettings
}: {
  onSettingsChange: (settings: AppliedSettings) => void;
  optionGroup: SequenceMultiselectOptionType;
  appliedSettings: AppliedSettings;
}) => {
  const onChange = useCallback(
    ({
      id,
      value
    }: {
      id: string;
      value: SequenceMultiselectOptionType['values'][number]['value'];
    }) => {
      const storedSettings = appliedSettings[id] as
        SequenceOptionValue[] | undefined;
      let newSettings: SequenceOptionValue[] = [];

      if (storedSettings) {
        if (storedSettings.includes(value)) {
          newSettings = storedSettings.filter((val) => val !== value);
        } else {
          newSettings = [...storedSettings, value];
        }
      } else {
        newSettings.push(value);
      }

      onSettingsChange({ [id]: newSettings });
    },
    [onSettingsChange, appliedSettings]
  );

  return optionGroup.values.map((option) => (
    <CheckboxOptionInMultiselect
      key={option.label}
      id={optionGroup.id}
      option={option}
      onChange={onChange}
    />
  ));
};

export const CheckboxOptionInMultiselect = memo(
  ({
    id,
    option,
    onChange: changeHandlerFromProps
  }: {
    id: string;
    option: SequenceMultiselectOptionType['values'][number];
    onChange: (params: {
      id: string;
      value: string | number | boolean;
    }) => void;
  }) => {
    const [isChecked, setIsChecked] = useState(false);

    const onChange = useCallback(
      (isChecked: boolean) => {
        setIsChecked(isChecked);
        changeHandlerFromProps({ id, value: option.value });
      },
      [changeHandlerFromProps, id, option.value]
    );

    return (
      <CheckboxWithLabel
        checked={isChecked}
        label={option.label}
        onChange={onChange}
      />
    );
  }
);

export const SingleCheckboxOption = ({
  option,
  onChange: changeHandlerFromProps,
  appliedSettings
}: {
  option: SequenceBooleanOptionType;
  appliedSettings: AppliedSettings;
  onChange: (settings: AppliedSettings) => void;
}) => {
  const [isChecked, setIsChecked] = useState(option.checked);

  const onChange = useCallback(
    (isChecked: boolean) => {
      const newSettings = { ...appliedSettings };
      if (isChecked) {
        newSettings[option.id] = option.value;
      } else {
        delete newSettings[option.id];
      }

      changeHandlerFromProps(newSettings);
      setIsChecked(isChecked);
    },
    [changeHandlerFromProps, appliedSettings, option]
  );

  return (
    <CheckboxWithLabel
      checked={isChecked}
      label={option.label}
      onChange={onChange}
    />
  );
};
