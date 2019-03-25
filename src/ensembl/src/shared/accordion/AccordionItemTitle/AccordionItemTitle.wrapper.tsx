import * as React from 'react';
import {
  CONTEXT_KEY as ACCORDION_CONTEXT_KEY,
  getAccordionStore,
  Item
} from '../AccordionContainer/AccordionContainer';
import {
  CONTEXT_KEY as ITEM_CONTEXT_KEY,
  getItemStore
} from '../ItemContainer/ItemContainer';
import { default as AccordionItemTitle } from './AccordionItemTitle';
import accordionStyles from '../styles/Accordion.scss';

type AccordionItemTitleWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  hideBodyClassName: string;
};

type AccordionItemTitleWrapperContext = {
  [ACCORDION_CONTEXT_KEY](): null;
  [ITEM_CONTEXT_KEY](): null;
};

export default class AccordionItemTitleWrapper extends React.Component<
  AccordionItemTitleWrapperProps
> {
  public static contextTypes: AccordionItemTitleWrapperContext = {
    [ACCORDION_CONTEXT_KEY]: (): null => null,
    [ITEM_CONTEXT_KEY]: (): null => null
  };

  public static defaultProps: AccordionItemTitleWrapperProps = {
    className: accordionStyles.accordion__title,
    hideBodyClassName: ''
  };

  public render(): JSX.Element {
    const accordionStore = getAccordionStore(this.context);

    if (!accordionStore) {
      // tslint:disable-next-line:no-console
      console.error(
        'AccordionItemTitle component cannot render because it has not been nested inside an Accordion component.'
      );

      return <></>;
    }

    const itemStore = getItemStore(this.context);

    if (!itemStore) {
      // tslint:disable-next-line:no-console
      console.error(
        'AccordionItemTitle component cannot render because it has not been nested inside an AccordionItem component.'
      );

      return <></>;
    }

    const { uuid } = itemStore;
    const { items } = accordionStore;
    const item = items.filter((stateItem: Item) => stateItem.uuid === uuid)[0];

    return (
      <AccordionItemTitle
        {...this.props}
        {...item}
        setExpanded={accordionStore.setExpanded}
      />
    );
  }
}
