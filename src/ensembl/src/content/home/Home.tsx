import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

type HomeProps = {};

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  return (
    <section>
      <h2>Previously viewed</h2>
      <dl>
        <dd>
          <Link to="/app/browser/human/BRCA2/13:32315474-32400266">
            Human gene BRCA2
          </Link>
        </dd>
        <dd>
          <Link to="/app/browser/human/TTN/2:178525989-178830802">
            Human transcript TTN
          </Link>
        </dd>
      </dl>
    </section>
  );
};

export default Home;
