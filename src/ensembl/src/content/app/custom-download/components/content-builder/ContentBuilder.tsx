import React from 'react';
import CheckboxWithSelects, {
  CheckboxWithSelectsProps
} from 'src/content/app/custom-download/components/checkbox-with-selects/CheckboxWithSelects';
import CheckboxWithRadios, {
  CheckboxWithRadiosProps
} from 'src/content/app/custom-download/components/checkbox-with-radios/CheckboxWithRadios';
import CheckboxGrid, {
  CheckboxGridProps
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/accordion';

const buildCheckboxWithSelect = (props: CheckboxWithSelectsProps) => {
  return (
    <CheckboxWithSelects
      label={props.label}
      onChange={() => console.log}
      selectedOptions={props.selectedOptions}
      options={props.options}
    />
  );
};

const buildCheckboxWithRadios = (props: CheckboxWithRadiosProps) => {
  return (
    <CheckboxWithRadios
      label={props.label}
      onChange={() => console.log}
      selectedOption={props.selectedOption}
      options={props.options}
    />
  );
};

const buildCheckboxGrid = (props: CheckboxGridProps) => {
  return (
    <CheckboxGrid
      checkboxOnChange={() => console.log}
      gridData={props.gridData}
      title={props.label}
      columns={3}
    />
  );
};

const buildAccordionItem = (props: any) => {
  return (
    <AccordionItem uuid={props.id}>
      <AccordionItemHeading>
        <AccordionItemButton>{props.label}</AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>{ContentBuilder(props)}</AccordionItemPanel>
    </AccordionItem>
  );
};

const buildAccordion = (props: any) => {
  return (
    <Accordion
      allowMultipleExpanded={true}
      onChange={() => console.log}
      preExpanded={props.preExpanded}
    >
      {props.content.map((accordionSection: any) => {
        return buildAccordionItem(accordionSection);
      })}
    </Accordion>
  );
};

const ContentBuilder = (data: any) => {
  return data.content.map((entry) => {
    switch (entry.type) {
      case 'accordion':
        return buildAccordion(entry);
      case 'accordion_item':
        return buildAccordionItem(entry);
      case 'checkbox_grid':
        return buildCheckboxGrid(entry);
      case 'checkbox_with_selects':
        return buildCheckboxWithSelect(entry);
      case 'checkbox_with_radios':
        return buildCheckboxWithRadios(entry);
      case 'accordion':
        return buildCheckboxWithRadios(data);
    }
  });
};

export default ContentBuilder;
