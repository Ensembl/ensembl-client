import React from 'react';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import { nextUuid } from '../helpers/uuid';
import { Provider as ItemProvider, UUID } from './ItemContext';
import styles from '../css/Accordion.scss';

type Props = DivAttributes & {
  uuid?: UUID;
};

const defaultProps = {
  className: styles.accordionItem
};

export default class AccordionItem extends React.Component<Props> {
  public static defaultProps: typeof defaultProps = defaultProps;

  public static displayName: DisplayName.AccordionItem =
    DisplayName.AccordionItem;

  public instanceUuid: UUID = nextUuid();

  public render(): JSX.Element {
    const { uuid = this.instanceUuid, ...rest } = this.props;

    return (
      <ItemProvider uuid={uuid}>
        <div data-accordion-component="AccordionItem" {...rest} />
      </ItemProvider>
    );
  }
}
