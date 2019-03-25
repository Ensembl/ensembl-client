import React from 'react';

import {
  CONTEXT_KEY,
  getAccordionStore
} from '../AccordionContainer/AccordionContainer';
import { nextUuid } from '../helpers/uuid';
import { Provider as ItemProvider } from '../ItemContainer/ItemContainer';
import AccordionItem from './AccordionItem';
import accordionStyles from '../styles/Accordion.scss';

type AccordionItemWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  hideBodyClassName?: string;
  disabled?: boolean;
  expanded?: boolean;
  uuid?: string;
};

type AccordionItemWrapperState = {};

type AccordionItemWrapperContext = {
  [CONTEXT_KEY](): null;
};

export default class AccordionItemWrapper extends React.Component<
  AccordionItemWrapperProps,
  AccordionItemWrapperState,
  AccordionItemWrapperContext
> {
  public static contextTypes: AccordionItemWrapperContext = {
    [CONTEXT_KEY]: (): null => null
  };

  public static defaultProps: AccordionItemWrapperProps = {
    className: accordionStyles.accordion__item,
    disabled: false,
    expanded: false,
    hideBodyClassName: '',
    uuid: undefined
  };

  public id: number = nextUuid();

  public render(): JSX.Element {
    const accordionStore = getAccordionStore(this.context);
    if (!accordionStore) {
      // tslint:disable-next-line:no-console
      console.error(
        'AccordionItem component cannot render because it has not been nested inside an Accordion component.'
      );

      return <></>;
    }
    const { uuid, ...rest } = this.props;
    const itemUuid = uuid !== undefined ? uuid : this.id;

    return (
      <ItemProvider uuid={itemUuid}>
        <AccordionItem
          {...rest}
          uuid={itemUuid}
          accordionStore={accordionStore}
        />
      </ItemProvider>
    );
  }
}
