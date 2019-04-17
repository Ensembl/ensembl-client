import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared';

import {
  getGermlineVariationAttributes,
  getSomaticVariationAttributes,
  getVariationAccordionExpandedPanels
} from 'src/content/app/custom-download/customDownloadSelectors';
import {
  setSomaticVariationAttributes,
  setGermlineVariationAttributes,
  setVariationAccordionExpandedPanels
} from 'src/content/app/custom-download/customDownloadActions';
import CheckBoxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import styles from './Styles.scss';

type Props = StateProps & DispatchProps;

const Variations = (props: Props) => {
  if (!props.germlineVariationAttributes || !props.somaticVariationAttributes) {
    return null;
  }
  const germlineOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newGermlineAttributes = { ...props.germlineVariationAttributes };

      newGermlineAttributes[subSection][attributeId].checkedStatus = status;
      props.setGermlineVariationAttributes(newGermlineAttributes);
    },
    [props.germlineVariationAttributes]
  );

  const somaticOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
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
