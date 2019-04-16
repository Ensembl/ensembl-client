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

import { getAttributesAccordionExpandedPanels } from 'src/content/app/custom-download/customDownloadSelectors';
import { setAttributesAccordionExpandedPanels } from 'src/content/app/custom-download/customDownloadActions';

import { Genes, Transcripts, Variations } from './sections';

import styles from './AttributesAccordion.scss';

type Props = StateProps & DispatchProps;

const Attributes = (props: Props) => {
  const accordionOnChange = useCallback(
    (newExpandedPanels: []) => {
      props.setAttributesAccordionExpandedPanels(newExpandedPanels);
    },
    [props.expandedPanels]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.dataSelectorHint}>
        Select the information you would like to download - these attributes
        will be displayed as columns in a table
      </div>
      <Accordion
        preExpanded={props.expandedPanels}
        onChange={accordionOnChange}
      >
        <AccordionItem uuid={'genes'}>
          <AccordionItemHeading>
            <AccordionItemButton>Genes</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Genes />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'transcripts'}>
          <AccordionItemHeading>
            <AccordionItemButton>Transcripts</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Transcripts />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'exons'}>
          <AccordionItemHeading>
            <AccordionItemButton>Exons</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'sequence'}>
          <AccordionItemHeading>
            <AccordionItemButton>Sequence</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'location'}>
          <AccordionItemHeading>
            <AccordionItemButton>Location</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'variation'}>
          <AccordionItemHeading>
            <AccordionItemButton>Variation</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.variationAccordionItem}>
            <Variations />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'phenotypes'}>
          <AccordionItemHeading>
            <AccordionItemButton>Phenotypes</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'protein'}>
          <AccordionItemHeading>
            <AccordionItemButton>Protein</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'orthologues'}>
          <AccordionItemHeading>
            <AccordionItemButton>Orthologues</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'paralogues'}>
          <AccordionItemHeading>
            <AccordionItemButton>Paralogues</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

type DispatchProps = {
  setAttributesAccordionExpandedPanels: (
    setAttributesAccordionExpandedPanels: any
  ) => void;
};

const mapDispatchToProps: DispatchProps = {
  setAttributesAccordionExpandedPanels
};

type StateProps = {
  expandedPanels: [];
};

const mapStateToProps = (state: RootState): StateProps => ({
  expandedPanels: getAttributesAccordionExpandedPanels(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Attributes);
