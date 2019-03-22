import { default as classnames } from 'classnames';
import * as React from 'react';
import { UUID } from '../ItemContainer/ItemContainer';
import accordionStyles from '../styles/Accordion.scss';

type AccordionItemTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  hideBodyClassName: string;
  expanded?: boolean;
  uuid: UUID;
  disabled?: boolean;
  setExpanded(uuid: UUID, expanded: boolean): void;
};

type AccordionItemTitleState = {};

export default class AccordionItemTitle extends React.Component<
  AccordionItemTitleProps,
  AccordionItemTitleState
> {
  public handleClick = (): void => {
    const { uuid, expanded, setExpanded } = this.props;

    setExpanded(uuid, !expanded);
  };
  public render(): JSX.Element {
    const {
      className,
      hideBodyClassName,
      expanded,
      uuid,
      disabled
    } = this.props;

    const id = `accordion__title-${uuid}`;
    const titleClassName = classnames(className, {
      [hideBodyClassName]: hideBodyClassName && !expanded
    });

    const onClick = disabled ? undefined : this.handleClick;

    const childrenWithWrapperDiv = React.Children.map(
      this.props.children,
      (child) => {
        return (
          <>
            {child}

            <div
              className={accordionStyles.accordion__arrow}
              role="presentation"
            />
          </>
        );
      }
    );

    return (
      <div
        id={id}
        aria-expanded={expanded}
        className={titleClassName}
        onClick={onClick}
        role={'button'}
        tabIndex={0}
      >
        {childrenWithWrapperDiv}
      </div>
    );
  }
}
