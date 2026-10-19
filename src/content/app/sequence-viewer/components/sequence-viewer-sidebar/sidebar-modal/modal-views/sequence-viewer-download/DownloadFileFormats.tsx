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

import { useReducer, type ChangeEvent } from 'react';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';

import type {
  DownloadFileFormatWithOptions,
  DownloadOptionsSection as DownloadOptionsSectionType
} from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';

type Props = {
  formats: DownloadFileFormatWithOptions[];
};

type State = {
  selectedFormat: string;
  formatOptions: Record<string, Record<string, boolean>>; // map of format to its options
};

type ReplaceStateAction = {
  type: 'replace-state';
  state: State;
};

type ChangeFormatAction = {
  type: 'change-format';
  formatId: string;
};

type OptionsUpdateAction = {
  type: 'options-update';
  formatId: string;
  options: State['formatOptions'][string];
};

type Action = ReplaceStateAction | ChangeFormatAction | OptionsUpdateAction;

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'replace-state':
      return action.state;
    case 'change-format':
      return {
        ...state,
        selectedFormat: action.formatId
      };
    case 'options-update':
      return {
        ...state,
        formatOptions: {
          ...state.formatOptions,
          [action.formatId]: {
            ...state.formatOptions[action.formatId],
            ...action.options
          }
        }
      };
  }
};

const getInitialState = (formats: DownloadFileFormatWithOptions[]) => {
  const firstFormat = formats[0];
  const selectedFormatId = firstFormat.id;

  const formatToOptionsMap: State['formatOptions'] = {};

  for (const format of formats) {
    const formatId = format.id;
    const optionTuples = format.sections.flatMap((section) =>
      section.children.map((option) => [option.id, option.checked] as const)
    );
    const options: Record<string, boolean> = {};
    for (const [key, value] of optionTuples) {
      options[key] = value;
    }
    formatToOptionsMap[formatId] = options;
  }

  return {
    selectedFormat: selectedFormatId,
    formatOptions: formatToOptionsMap
  };
};

const DownloadFileFormats = ({ formats }: Props) => {
  const initialState = getInitialState(formats);
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const fileFormatsForSelect = formats.map((format) => ({
    label: format.label,
    value: format.id
  }));
  const selectedFormat = state.selectedFormat;

  const handleFileFormatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newFormatId = event.target.value;
    dispatch({
      type: 'change-format',
      formatId: newFormatId
    });
  };

  const handleOptionChange = (option: Record<string, boolean>) => {
    dispatch({
      type: 'options-update',
      formatId: selectedFormat,
      options: option
    });
  };

  const selectedOptions = state.formatOptions[selectedFormat];

  const optionSections = formats
    .find((format) => format.id === selectedFormat)!
    .sections.map((section) => (
      <FileOptionsSection
        key={section.label}
        optionsState={selectedOptions}
        section={section}
        onChange={handleOptionChange}
      />
    ));

  return (
    <>
      <SimpleSelect
        onChange={handleFileFormatChange}
        options={fileFormatsForSelect}
      />
      {optionSections}
    </>
  );
};

const FileOptionsSection = ({
  section,
  optionsState,
  onChange
}: {
  section: DownloadOptionsSectionType;
  optionsState: State['formatOptions'][string];
  onChange: (option: Record<string, boolean>) => void;
}) => {
  const optionElements = section.children.map((option) => (
    <CheckboxOption
      key={option.id}
      optionsState={optionsState}
      option={option}
      onChange={onChange}
    />
  ));

  return (
    <>
      <div>{section.label}</div>
      <div>{optionElements}</div>
    </>
  );
};

export const CheckboxOption = ({
  option,
  optionsState,
  onChange: changeHandlerFromProps
}: {
  option: { id: string; value: boolean; label: string };
  optionsState: State['formatOptions'][string];
  onChange: (option: Record<string, boolean>) => void;
}) => {
  const onChange = (isChecked: boolean) => {
    changeHandlerFromProps({
      [option.id]: isChecked
    });
  };

  return (
    <CheckboxWithLabel
      checked={optionsState[option.id]}
      label={option.label}
      onChange={onChange}
    />
  );
};

export default DownloadFileFormats;
