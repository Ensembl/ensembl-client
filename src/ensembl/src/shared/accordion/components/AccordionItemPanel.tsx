import React from 'react';
import DisplayName from '../helpers/DisplayName';
import { DivAttributes } from '../helpers/types';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

type Props = DivAttributes;

const defaultProps = {
  className: 'accordion__panel'
};

export default class AccordionItemPanel extends React.Component<Props> {
  public static defaultProps: typeof defaultProps = defaultProps;

  public static displayName: DisplayName.AccordionItemPanel =
    DisplayName.AccordionItemPanel;

  public renderChildren = ({ panelAttributes }: ItemContext): JSX.Element => {
    return (
      <div
        data-accordion-component="AccordionItemPanel"
        {...this.props}
        {...panelAttributes}
      />
    );
  };

  public render(): JSX.Element {
    return <ItemConsumer>{this.renderChildren}</ItemConsumer>;
  }
}
