import * as React from 'react';

type AccordionProps = React.HTMLAttributes<HTMLDivElement>;

const Accordion = (props: AccordionProps): JSX.Element => {
  return <div {...props} />;
};

export default Accordion;
