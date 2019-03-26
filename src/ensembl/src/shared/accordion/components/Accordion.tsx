import React from 'react';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import { Consumer, Provider } from './AccordionContext';
import { UUID } from './ItemContext';
import styles from '../css/Accordion.scss';

type AccordionProps = Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, 'onChange'>
> & {
  preExpanded?: UUID[];
  allowMultipleExpanded: boolean;
  allowZeroExpanded: boolean;
  onChange?(args: UUID[]): void;
};

export default class Accordion extends React.Component<AccordionProps> {
  public static defaultProps: AccordionProps = {
    allowMultipleExpanded: false,
    allowZeroExpanded: true,
    className: styles.accordion
  };

  public static displayName: DisplayName.Accordion = DisplayName.Accordion;

  public renderAccordion = (): JSX.Element => {
    const {
      preExpanded,
      allowMultipleExpanded,
      allowZeroExpanded,
      onChange,
      ...rest
    } = this.props;

    return <div data-accordion-component="Accordion" {...rest} />;
  };

  public render(): JSX.Element {
    return (
      <Provider
        preExpanded={this.props.preExpanded}
        allowMultipleExpanded={this.props.allowMultipleExpanded}
        allowZeroExpanded={this.props.allowZeroExpanded}
        onChange={this.props.onChange}
      >
        <Consumer>{this.renderAccordion}</Consumer>
      </Provider>
    );
  }
}
