import classnames from 'classnames';
import React from 'react';
import { UUID } from '../ItemContainer/ItemContainer';

type AccordionItemBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  hideBodyClassName: string;
  uuid: UUID;
  expanded?: boolean;
  disabled?: boolean;
  allowMultiple: boolean;
};

const AccordionItemBody = (props: AccordionItemBodyProps): JSX.Element => {
  const {
    className,
    hideBodyClassName,
    uuid,
    expanded,
    disabled,
    allowMultiple,
    ...rest
  } = props;

  const role = !allowMultiple ? 'region' : undefined;

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
