// tslint:disable:max-classes-per-file

import React from 'react';
import {
  InjectedButtonAttributes,
  InjectedHeadingAttributes,
  InjectedPanelAttributes
} from '../helpers/AccordionStore';
import {
  AccordionContext,
  Consumer as AccordionContextConsumer
} from './AccordionContext';

export type UUID = string | number;

type ProviderProps = {
  children?: React.ReactNode;
  uuid: UUID;
  accordionContext: AccordionContext;
};

export type ProviderWrapperProps = Pick<
  ProviderProps,
  Exclude<keyof ProviderProps, 'accordionContext'>
>;

export type ItemContext = {
  uuid: UUID;
  expanded: boolean;
  disabled: boolean;
  panelAttributes: InjectedPanelAttributes;
  headingAttributes: InjectedHeadingAttributes;
  buttonAttributes: InjectedButtonAttributes;
  toggleExpanded(): void;
};

const Context = React.createContext(null as ItemContext | null);

class Provider extends React.Component<ProviderProps> {
  public toggleExpanded = (): void => {
    this.props.accordionContext.toggleExpanded(this.props.uuid);
  };

  public renderChildren = (accordionContext: AccordionContext): JSX.Element => {
    const { uuid } = this.props;

    const expanded = accordionContext.isItemExpanded(uuid);
    const disabled = accordionContext.isItemDisabled(uuid);
    const panelAttributes = accordionContext.getPanelAttributes(uuid);
    const headingAttributes = accordionContext.getHeadingAttributes(uuid);
    const buttonAttributes = accordionContext.getButtonAttributes(uuid);

    return (
      <Context.Provider
        value={{
          buttonAttributes,
          disabled,
          expanded,
          headingAttributes,
          panelAttributes,
          toggleExpanded: this.toggleExpanded,
          uuid
        }}
        children={this.props.children}
      />
    );
  };

  public render(): JSX.Element {
    return (
      <AccordionContextConsumer>{this.renderChildren}</AccordionContextConsumer>
    );
  }
}

const ProviderWrapper: React.SFC<ProviderWrapperProps> = (
  props: ProviderWrapperProps
): JSX.Element => (
  <AccordionContextConsumer>
    {(accordionContext: AccordionContext): JSX.Element => (
      <Provider {...props} accordionContext={accordionContext} />
    )}
  </AccordionContextConsumer>
);

export { ProviderWrapper as Provider };

type ConsumerProps = {
  children(container: ItemContext): React.ReactNode;
};

export class Consumer extends React.PureComponent<ConsumerProps> {
  public renderChildren = (container: ItemContext | null): React.ReactNode => {
    return container ? this.props.children(container) : null;
  };

  public render(): JSX.Element {
    return <Context.Consumer>{this.renderChildren}</Context.Consumer>;
  }
}
