
// import loadData from './load-data'
// import scrollama from 'scrollama'
// import Stickyfill from 'stickyfilljs'
import * as d3 from 'd3'

const scroller = scrollama();
const MARGIN = {top: 20, right: 20, bottom: 20, left: 20};
// let windowHeight = window.innerHeight;
// let windowWidth = window.innerWidth;
// let width = 0;
// let height = 0;
// let boundedWidth = 0;
// let boundedHeight = 0;

// let currentStep = 'stepName';

// const STEP = {
//     'stepName': () => {
//         //DATA
//         //SCALE
//         const xScale = d3.scaleLinear()
//             .domain()
//             .range();
//         const yScale = d3.scaleLinear()
//             .domain()
//             .range();
//         //AXIS
//         //LINE GENERATOR
//         const lineGenerator = d3.line()
//             .x(d => xScale(d.year))
//             .y(d => yScale(d.production))
//             .curve(d3.curveMonotoneX);
//         //CHART
//     }
// }


// function updateStep(){
//     STEP[currentStep]();
// }

// function handleStepEnter(sel){
//     currentStep = sel.element.dataset.step;
//     updateStep();
// }

// function setupScroller(){
//     Stickyfill.add($graphic.node());
//     scroller.setup({
//         step: '#sectionName .scroll__text .step',
//         offset: 0.5
//     })
//     .onStepEnter(handleStepEnter);
// }

// function updateDimensions(){
//     windowHeight = window.innerHeight;
//     width = $graphic.node().offsetWidth;
//     height = Math.floor(windowHeight * 0.6);
//     boundedWidth = width - MARGIN.left - MARGIN.right;
//     boundedHeight = height - MARGIN.top - MARGIN.bottom;
// }

// function resize() {
//     updateDimensions();
//     $svg.attr('height', height).attr('width', width);
//     $gVis.attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);
//     $step.style('height', Math.floor(windowHeight * 0.8));
//     updateStep();
// }

function init() {
  console.log('Make something awesome!');
//   loadData('data-path.csv')
//         .then(result => {
//             console.log(result)
//             setupScroller();
//             resize();
//         })
//         .catch(console.error);
}

export default { init, resize };