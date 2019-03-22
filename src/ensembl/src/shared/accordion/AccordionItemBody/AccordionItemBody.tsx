import { default as classnames } from 'classnames';
import * as React from 'react';
import { UUID } from '../ItemContainer/ItemContainer';

type AccordionItemBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  hideBodyClassName: string;
  uuid: UUID;
  expanded?: boolean;
  disabled?: boolean;
  accordion: boolean;
};

const AccordionItemBody = (props: AccordionItemBodyProps): JSX.Element => {
  const {
    className,
    hideBodyClassName,
    uuid,
    expanded,
    disabled,
    accordion,
    ...rest
  } = props;

  const role = accordion ? 'region' : undefined;

  return (
    <div
      id={`accordion__body-${uuid}`}
      className={classnames(className, {
        [hideBodyClassName]: !expanded
      })}
      role={role}
      {...rest}
    />
  );
};

export default AccordionItemBody;
