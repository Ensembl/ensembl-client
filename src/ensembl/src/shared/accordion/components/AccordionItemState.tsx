import React from 'react';
import { DivAttributes } from '../helpers/types';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

type Props = Pick<DivAttributes, Exclude<keyof DivAttributes, 'children'>> & {
  children(
    args: Partial<{ expanded: boolean; disabled: boolean }>
  ): React.ReactNode;
};

export default class AccordionItemState extends React.Component<Props> {
  public renderChildren = (itemContext: ItemContext): JSX.Element => {
    const { expanded, disabled } = itemContext;

    return <>{this.props.children({ expanded, disabled })}</>;
  };

  public render(): JSX.Element {
    return <ItemConsumer>{this.renderChildren}</ItemConsumer>;
  }
}
