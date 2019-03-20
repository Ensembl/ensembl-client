import React, { Component } from 'react';
import styles from './Accordion.scss';

class Accordion extends Component {
  public render() {
    return (
      <section>
        <ul className="accordion" data-accordion>
          <li className="accordion-item is-active" data-accordion-item>
            <a href="#" className="accordion-title">
              Accordion 1
            </a>
            <div className="accordion-content" data-tab-content>
              <p>Panel 1. Lorem ipsum dolor</p>
              <a href="#">Nowhere to Go</a>
            </div>
          </li>
        </ul>
      </section>
    );
  }
}

export default Accordion;
