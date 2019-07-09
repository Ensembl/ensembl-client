import React from 'react';
import CheckboxWithSelects from 'src/content/app/custom-download/components/checkbox-with-selects/CheckboxWithSelects';
import CheckboxWithRadios from 'src/content/app/custom-download/components/checkbox-with-radios/CheckboxWithRadios';
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
import { Filter } from '../../sample-data/filters';

type Path = (string | number)[];
let path: Path = [];

type ContentBuilderProps = {
  data: any;
  selectedData: any;
  onChange: (type: string, path: Path, payload: any) => void;
  path?: Path;
};

const ContentBuilder = (props: ContentBuilderProps) => {
  const onChangeHandler = (type: string, path: Path, payload: any) => {
    props.onChange(type, path, payload);
  };

  const buildCheckboxWithSelect = (entry: Filter, path: Path) => {
    const currentPath = [...path, entry.id];

    const selectedOptions = get(props.selectedData, currentPath, []);

    return (
      <div className={styles.checkboxWithSelectWrapper}>
        <CheckboxWithSelects
          label={entry.label}
          onChange={(selectedOptions: string[]) =>
            onChangeHandler(entry.type, currentPath, selectedOptions)
          }
          selectedOptions={selectedOptions}
          options={(entry.options as Option[]) || []}
        />
      </div>
    );
  };

  const buildCheckboxWithRadios = (entry: Filter, path: Path) => {
    const currentPath = [...path, entry.id];

    const selectedOption: string = get(props.selectedData, currentPath, '');

    return (
      <div className={styles.checkboxWitRadiosWrapper}>
        <CheckboxWithRadios
          label={entry.label}
          onChange={(selectedOption: string | number | boolean) =>
            onChangeHandler(entry.type, currentPath, selectedOption)
          }
          selectedOption={selectedOption}
          options={entry.options as RadioOptions}
        />
      </div>
    );
  };

  const buildCheckboxGrid = (entry: Filter, path: Path) => {
    const currentPath = [...path, entry.id];

    const selectedOptions = get(props.selectedData, currentPath, []);

    const gridOptions: CheckboxGridOption[] = {
      ...(entry.options as CheckboxGridOption[])
    };

    Object.values(gridOptions as CheckboxGridOption[]).map((option) => {
      option.isChecked = selectedOptions[option.id] ? true : false;
    });

    return (
      <div className={styles.contentWrapper}>
        <CheckboxGrid
          onChange={(status: boolean, id: string) =>
            onChangeHandler(entry.type, [...currentPath, id], status)
          }
          options={gridOptions}
          label={entry.label}
        />
      </div>
    );
  };

  const buildAccordionItem = (entry: any, path: Path) => {
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
            selectedData={props.selectedData}
            path={path}
          />
        </AccordionItemPanel>
      </AccordionItem>
    );
  };

  const buildAccordion = (entry: any, path: Path) => {
    const currentPath = [...path, entry.id];
    const preExpandedPanels = get(props.selectedData, currentPath, []);

    return (
      <Accordion
        allowMultipleExpanded={true}
        onChange={(expandedPanels) =>
          onChangeHandler(entry.type, currentPath, expandedPanels)
        }
        className={styles.accordion}
        preExpanded={preExpandedPanels}
      >
        {entry.content.map((accordionSection: any) => {
          return buildAccordionItem(accordionSection, path);
        })}
      </Accordion>
    );
  };

  path = props.path ? [...props.path, props.data.id] : [props.data.id];

  return props.data.content.map((entry: Filter) => {
    switch (entry.type) {
      case 'section_group':
        return buildAccordion(entry, path);
      case 'section':
        return buildAccordionItem(entry, path);
      case 'checkbox_grid':
        return buildCheckboxGrid(entry, path);
      case 'select_multiple':
        return buildCheckboxWithSelect(entry, path);
      case 'select_one':
        return buildCheckboxWithRadios(entry, path);
    }
  });
};

export default ContentBuilder;
