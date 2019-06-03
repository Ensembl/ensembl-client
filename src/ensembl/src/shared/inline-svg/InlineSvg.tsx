/*
The purpose of this component is to get an svg image over the network,
and then to inline it into the DOM (instead of assigning it as a src attribute
to the img element).

The reason for doing so is that inline svg’s can be styled with CSS,
whereas the svg’s added using the img element cannot

Note that since this component relies on fetching the svg image
via an Ajax request, the server of the images should either be on the same
domain as the client, or should allow CORS requests.
*/

import React, { useState, useEffect, useRef } from 'react';

import apiService from 'src/services/api-service';

import styles from './InlineSvg.scss';

type Props = {
  src: string; // url of the svg
};

const InlineSVG = (props: Props) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [isSvgSet, setIsSvgSet] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiService
      .fetch(props.src, {
        headers: {
          'Content-Type': 'text/html'
        }
      })
      .then((svg) => setSvg(svg));
  }, []);

  useEffect(() => {
    if (!isSvgSet && svg && containerRef.current) {
      const container = containerRef.current;
      container.insertAdjacentHTML('afterbegin', svg);
      setIsSvgSet(true);
    }
  });

  return <div className={styles.inlineSvgContainer} ref={containerRef} />;
};

export default InlineSVG;
