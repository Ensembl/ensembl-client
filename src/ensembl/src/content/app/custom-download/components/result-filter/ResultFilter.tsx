import React from 'react';
import styles from './ResultFilter.scss';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared';

const ResultFilter = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.resultFilterHint}>
        Filter the results to download only the information you need - the
        filtered content will appear as rows in a table
      </div>
      <Accordion>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Genes & transcripts</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Regions</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Variants</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Phenotypes</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              Protein domains & families
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Homologues</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ResultFilter;
