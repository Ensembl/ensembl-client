import React, { useCallback } from 'react';
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
import CheckBoxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import styles from './Variations.scss';

type Props = StateProps & DispatchProps;

const Variations = (props: Props) => {
  const germlineOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      if (!props.germlineVariationAttributes) {
        return;
      }
      const newGermlineAttributes = { ...props.germlineVariationAttributes };

      newGermlineAttributes[subSection][attributeId].checkedStatus = status;
      props.setGermlineVariationAttributes(newGermlineAttributes);
    },
    [props.germlineVariationAttributes]
  );

  const somaticOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      if (!props.somaticVariationAttributes) {
        return;
      }

      const newSomaticAttributes = { ...props.somaticVariationAttributes };

      newSomaticAttributes[subSection][attributeId].checkedStatus = status;
      props.setSomaticVariationAttributes(newSomaticAttributes);
    },
    [props.somaticVariationAttributes]
  );

  const accordionOnChange = useCallback(
    (newExpandedPanels: []) => {
      props.setVariationAccordionExpandedPanels(newExpandedPanels);
    },
    [props.expandedPanels]
  );

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
          <CheckBoxGrid
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
          <CheckBoxGrid
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
  setGermlineVariationAttributes: (setGermlineVariationAttributes: any) => void;
  setSomaticVariationAttributes: (setSomaticVariationAttributes: any) => void;
  setVariationAccordionExpandedPanels: (
    setVariationAccordionExpandedPanels: any
  ) => void;
};

const mapDispatchToProps: DispatchProps = {
  setGermlineVariationAttributes,
  setSomaticVariationAttributes,
  setVariationAccordionExpandedPanels
};

type StateProps = {
  germlineVariationAttributes: any;
  somaticVariationAttributes: any;
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
