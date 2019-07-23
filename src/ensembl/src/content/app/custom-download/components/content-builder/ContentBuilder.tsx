import React from 'react';
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

import styles from './ContentBuilder.scss';

import get from 'lodash/get';
import {
  Attribute,
  AttributeWithContent,
  AttributeWithOptions
} from 'src/content/app/custom-download/types/Attributes';
import JSONValue, { PrimitiveOrArrayValue } from 'src/shared/types/JSON';

type Path = (string | number)[];
let path: Path = [];

type ContentBuilderProps = {
  data: AttributeWithContent;
  selectedData: JSONValue;
  onChange: (type: string, path: Path, payload: PrimitiveOrArrayValue) => void;
  contentState: JSONValue;
  onContentStateChange: (
    type: string,
    path: Path,
    payload: PrimitiveOrArrayValue
  ) => void;
  path?: Path;
  contentProps?: {
    [key: string]: JSONValue;
  };
};

const ContentBuilder = (props: ContentBuilderProps) => {
  const onChangeHandler = (
    type: string,
    path: Path,
    payload: PrimitiveOrArrayValue
  ) => {
    props.onChange(type, path, payload);
  };

  const onContentStateChangeHandler = (
    type: string,
    path: Path,
    payload: PrimitiveOrArrayValue
  ) => {
    props.onContentStateChange(type, path, payload);
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
            onChangeHandler(entry.type, currentPath, selectedOptions)
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
      <div className={styles.checkboxWitRadiosWrapper}>
        <CheckboxWithRadios
          label={entry.label}
          disabled={entry.disabled}
          onChange={(selectedOption: string | number | boolean) =>
            onChangeHandler(entry.type, currentPath, selectedOption)
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

    const gridOptions = [...entry.options];

    const gridClone: CheckboxGridOption[] = [];

    Object.values(gridOptions as CheckboxGridOption[]).map((option) => {
      const optionClone = { ...option };
      if (selectedOptions[option.id] !== undefined) {
        optionClone.isChecked = selectedOptions[option.id];
      } else if (optionClone.isChecked) {
        onChangeHandler(entry.type, [...currentPath, optionClone.id], true);
      }
      gridClone.push(optionClone);
    });

    const additionalProps = props.contentProps
      ? props.contentProps['checkbox_grid']
      : {};

    return (
      <CheckboxGrid
        onChange={(status: boolean, id: string) =>
          onChangeHandler(entry.type, [...currentPath, id], status)
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
            onChange={onChangeHandler}
            onContentStateChange={onContentStateChangeHandler}
            selectedData={props.selectedData}
            contentState={props.contentState}
            path={path}
          />
        </AccordionItemPanel>
      </AccordionItem>
    );
  };

  const buildAccordion = (entry: AttributeWithContent, path: Path) => {
    const currentPath = [...path, entry.id];
    const preExpandedPanels = get(props.contentState, currentPath, []);

    return (
      <Accordion
        allowMultipleExpanded={true}
        onChange={(expandedPanels) =>
          onContentStateChangeHandler(entry.type, currentPath, expandedPanels)
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
      <div className={styles.checkboxWitRadiosWrapper}>
        <CheckboxWithTextfields
          label={entry.label}
          disabled={entry.disabled}
          allowMultiple={true}
          onChange={(values: string[]) =>
            onChangeHandler(entry.type, currentPath, values)
          }
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
            case 'section_group':
              return (
                <div key={key}>
                  {buildAccordion(entry as AttributeWithContent, path)}
                </div>
              );
            case 'section':
              return (
                <div key={key}>
                  {buildAccordionItem(entry as AttributeWithContent, path)}
                </div>
              );
            case 'checkbox_grid':
              return (
                <div key={key}>
                  {buildCheckboxGrid(entry as AttributeWithOptions, path)}
                </div>
              );
            case 'select_multiple':
              return (
                <div key={key}>
                  {buildCheckboxWithSelect(entry as AttributeWithOptions, path)}
                </div>
              );
            case 'select_one':
              return (
                <div key={key}>
                  {buildCheckboxWithRadios(entry as AttributeWithOptions, path)}
                </div>
              );
            case 'paste_or_upload':
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
