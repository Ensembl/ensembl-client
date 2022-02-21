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

import React from 'react';
import set from 'lodash/fp/set';
import get from 'lodash/get';
import classNames from 'classnames';

import CheckboxWithSelects from 'src/content/app/custom-download/components/checkbox-with-selects/CheckboxWithSelects';
import CheckboxWithRadios from 'src/content/app/custom-download/components/checkbox-with-radios/CheckboxWithRadios';
import CheckboxWithTextfields from 'src/content/app/custom-download/components/checkbox-with-textfields/CheckboxWithTextfields';

import CheckboxGrid, {
  CheckboxGridOption
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import { RadioOptions } from 'src/shared/components/radio-group/RadioGroup';
import { Option } from 'src/shared/components/select/Select';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';

import {
  Attribute,
  AttributeWithContent,
  AttributeWithOptions,
  AttributeType
} from 'src/content/app/custom-download/types/Attributes';

import JSONValue, { PrimitiveOrArrayValue } from 'src/shared/types/JSON';
import { FileTransformedToString } from 'src/shared/components/upload';
import styles from './ContentBuilder.scss';

type Path = (string | number)[];
let path: Path = [];

type ContentBuilderProps = {
  data: AttributeWithContent;
  selectedData: JSONValue;
  onChange: (selectedData: JSONValue) => void;
  uiState: JSONValue;
  onUiChange: (updatedUi: JSONValue) => void;
  path?: Path;
  showOverview?: boolean;
};

const ContentBuilder = (props: ContentBuilderProps) => {
  if (!props.data) {
    return null;
  }

  const onChangeHandler = (
    path: (string | number)[],
    payload: PrimitiveOrArrayValue
  ) => {
    props.onChange(set(path, payload, props.selectedData));
  };

  const onUiChangeHandler = (
    path: (string | number)[],
    payload: PrimitiveOrArrayValue
  ) => {
    props.onUiChange(set(path, payload, props.uiState));
  };

  const buildCheckboxWithSelect = (
    entry: AttributeWithOptions,
    path: Path,
    key: number
  ) => {
    const currentPath = [...path, entry.id];

    const selectedOptions = get(props.selectedData, currentPath, []);

    if (props.showOverview && !selectedOptions.length) {
      return null;
    }

    const mergedClassNames = classNames(
      styles.contentSeparator,
      styles.checkboxWithSelectWrapper
    );

    return (
      <div className={mergedClassNames} key={key}>
        <CheckboxWithSelects
          label={entry.label}
          disabled={entry.disabled}
          onChange={(selectedOptions: string[]) =>
            onChangeHandler(currentPath, selectedOptions)
          }
          selectedOptions={selectedOptions}
          options={(entry.options as Option[]) || []}
        />
      </div>
    );
  };

  const buildCheckboxWithRadios = (
    entry: AttributeWithOptions,
    path: Path,
    key: number
  ) => {
    const currentPath = [...path, entry.id];

    const selectedOption: string = get(props.selectedData, currentPath, '');

    if (props.showOverview && !selectedOption) {
      return null;
    }

    const mergedClassNames = classNames(
      styles.contentSeparator,
      styles.checkboxWithRadiosWrapper
    );
    return (
      <div className={mergedClassNames} key={key}>
        <CheckboxWithRadios
          label={entry.label}
          disabled={entry.disabled}
          onChange={(selectedOption: string | number | boolean) =>
            onChangeHandler(currentPath, selectedOption)
          }
          selectedOption={selectedOption}
          options={entry.options as RadioOptions}
        />
      </div>
    );
  };

  const buildCheckboxGrid = (
    entry: AttributeWithOptions,
    path: Path,
    key: number
  ) => {
    const currentPath = [...path, entry.id];

    const selectedOptions = get(props.selectedData, currentPath, {});
    const totalSelectedOptions =
      Object.values(selectedOptions).filter(Boolean).length;

    if (props.showOverview && !totalSelectedOptions) {
      return null;
    }

    let newSelectedData = { ...props.selectedData };
    const gridOptions = [...entry.options] as CheckboxGridOption[];
    let shouldUpdateSelectedData = false;

    gridOptions.forEach((option) => {
      if (option.isChecked && selectedOptions[option.id] === undefined) {
        newSelectedData = set(
          [...currentPath, option.id],
          true,
          newSelectedData
        );
        shouldUpdateSelectedData = true;
      }
    });
    if (shouldUpdateSelectedData) {
      // The setTimeout below is a temporary hack.
      // Running props.onChange(newSelectedData) synchronously causes the redux wrapper component
      // to immediately try to re-render; which produces errors in the console in dev mode
      setTimeout(() => props.onChange(newSelectedData), 0);
    }

    const gridClone = gridOptions.map((option) => {
      return {
        ...option,
        isChecked: Boolean(selectedOptions[option.id])
      };
    });

    const isCollapsed = get(
      props.uiState,
      [...currentPath, 'isCollapsed'],
      false
    );

    const additionalProps = props.uiState ? props.uiState['checkbox_grid'] : {};

    return (
      <div className={styles.checkboxGridWrapper} key={key}>
        <CheckboxGrid
          onChange={(status: boolean, id: string) =>
            onChangeHandler([...currentPath, id], status)
          }
          onCollapse={(collapsed) =>
            onUiChangeHandler([...currentPath, 'isCollapsed'], collapsed)
          }
          options={gridClone}
          label={entry.label}
          isCollapsed={isCollapsed}
          hideUnchecked={props.showOverview}
          {...additionalProps}
        />
      </div>
    );
  };

  const buildAccordionItem = (
    entry: AttributeWithContent,
    path: Path,
    key: number
  ) => {
    return (
      <AccordionItem uuid={entry.id} key={key}>
        <AccordionItemHeading>
          <AccordionItemButton className={styles.accordionButton}>
            {entry.label}
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ContentBuilder
            data={entry}
            onChange={props.onChange}
            onUiChange={props.onUiChange}
            selectedData={props.selectedData}
            uiState={props.uiState}
            path={path}
          />
        </AccordionItemPanel>
      </AccordionItem>
    );
  };

  const buildAccordion = (
    entry: AttributeWithContent,
    path: Path,
    key: number
  ) => {
    const currentPath = [...path, entry.id];
    const preExpandedPanels = get(
      props.uiState,
      ['accordion', ...currentPath],
      []
    );

    return (
      <Accordion
        allowMultipleExpanded={true}
        onChange={(expandedPanels) =>
          onUiChangeHandler(currentPath, expandedPanels)
        }
        className={styles.accordion}
        preExpanded={preExpandedPanels}
        key={key}
      >
        {entry.content &&
          entry.content.map((accordionSection, key: number) => {
            return (
              <div key={key}>
                {buildAccordionItem(
                  accordionSection as AttributeWithContent,
                  path,
                  key
                )}
              </div>
            );
          })}
      </Accordion>
    );
  };

  const buildCheckboxWithTextfields = (
    entry: Attribute,
    path: Path,
    key: number
  ) => {
    if (props.showOverview) {
      return null;
    }

    const currentPath = [...path, entry.id];

    const values = get(props.selectedData, currentPath, '');
    const textValue = values[0];
    const files = values.slice(1);

    const mergedClassNames = classNames(
      styles.contentSeparator,
      styles.checkboxWithTextfieldsWrapper
    );

    return (
      <div className={mergedClassNames} key={key}>
        <CheckboxWithTextfields
          label={entry.label}
          disabled={entry.disabled}
          onTextChange={(value: string) =>
            onChangeHandler(currentPath, [
              value,
              ...values.slice(1)
            ] as PrimitiveOrArrayValue)
          }
          onFilesChange={(newFiles: FileTransformedToString[]) =>
            onChangeHandler(currentPath, [
              textValue,
              ...newFiles
            ] as PrimitiveOrArrayValue)
          }
          onReset={() => onChangeHandler(currentPath, [])}
          textValue={textValue || ''}
          files={files}
        />
      </div>
    );
  };

  path = props.path
    ? [...props.path, (props.data as AttributeWithContent).id]
    : [props.data.id];

  return (
    <div>
      {props.data.content.map(
        (
          entry: AttributeWithContent | AttributeWithOptions | Attribute,
          key: number
        ) => {
          switch (entry.type) {
            case AttributeType.SECTION_GROUP:
              return buildAccordion(entry as AttributeWithContent, path, key);
            case AttributeType.SECTION:
              return buildAccordionItem(
                entry as AttributeWithContent,
                path,
                key
              );
            case AttributeType.CHECKBOX_GRID:
              return buildCheckboxGrid(
                entry as AttributeWithOptions,
                path,
                key
              );
            case AttributeType.SELECT_MULTIPLE:
              return buildCheckboxWithSelect(
                entry as AttributeWithOptions,
                path,
                key
              );
            case AttributeType.SELECT_ONE:
              return buildCheckboxWithRadios(
                entry as AttributeWithOptions,
                path,
                key
              );
            case AttributeType.PASTE_OR_UPLOAD:
              return buildCheckboxWithTextfields(entry, path, key);
          }
        }
      )}
    </div>
  );
};

export default ContentBuilder;
