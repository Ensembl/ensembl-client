// tslint:disable:max-classes-per-file

import React from 'react';
import AccordionStore, {
  InjectedButtonAttributes,
  InjectedHeadingAttributes,
  InjectedPanelAttributes
} from '../helpers/AccordionStore';
import { UUID } from './ItemContext';

export interface ProviderProps {
  preExpanded?: UUID[];
  allowMultipleExpanded?: boolean;
  allowZeroExpanded?: boolean;
  children?: React.ReactNode;
  onChange?(args: UUID[]): void;
}

type ProviderState = AccordionStore;

export interface AccordionContext {
  allowMultipleExpanded: boolean;
  allowZeroExpanded: boolean;
  toggleExpanded(uuid: UUID): void;
  isItemDisabled(uuid: UUID): boolean;
  isItemExpanded(uuid: UUID): boolean;
  getPanelAttributes(uuid: UUID): InjectedPanelAttributes;
  getHeadingAttributes(uuid: UUID): InjectedHeadingAttributes;
  getButtonAttributes(uuid: UUID): InjectedButtonAttributes;
}

const Context = React.createContext(null as AccordionContext | null);

export class Provider extends React.PureComponent<
  ProviderProps,
  ProviderState
> {
  public static defaultProps: ProviderProps = {
    allowMultipleExpanded: false,
    allowZeroExpanded: false
  };

  public state: ProviderState = new AccordionStore({
    allowMultipleExpanded: this.props.allowMultipleExpanded,
    allowZeroExpanded: this.props.allowZeroExpanded,
    expanded: this.props.preExpanded
  });

  public toggleExpanded = (key: UUID): void => {
    this.setState(
      (state: Readonly<ProviderState>) => state.toggleExpanded(key),
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.expanded);
        }
      }
    );
  };

  public isItemDisabled = (key: UUID): boolean => {
    return this.state.isItemDisabled(key);
  };

  public isItemExpanded = (key: UUID): boolean => {
    return this.state.isItemExpanded(key);
  };

  public getPanelAttributes = (key: UUID): InjectedPanelAttributes => {
    return this.state.getPanelAttributes(key);
  };

  public getHeadingAttributes = (): InjectedHeadingAttributes => {
    return this.state.getHeadingAttributes();
  };

  public getButtonAttributes = (key: UUID): InjectedButtonAttributes => {
    return this.state.getButtonAttributes(key);
  };

  public render(): JSX.Element {
    const { allowZeroExpanded, allowMultipleExpanded } = this.state;

    return (
      <Context.Provider
        value={{
          allowMultipleExpanded,
          allowZeroExpanded,
          getButtonAttributes: this.getButtonAttributes,
          getHeadingAttributes: this.getHeadingAttributes,
          getPanelAttributes: this.getPanelAttributes,
          isItemDisabled: this.isItemDisabled,
          isItemExpanded: this.isItemExpanded,
          toggleExpanded: this.toggleExpanded
        }}
      >
        {this.props.children || null}
      </Context.Provider>
    );
  }
}

export class Consumer extends React.PureComponent<{
  children(container: AccordionContext): React.ReactNode;
}> {
  public renderChildren = (
    container: AccordionContext | null
  ): React.ReactNode => {
    return container ? this.props.children(container) : null;
  };

  public render(): JSX.Element {
    return <Context.Consumer>{this.renderChildren}</Context.Consumer>;
  }
}
