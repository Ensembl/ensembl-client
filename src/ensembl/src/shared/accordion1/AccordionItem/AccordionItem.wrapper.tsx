import React from 'react';

import {
  CONTEXT_KEY,
  getAccordionStore
} from '../AccordionContainer/AccordionContainer';
import { nextUuid } from '../helpers/uuid';
import AccordionItem from './AccordionItem';
import accordionStyles from '../styles/Accordion.scss';
import { Provider, Consumer } from '../ItemContainer/ItemContainer';

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
    hideBodyClassName: ''
  };

  public id: number = nextUuid();

  public renderAccordionItem = (): JSX.Element => {
    console.log(this.context);
    console.log(this.props);
    const { uuid, ...rest } = this.props;
    const accordionStore = getAccordionStore(this.context);
    if (!accordionStore) {
      // tslint:disable-next-line:no-console
      console.error(
        'AccordionItem component cannot render because it has not been nested inside an Accordion component.'
      );

      return <></>;
    }

    const itemUuid = uuid !== undefined ? uuid : this.id;

    return (
      <AccordionItem
        {...rest}
        uuid={itemUuid}
        accordionStore={accordionStore}
      />
    );
  };

  public render(): JSX.Element {
    const { uuid } = this.props;
    const itemUuid = uuid !== undefined ? uuid : this.id;

    return (
      <Provider uuid={itemUuid}>
        <Consumer>{this.renderAccordionItem}</Consumer>
      </Provider>
    );
  }
}
