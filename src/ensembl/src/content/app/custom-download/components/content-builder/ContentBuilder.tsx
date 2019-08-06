import React from 'react';
import set from 'lodash/set';
import get from 'lodash/get';

import CheckboxWithSelects from 'src/content/app/custom-download/components/checkbox-with-selects/CheckboxWithSelects';
import CheckboxWithRadios from 'src/content/app/custom-download/components/checkbox-with-radios/CheckboxWithRadios';
import CheckboxWithTextfields from 'src/content/app/custom-download/components/checkbox-with-textfields/CheckboxWithTextfields';

import CheckboxGrid, {
  CheckboxGridOption
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import { RadioOptions } from 'src/shared/radio/Radio';
import { Option } from 'src/shared/select/Select';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/accordion';

import {
  Attribute,
  AttributeWithContent,
  AttributeWithOptions,
  AttributeType
} from 'src/content/app/custom-download/types/Attributes';

import JSONValue, { PrimitiveOrArrayValue } from 'src/shared/types/JSON';

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
};

const ContentBuilder = (props: ContentBuilderProps) => {
  if (!props.data) {
    return null;
  }

  const onChangeHandler = (
    path: (string | number)[],
    payload: PrimitiveOrArrayValue
  ) => {
    const newSelectedData = { ...props.selectedData };
    set(newSelectedData, path, payload);

    props.onChange(newSelectedData);
  };

  const onUiChangeHandler = (
    path: (string | number)[],
    payload: PrimitiveOrArrayValue
  ) => {
    const updatedUi = { ...props.uiState };
    set(updatedUi, path, payload);

    props.onUiChange(updatedUi);
  };

  const buildCheckboxWithSelect = (entry: AttributeWithOptions, path: Path) => {
    const currentPath = [...path, entry.id];

    const selectedOptions = get(props.selectedData, currentPath, []);

    return (
      <div className={styles.checkboxWithSelectWrapper}>
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

  const buildCheckboxWithRadios = (entry: AttributeWithOptions, path: Path) => {
    const currentPath = [...path, entry.id];

    const selectedOption: string = get(props.selectedData, currentPath, '');

    return (
      <div className={styles.checkboxWithRadiosWrapper}>
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

  const buildCheckboxGrid = (entry: AttributeWithOptions, path: Path) => {
    const currentPath = [...path, entry.id];

    const selectedOptions = get(props.selectedData, currentPath, []);

    const newSelectedData = { ...props.selectedData };
    const gridOptions = [...entry.options] as CheckboxGridOption[];
    let shouldUpdateSelectedData = false;

    gridOptions.forEach((option) => {
      if (option.isChecked && selectedOptions[option.id] === undefined) {
        set(newSelectedData, [...currentPath, option.id], true);
        shouldUpdateSelectedData = true;
      }
    });
    if (shouldUpdateSelectedData) {
      props.onChange(newSelectedData);
    }

    const gridClone = gridOptions.map((option) => {
      return {
        ...option,
        isChecked: Boolean(selectedOptions[option.id])
      };
    });

    const additionalProps = props.uiState ? props.uiState['checkbox_grid'] : {};

    return (
      <CheckboxGrid
        onChange={(status: boolean, id: string) =>
          onChangeHandler([...currentPath, id], status)
        }
        options={gridClone}
        label={entry.label}
        {...additionalProps}
      />
    );
  };

  const buildAccordionItem = (entry: AttributeWithContent, path: Path) => {
    return (
      <AccordionItem uuid={entry.id}>
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

  const buildAccordion = (entry: AttributeWithContent, path: Path) => {
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
      >
        {entry.content &&
          entry.content.map((accordionSection, key: number) => {
            return (
              <div key={key}>
                {buildAccordionItem(
                  accordionSection as AttributeWithContent,
                  path
                )}
              </div>
            );
          })}
      </Accordion>
    );
  };

  const buildCheckboxWithTextfields = (entry: Attribute, path: Path) => {
    const currentPath = [...path, entry.id];

    const values: string[] = get(props.selectedData, currentPath, '');

    return (
      <div className={styles.checkboxWithRadiosWrapper}>
        <CheckboxWithTextfields
          label={entry.label}
          disabled={entry.disabled}
          allowMultiple={true}
          onChange={(values: string[]) => onChangeHandler(currentPath, values)}
          values={values || []}
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
              return (
                <div key={key}>
                  {buildAccordion(entry as AttributeWithContent, path)}
                </div>
              );
            case AttributeType.SECTION:
              return (
                <div key={key}>
                  {buildAccordionItem(entry as AttributeWithContent, path)}
                </div>
              );
            case AttributeType.CHECKBOX_GRID:
              return (
                <div key={key}>
                  {buildCheckboxGrid(entry as AttributeWithOptions, path)}
                </div>
              );
            case AttributeType.SELECT_MULTIPLE:
              return (
                <div key={key}>
                  {buildCheckboxWithSelect(entry as AttributeWithOptions, path)}
                </div>
              );
            case AttributeType.SELECT_ONE:
              return (
                <div key={key}>
                  {buildCheckboxWithRadios(entry as AttributeWithOptions, path)}
                </div>
              );
            case AttributeType.PASTE_OR_UPLOAD:
              return (
                <div key={key}>{buildCheckboxWithTextfields(entry, path)}</div>
              );
          }
        }
      )}
    </div>
  );
};

export default ContentBuilder;
