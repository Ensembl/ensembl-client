import * as React from 'react';
import { UUID } from '../ItemContainer/ItemContainer';

import { Consumer, Provider } from '../AccordionContainer/AccordionContainer';
import Accordion from './Accordion';
import accordionStyles from '../styles/Accordion.scss';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type AccordionWrapperProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> & {
  accordion?: boolean;
  onChange(args: UUID | UUID[]): void;
};

export default class AccordionWrapper extends React.Component<
  AccordionWrapperProps
> {
  public static defaultProps: AccordionWrapperProps = {
    accordion: true,
    className: accordionStyles.accordion,
    onChange: (): void => {
      //
    }
  };

  public renderAccordion = (): JSX.Element => {
    const { accordion, onChange, ...rest } = this.props;

    return <Accordion {...rest} />;
  };

  public render(): JSX.Element {
    return (
      <Provider accordion={this.props.accordion} onChange={this.props.onChange}>
        <Consumer>{this.renderAccordion}</Consumer>
      </Provider>
    );
  }
}
