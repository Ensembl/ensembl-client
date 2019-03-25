// tslint:disable:max-classes-per-file

import React from 'react';
import { UUID } from '../ItemContainer/ItemContainer';

// Arbitrary, but ought to be unique to avoid context namespace clashes.
export const CONTEXT_KEY = 'AccordionContainer';

export type Item = {
  uuid: UUID;
  expanded: boolean;
  disabled?: boolean;
};

export type ProviderState = {
  items: Item[];
};

export type ProviderProps = {
  allowMultiple?: boolean;
  children?: React.ReactNode;
  items?: Item[];
  onChange?(args: UUID | UUID[]): void;
};

export type AccordionContainer = {
  allowMultiple: boolean;
  items: Item[];
  addItem(item: Item): void;
  removeItem(uuid: UUID): void;
  setExpanded(uuid: UUID, expanded?: boolean): void;
};

export type ConsumerProps = {
  children(
    container: { [P in keyof AccordionContainer]?: AccordionContainer[P] }
  ): React.ReactNode;
};

type ConsumerState = {};

type ConsumerContext = {
  [CONTEXT_KEY](): null;
};

export class Provider extends React.Component<ProviderProps, ProviderState> {
  public static childContextTypes: { [CONTEXT_KEY](): null } = {
    [CONTEXT_KEY]: (): null => null
  };

  public state: ProviderState = {
    items: this.props.items || []
  };

  public getChildContext(): { [CONTEXT_KEY]: AccordionContainer } {
    const context: AccordionContainer = {
      addItem: this.addItem,
      allowMultiple: !!this.props.allowMultiple,
      items: this.state.items,
      removeItem: this.removeItem,
      setExpanded: this.setExpanded
    };

    return {
      [CONTEXT_KEY]: context
    };
  }

  public addItem = (newItem: Item): void => {
    // Need to use callback style otherwise race-conditions are created by concurrent registrations.
    this.setState((state: ProviderState) => {
      let items: Item[];

      if (state.items.some((item: Item) => item.uuid === newItem.uuid)) {
        // tslint:disable-next-line:no-console
        console.error(
          `AccordionItem error: One item already has the uuid "${
            newItem.uuid
          }". Uuid property must be unique.`
        );
      }
      if (this.props.allowMultiple && newItem.expanded) {
        // If this is a true accordion and the new item is expanded, then the others must be closed.
        items = [
          ...state.items.map((item: Item) => ({
            ...item,
            expanded: false
          })),
          newItem
        ];
      } else {
        items = [...state.items, newItem];
      }

      return {
        items
      };
    });
  };

  public removeItem = (key: UUID): void => {
    this.setState((state: ProviderState) => ({
      items: state.items.filter((item: Item) => item.uuid !== key)
    }));
  };

  public setExpanded = (key: UUID, expanded: boolean): void => {
    this.setState(
      (state: ProviderState) => ({
        items: state.items.map((item: Item) => {
          if (item.uuid === key) {
            return {
              ...item,
              expanded
            };
          }
          if (this.props.allowMultiple && expanded) {
            // If this is an accordion, we might need to collapse the other expanded item.
            return {
              ...item,
              expanded: false
            };
          }

          return item;
        })
      }),
      () => {
        if (this.props.onChange) {
          this.props.onChange(
            this.props.allowMultiple
              ? key
              : this.state.items
                  .filter((item: Item) => item.expanded)
                  .map((item: Item) => item.uuid)
          );
        }
      }
    );
  };

  public render(): React.ReactNode {
    return this.props.children || null;
  }
}

export class Consumer extends React.Component<
  ConsumerProps,
  ConsumerState,
  ConsumerContext
> {
  public static contextTypes: ConsumerContext = {
    [CONTEXT_KEY]: (): null => null
  };

  public render(): React.ReactNode {
    return this.props.children(this.context[CONTEXT_KEY]);
  }
}

export const getAccordionStore = <
  T extends { [CONTEXT_KEY]: AccordionContainer }
>(
  context: T
): AccordionContainer | undefined => context[CONTEXT_KEY];
