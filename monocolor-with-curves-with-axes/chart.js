const svg = d3.select("svg"); 
const width = window.innerWidth * 0.8;
const height = window.innerWidth * 5  * 0.8 / (7.57);
const margin = {
    top: 10,
    right: 80,
    bottom: 0,
    left: 80
}


const boundedwidth = width - margin.left - margin.right;
const boundedheight = height - margin.top - margin.bottom;
const innermargin = 10;
const textwidth = 20;
const strokewidth = 0.6;
const selectedStrokeWidth = 3;
const opac = 1;

svg.attr("width", width)
    .attr("height", height);

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


function drawChart(dataset){

    const x1 = "exhibitions_solo_rank";
    const x2 = "exhibitions_total_rank";
    const x3 = "prestige_rank";
    const x4 =  "prestige_avg_rank";
    const x5 =  "prestige_Top10%_rank";

    const list = [x1, x2, x3, x4, x5]

    const xScaleText = d3.scalePoint()
        .domain(list)
        .range([0, boundedwidth]);

    const yScale = d3.scaleLinear()
        .domain([1, d3.max(dataset, d => +d.number)])
        .range([margin.top, boundedheight - margin.bottom]);
    
    const xScaleOne = d3.scalePoint()
        .domain([list[0], list[1]])
        .range([textwidth/2, ((boundedwidth/2 - textwidth)/2 )])

    const xScaleTwo = d3.scalePoint()
    .domain([list[1], list[2]])
    .range([((boundedwidth/2 - textwidth)/2 + textwidth), (boundedwidth/2 - textwidth/2)])

    const xScaleThree = d3.scalePoint()
    .domain([list[2], list[3]])
    .range([(boundedwidth/2 + textwidth/2), ((boundedwidth/2 - textwidth)/2 + boundedwidth/2)])
    
    const xScaleFour = d3.scalePoint()
    .domain([list[3], list[4]])
    .range([((boundedwidth/2 - textwidth)/2 + boundedwidth/2 + textwidth), (boundedwidth - textwidth/2)])

    d3.select(".first-x")
        .html(`${list[0]}`)
        .style("left", `${xScaleOne(list[0])+textwidth}px`);

    d3.select(".sec-x")
        .html(`${list[1]}`)
        .style("left", `${xScaleTwo(list[1])+textwidth}px`);

    d3.select(".third-x")
        .html(`${list[2]}`)
        .style("left", `${xScaleThree(list[2])+textwidth}px`);

    d3.select(".fourth-x")
        .html(`${list[3]}`)
        .style("left", `${xScaleFour(list[3])+textwidth}px`);

    d3.select(".fifth-x")
        .html(`${list[4]}`)
        .style("left", `${xScaleFour(list[4])+textwidth}px`);

    const lineGeneratorOne = d3.linkHorizontal()
        .x(d => xScaleOne(d.type))
        .y(d => yScale(+d.number))

    const lineGeneratorTwo = d3.linkHorizontal()
        .x(d => xScaleTwo(d.type))
        .y(d => yScale(+d.number))

    const lineGeneratorThree = d3.linkHorizontal()
        .x(d => xScaleThree(d.type))
        .y(d => yScale(+d.number))

    const lineGeneratorFour = d3.linkHorizontal()
        .x(d => xScaleFour(d.type))
        .y(d => yScale(+d.number))

    const groupedData = d3.nest()
        .key(d => d.artist)
        .entries(dataset);

    const lineOneData = dataset.filter(d => {
        return d.type == list[0] || 
                d.type == list[1]
    })

    const lineTwoData = dataset.filter(d => {
        return d.type == list[1] || 
                d.type == list[2]
    })

    const lineThreeData = dataset.filter(d => {
        return d.type == list[2] || 
                d.type == list[3]
    })

    const lineFourData = dataset.filter(d => {
        return d.type == list[3]|| 
                d.type == list[4]
    })

    function returnSourceTarget(data){
        const newData = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = i + 1; j < data.length; j++) {
                if (data[i].artist === data[j].artist) {
                    newData.push({
                        source: {name: data[i].artist, number: data[i].number, type: data[i].type},
                        target: {name: data[j].artist, number: data[j].number, type: data[j].type}
                    });
                }
            }
        }
        return newData;
    }

    function returnSourceTarget2(data){
        const newData = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = i + 1; j < data.length; j++) {
                if (data[i].artist === data[j].artist) {
                    newData.push({
                        source: {name: data[j].artist, number: data[j].number, type: data[j].type},
                        target: {name: data[i].artist, number: data[i].number, type: data[i].type}
                    });
                }
            }
        }
        return newData;
    }
    

    const lineOneLinks = returnSourceTarget(lineOneData);
    const lineTwoLinks = returnSourceTarget(lineTwoData);
    const lineThreeLinks = returnSourceTarget(lineThreeData);
    const lineFourLinks = returnSourceTarget2(lineFourData);

    const linesOne = chart.append("g").selectAll(".one");
    const linesTwo = chart.append("g").selectAll(".two");
    const linesThree = chart.append("g").selectAll(".three");
    const linesFour = chart.append("g").selectAll(".four");

    const formatName = (data) => {
        return data.replace(" ", "-")
            .replace(".", "-")
            .replace("(", "-")
            .replace(")", "-")
            .replace("&", "-")
            .replace(" ", "-")
            .replace(",", "-");
    }

    linesOne.data(lineOneLinks)
          .enter().append("path")
          .attr('class', 'one')
          .attr('id', d => `${formatName(d.source.name)}-for-curves-1`)
          .attr('d',lineGeneratorOne)

    linesTwo.data(lineTwoLinks)
          .enter().append("path")
          .attr('class', 'two')
          .attr('id', d => `${formatName(d.source.name)}-for-curves-2`)
          .attr('d', lineGeneratorTwo);


    linesThree.data(lineThreeLinks)
          .enter().append("path")
          .attr('class', 'three')
          .attr('id', d => `${formatName(d.source.name)}-for-curves-3`)
          .attr('d', lineGeneratorThree);


    linesFour.data(lineFourLinks)
          .enter().append("path")
          .attr('class', 'four')
          .attr('id', d => `${formatName(d.source.name)}-for-curves-4`)
          .attr('d', d => lineGeneratorFour(d));      
    
    const fontSizeScale = d3.scaleLinear()
        .domain(d3.extent(dataset, d => +d.number))
        .range([2, 0.5])

    d3.selectAll("path")
      .attr("class", "lineGroup")
      .attr('class', d => formatName(d.source.name))
      .attr("fill", "none")
      .attr("stroke-width", strokewidth)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("opacity", 0)
      .attr("stroke","#70c1b3")
  
  const texts = chart.append("g");
  texts.selectAll("text")
       .data(dataset, d => d.artist)
         .enter().append("text")
         .attr("class", d => `${formatName(d.artist)}-text`)
         .attr("x", d => xScaleText(d.type))
         .attr("y", d => yScale(+d.number))
         .text(d =>  d.artist)
         .attr("font-size", d => {
          return fontSizeScale(+d.number)
          })
         .attr("font-family", "helvetica")
         .attr("text-anchor", "middle")
         .attr("opacity", opac)
      //    .attr("baseline-shift", "-50%")
      //    .attr("fill", d => color(d.artist));    
    const curveTexts = chart.append("g");
    curveTexts.selectAll("text")
        .data(dataset, d => d.artist)
        .enter().append("text")
            .attr("class", "curve-texts")
            .attr("id", d => `${formatName(d.artist)}-curve-text`)
            .attr("opacity", 0)
                

      let numOfArtists =  groupedData.length;
      const numOfArtistsArr = [...Array(numOfArtists).keys()]
    
      function getUniqueArtists(number){
            const tmp = numOfArtistsArr.slice(numOfArtistsArr)  
            const rem = [];
    
            for (let i = 0; i < number; i++){
                const index = Math.floor(Math.random()*tmp.length)
                const removed = tmp.splice(index, 1);
                rem.push(removed[0]);
            }
            return rem;
        }
    
      function getNewData(arr, indices) {
            const newData = arr.filter(function(el, index) {
              return indices.indexOf(index) !== -1;
            })
           return newData
          }
    
    //  let firstTime = 0;
     let selectedDataset= [];
     const t = 2000;
     const numOfLineToShow = 4;
     
     function selectArtists(){
    
            if(numOfArtistsArr.length < 2){
                clearInterval(timing);
                console.log("done!")
            }

            const selectedArtists = getUniqueArtists(numOfLineToShow);
            selectedDataset = [];
            for (let i = 0; i < selectedArtists.length; i++){
                    numOfArtistsArr.splice(numOfArtistsArr.indexOf(selectedArtists[i]), 1);
                    selectedDataset.push(selectedArtists[i])
                }
      
            // if (firstTime == 0){
            //     const selectedArtists = getUniqueArtists(5);
    
            //     for (let i = 0; i < selectedArtists.length; i++){
            //         numOfArtistsArr.splice(numOfArtistsArr.indexOf(selectedArtists[i]), 1);
            //         selectedDataset.push(selectedArtists[i])
            //     }
                
            // } else {
            //     const selectedArtists = getUniqueArtists(1);
            //     selectedDataset.shift()
            //     for (let i = 0; i < selectedArtists.length; i++){
            //         numOfArtistsArr.splice(numOfArtistsArr.indexOf(selectedArtists[i]), 1);
            //         selectedDataset.push(selectedArtists[i])
            //      }
            // }
    
        // firstTime += 1;
    
        const data = getNewData(groupedData, selectedDataset);
    
        const artists =  data.map(d => formatName(d.key));
        console.log(artists)

        d3.selectAll("path")
              .on("mouseover", null)
              .on("mouseout", null)

        d3.selectAll("path")
              .transition()
              .duration(t / 2)
              .attr("opacity", 0)
              

        d3.selectAll(".curve-texts")
            .transition()
            .duration(t / 2)
            .attr("opacity", 0)

            artists.forEach((d, i) => {
                  d3.selectAll(`.${d}`)
                      .transition()
                      .duration(t) 
                      .transition()
                      .delay(t + i * t)
                      .attr("opacity", opac)
                      .on("end", () => {
                        // d3.select(`${formatName(d)}-curve-text`)  
                      })       
                    const index = i+1;
                    d3.select(`#${d}-curve-text`)  
                        .append("textPath")
                            .attr("xlink:href", d => `#${formatName(d.artist)}-for-curves-${index}`)
                            .text(d => d.artist);

                    d3.select(`#${d}-curve-text`)                       
                        .transition()
                        .duration(t) 
                        .transition()
                        .delay(t + i * t)
                        .attr("opacity", opac)   
                                 
                })
    
        }
        selectArtists();
        const timing = setInterval(selectArtists, 12 * t);

   
 }


 
    

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function loadData(data){
    // console.log(data);
    const typeList = [...new Set(data.map(item => item.type))];
    drawChart(data);
}

d3.csv("../data/d3_structured_artist_rankings_united.csv")
    .then(loadData);
