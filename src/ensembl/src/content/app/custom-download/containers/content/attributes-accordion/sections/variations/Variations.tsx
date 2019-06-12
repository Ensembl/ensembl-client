import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/accordion';

import {
  getGermlineVariationAttributes,
  getSomaticVariationAttributes,
  getVariationAccordionExpandedPanels
} from '../../state/attributesAccordionSelector';
import {
  setSomaticVariationAttributes,
  setGermlineVariationAttributes,
  setVariationAccordionExpandedPanels
} from '../../state/attributesAccordionActions';
import CheckboxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import AttributesSection from 'src/content/app/custom-download/types/Attributes';

import styles from './Variations.scss';

type Props = StateProps & DispatchProps;

const Variations = (props: Props) => {
  const germlineOnChangeHandler = (
    status: boolean,
    subSection: string,
    attributeId: string
  ) => {
    if (!props.germlineVariationAttributes) {
      return;
    }
    const newGermlineAttributes = { ...props.germlineVariationAttributes };

    newGermlineAttributes[subSection][attributeId].isChecked = status;
    props.setGermlineVariationAttributes(newGermlineAttributes);
  };

  const somaticOnChangeHandler = (
    status: boolean,
    subSection: string,
    attributeId: string
  ) => {
    if (!props.somaticVariationAttributes) {
      return;
    }

    const newSomaticAttributes = { ...props.somaticVariationAttributes };

    newSomaticAttributes[subSection][attributeId].isChecked = status;
    props.setSomaticVariationAttributes(newSomaticAttributes);
  };

  const accordionOnChange = (newExpandedPanels: []) => {
    props.setVariationAccordionExpandedPanels(newExpandedPanels);
  };

  return (
    <Accordion
      allowMultipleExpanded={true}
      className={styles.variationAccordion}
      onChange={accordionOnChange}
      preExpanded={props.expandedPanels}
    >
      <AccordionItem uuid={'germline_variation'}>
        <AccordionItemHeading>
          <AccordionItemButton className={styles.variationAccordionButton}>
            Germline variation
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <CheckboxGrid
            checkboxOnChange={germlineOnChangeHandler}
            gridData={props.germlineVariationAttributes}
            columns={3}
          />
        </AccordionItemPanel>
      </AccordionItem>

      <AccordionItem uuid={'somatic_variation'}>
        <AccordionItemHeading>
          <AccordionItemButton className={styles.variationAccordionButton}>
            Somatic variation
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <CheckboxGrid
            checkboxOnChange={somaticOnChangeHandler}
            gridData={props.somaticVariationAttributes}
            columns={3}
          />
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};

type DispatchProps = {
  setGermlineVariationAttributes: (
    setGermlineVariationAttributes: AttributesSection
  ) => void;
  setSomaticVariationAttributes: (
    setSomaticVariationAttributes: AttributesSection
  ) => void;
  setVariationAccordionExpandedPanels: (
    setVariationAccordionExpandedPanels: string[]
  ) => void;
};

const mapDispatchToProps: DispatchProps = {
  setGermlineVariationAttributes,
  setSomaticVariationAttributes,
  setVariationAccordionExpandedPanels
};

type StateProps = {
  germlineVariationAttributes: AttributesSection;
  somaticVariationAttributes: AttributesSection;
  expandedPanels: [];
};

const mapStateToProps = (state: RootState): StateProps => ({
  germlineVariationAttributes: getGermlineVariationAttributes(state),
  somaticVariationAttributes: getSomaticVariationAttributes(state),
  expandedPanels: getVariationAccordionExpandedPanels(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Variations);
