import React from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import JSONValue from 'src/shared/types/JSON';
import { EntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';
import { Publication } from 'src/content/app/entity-viewer/types/publication';

import styles from './Overview.scss';

type Props = {
  sidebarPayload: EntityViewerSidebarPayload | null;
  sidebarUIState: { [key: string]: JSONValue } | null;
  updateEntityUI: (uIstate: { [key: string]: JSONValue }) => void;
};

const PublicationsAccordion = (props: Props) => {
  const publications = props.sidebarPayload?.publications || [];
  const expandedPanels = props.sidebarUIState?.publicationsAccordion
    ?.expandedPanels as string[];

  const onChange = (expandedPanels: (string | number)[] = []) => {
    props.updateEntityUI({
      publicationsAccordion: {
        expandedPanels
      }
    });
  };

  return (
    <div className={styles.accordionContainer}>
      <Accordion
        className={styles.entityViewerAccordion}
        preExpanded={expandedPanels}
        onChange={onChange}
      >
        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'publications'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              Publications
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>
              {publications.map((entry, key) => renderPublication(entry, key))}
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const renderPublication = (props: Publication, key: number) => {
  return (
    <div className={styles.publication} key={key}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.description}>{props.description}</div>
      <ExternalLink linkText={props.source.value} linkUrl={props.source.url} />
      <div className={styles.sourceDescription}>{props.source.name}</div>
    </div>
  );
};

export default PublicationsAccordion;
