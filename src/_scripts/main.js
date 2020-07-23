// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import 'core-js';
import 'regenerator-runtime/runtime';
import $ from 'jquery';
import * as d3 from 'd3';
import { Link } from '../_modules/link/link';
import graphic from './_graphic.js';

$(() => {
  new Link(); // Activate Link modules logic
});

const body = d3.select("body");
let previousWidth = 0;

function resize() {
  // only do resize on width changes, not height
  // (remove the conditional if you want to trigger on height change)
  const width = body.node().offsetWidth;
  if (previousWidth !== width) {
    previousWidth = width;
    graphic.resize();
  }
}


function init() {
  // setup resize event
  window.addEventListener("resize", resize);
  // initialize graphic
  graphic.init();
}

init();

