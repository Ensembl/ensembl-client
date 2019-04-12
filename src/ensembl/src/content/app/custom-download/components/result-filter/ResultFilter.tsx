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
            <AccordionItemButton>Genes</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Transcripts</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Exons</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Sequence</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Location</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Variation</AccordionItemButton>
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
            <AccordionItemButton>Protein</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Orthologues</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>Item One content</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>Paralogues</AccordionItemButton>
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
