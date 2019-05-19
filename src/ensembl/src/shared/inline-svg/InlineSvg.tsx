/*
The purpose of this component is to get an svg image over the network,
and then to inline it into the DOM (instead of assigning it as a src attribute
to the img element).

The reason for doing so is that inline svg’s can be styled with CSS,
whereas the svg’s added using the img element cannot
*/

import React, { useState, useEffect, useRef } from 'react';

import apiService from 'src/services/api-service';

type Props = {
  src: string; // url of the svg
};

const InlineSVG = (props: Props) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [isSet, setIsSet] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiService
      .fetch(props.src, {
        host: 'http://localhost:8080', // FIXME!
        headers: {
          'Content-Type': 'text/html'
        }
      })
      .then((svg) => setSvg(svg));
  }, []);

  useEffect(() => {
    if (!isSet && svg && containerRef.current) {
      const container = containerRef.current;
      container.insertAdjacentHTML('afterbegin', svg);
      setIsSet(true);
    }
  });

  return <div ref={containerRef} />;
};

export default InlineSVG;
