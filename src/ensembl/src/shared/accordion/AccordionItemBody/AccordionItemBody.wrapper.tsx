import * as React from 'react';
import * as propTypes from '../helpers/propTypes';
import accordionStyles from '../styles/Accordion.scss';

import {
  CONTEXT_KEY as ACCORDION_CONTEXT_KEY,
  getAccordionStore,
  Item
} from '../AccordionContainer/AccordionContainer';
import {
  CONTEXT_KEY as ITEM_CONTEXT_KEY,
  getItemStore
} from '../ItemContainer/ItemContainer';
import AccordionItemBody from './AccordionItemBody';

type AccordionItemBodyWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  hideBodyClassName: string;
};

type AccordionItemBodyWrapperState = {};

type AccordionItemBodyWrapperContext = {
  [ACCORDION_CONTEXT_KEY](): null;
  [ITEM_CONTEXT_KEY](): null;
};

export default class AccordionItemBodyWrapper extends React.Component<
  AccordionItemBodyWrapperProps,
  AccordionItemBodyWrapperState,
  AccordionItemBodyWrapperContext
> {
  public static contextTypes: AccordionItemBodyWrapperContext = {
    [ACCORDION_CONTEXT_KEY]: propTypes.wildcard,
    [ITEM_CONTEXT_KEY]: propTypes.wildcard
  };

  public static defaultProps: AccordionItemBodyWrapperProps = {
    className: accordionStyles.accordion__body,
    hideBodyClassName: accordionStyles['accordion__body--hidden']
  };

  public render(): JSX.Element {
    const accordionStore = getAccordionStore(this.context);

    if (!accordionStore) {
      // tslint:disable-next-line:no-console
      console.error(
        'AccordionItemBody component cannot render because it has not been nested inside an Accordion component.'
      );

      return <></>;
    }

    const itemStore = getItemStore(this.context);

    if (!itemStore) {
      // tslint:disable-next-line:no-console
      console.error(
        'AccordionItemBody component cannot render because it has not been nested inside an AccordionItem component.'
      );

      return <></>;
    }

    const { uuid } = itemStore;
    const { items, accordion } = accordionStore;
    const item = items.filter((stateItem: Item) => stateItem.uuid === uuid)[0];

    return item ? (
      <AccordionItemBody {...this.props} {...item} accordion={accordion} />
    ) : (
      <></>
    );
  }
}
