const svg = d3.select("#chart").append("svg"); 
const width = window.innerWidth;
const height = window.innerWidth * 5 / (7.57);
const margin = {
    top: 10,
    right: 80,
    bottom: 0,
    left: 80
}


const boundedWidth = width - margin.left - margin.right;
const boundedHeight = height - margin.top - margin.bottom;
const innerMargin = 10;
const textWidth = 20;
const strokeWidth = 1.3;
const opac = 0.2;

const increasedButton = d3.select("#increased");
const decreasedButton = d3.select("#decreased");
const flatButton = d3.select("#flat");

function drawChart(data, list){
    svg.attr("width", width)
        .attr("height", height);

    const groupedData = d3.nest()
        .key(d => d.artist)
        .entries(data);

    const numOfArtists = groupedData.length;
    
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScaleText = d3.scalePoint()
        .domain(list)
        .range([0, boundedWidth]);

    const yScale = d3.scaleLinear()
        .domain([1, d3.max(data, d => +d.number)])
        .range([margin.top, boundedHeight - margin.bottom]);
    
    const xScaleOne = d3.scalePoint()
        .domain([list[0], list[1]])
        .range([textWidth/2, ((boundedWidth/2 - textWidth)/2 )])

    const xScaleTwo = d3.scalePoint()
    .domain([list[1], list[2]])
    .range([((boundedWidth/2 - textWidth)/2 + textWidth), (boundedWidth/2 - textWidth/2)])

    const xScaleThree = d3.scalePoint()
    .domain([list[2], list[3]])
    .range([(boundedWidth/2 + textWidth/2), ((boundedWidth/2 - textWidth)/2 + boundedWidth/2)])
    
    const xScaleFour = d3.scalePoint()
    .domain([list[3], list[4]])
    .range([((boundedWidth/2 - textWidth)/2 + boundedWidth/2 + textWidth), (boundedWidth - textWidth/2)])

    // const color = d3.interpolateSpectral;

    d3.select(".first-x")
        .html(`${list[0]}`)
        .style("left", `${xScaleOne(list[0])+textWidth}px`);

    d3.select(".sec-x")
        .html(`${list[1]}`)
        .style("left", `${xScaleTwo(list[1])+textWidth}px`);

    d3.select(".third-x")
        .html(`${list[2]}`)
        .style("left", `${xScaleThree(list[2])+textWidth}px`);

    d3.select(".fourth-x")
        .html(`${list[3]}`)
        .style("left", `${xScaleFour(list[3])+textWidth}px`);

    d3.select(".fifth-x")
        .html(`${list[4]}`)
        .style("left", `${xScaleFour(list[4])+textWidth}px`);

    const lineGeneratorOne = d3.line()
        .x(d => xScaleOne(d.type))
        .y(d => yScale(+d.number))
        // .curve(d3.curveCatmullRom.alpha(0.5));

    const lineGeneratorTwo = d3.line()
        .x(d => xScaleTwo(d.type))
        .y(d => yScale(+d.number))
        // .curve(d3.curveCatmullRom.alpha(0.5));

    const lineGeneratorThree = d3.line()
        .x(d => xScaleThree(d.type))
        .y(d => yScale(+d.number))
        // .curve(d3.curveCatmullRom.alpha(0.5));

    const lineGeneratorFour = d3.line()
        .x(d => xScaleFour(d.type))
        .y(d => yScale(+d.number))
        // .curve(d3.curveCatmullRom.alpha(0.5));

    function nestedData(data){
        const nested = d3.nest()
                .key(d => d.artist)
                .entries(data);
        return nested;
    }

    const lineOneData = data.filter(d => {
        return d.type == list[0] || 
                d.type == list[1]
    })

    const lineTwoData = data.filter(d => {
        return d.type == list[1] || 
                d.type == list[2]
    })

    const lineThreeData = data.filter(d => {
        return d.type == list[2] || 
                d.type == list[3]
    })

    const lineFourData = data.filter(d => {
        return d.type == list[3]|| 
                d.type == list[4]
    })

    
    
    const linesOne = chart.append("g").selectAll(".one")
        .data(nestedData(lineOneData))
          .enter().append("path")
          .attr('class', 'one')
          .attr("class", "lineGroup")
          .attr('class', d => d.key)
          .attr('d', d => lineGeneratorOne(d.values))


    const linesTwo = chart.append("g").selectAll(".two")
        .data(nestedData(lineTwoData))
          .enter().append("path")
          .attr('class', 'two')
          .attr("class", "lineGroup")
          .attr('class', d => d.key)
          .attr('d', d => lineGeneratorTwo(d.values));

    const linesThree = chart.append("g").selectAll(".three")
        .data(nestedData(lineThreeData))
          .enter().append("path")
          .attr('class', 'three')
          .attr("class", "lineGroup")
          .attr('class', d => d.key)
          .attr('d', d => lineGeneratorThree(d.values));

    const linesFour = chart.append("g").selectAll(".four")
        .data(nestedData(lineFourData))
          .enter().append("path")
          .attr('class', 'four')
          .attr("class", "lineGroup")
          .attr('class', d => d.key)
          .attr('d', d => lineGeneratorFour(d.values));
    
    function calVariance(data){
        let pct; 
        if (data.values[0].type == "prestige_Top10%_rank" && data.values[1].type == "prestige_avg_rank") {
            pct = (+data.values[0].number - (+data.values[1].number))/numOfArtists;
        } else {
            pct = (+data.values[1].number - (+data.values[0].number))/numOfArtists;
        }
        return pct;
    }        

    function colorByVariance(num){
        
        const pct = calVariance(num);
        
        if (pct >= 0.1) {
            return "#58a4b0"
            // return "none"
        } else if (pct <= (-0.1)){
            return "#373f51"
            // return "none"
        } else {
            return "#a9bcd0"
            // return "none"
        }
        // console.log(pct)
    }

    d3.selectAll(".lineGroup")
        .attr("fill", "none")
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("opacity", opac)
        .attr("stroke", d => colorByVariance(d))
        .on("mouseover", d => {
            d3.select(".text-block")
                .html(`${d.key}`);

            d3.selectAll("path")
                .attr("opacity", e => {
                    if (e.key == d.key) {
                        return opac*2
                    } else {
                        return opac/4
                    }
                })
                .attr("stroke-width",  e => {
                    if (e.key == d.key) {
                        return strokeWidth*2
                    } else {
                        return strokeWidth/2
                    }
                })
        })   
        .on("mouseout", d => {
            d3.selectAll("path")
                .attr("opacity", opac)
                .attr("stroke-width", strokeWidth);

            d3.select(".text-block")
                .html(` `);
            
        }) 
    //   .attr("stroke", (d, i) => {
    //     const t = i / groupedData.length;
    //     return `${color(t)}`;
    //  })

    increasedButton.on("click", () => {
        d3.selectAll("path")
                .attr("opacity", e => {
                    const pct = calVariance(e);
        
                    if (pct >= 0.1) {
                        return opac
                        // return "none"
                    } else {
                        return 0
                    }
                })
    })

    decreasedButton.on("click", () => {
        d3.selectAll("path")
                .attr("opacity", e => {
                    const pct = calVariance(e);
        
                    if (pct <= -0.1) {
                        return opac
                        // return "none"
                    } else {
                        return 0
                    }
                })                    
    })

    flatButton.on("click", () => {
        d3.selectAll("path")
                .attr("opacity", e => {
                    const pct = calVariance(e);
                    if ( pct < 0.1 && pct > -0.1) {
                        return opac
                        // return "none"
                    } else {
                        return 0
                    }
                })
    })
    


    const texts = chart.append("g").selectAll("text")
         .data(data, d => d.artist)
           .enter().append("text")
           .attr("x", d => xScaleText(d.type))
           .attr("y", d => yScale(d.number))
           .text(d =>  d.artist)
           .attr("font-size", 0.8)
           .attr("font-family", "helvetica")
           .attr("text-anchor", "middle")
        //    .attr("baseline-shift", "-50%")
        //    .attr("fill", d => color(d.artist));
        
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
    const shuffledList = shuffle(typeList);
    const assignedList = ["exhibitions_solo_rank", "exhibitions_total_rank", "prestige_rank", "prestige_avg_rank", "prestige_Top10%_rank"];
    drawChart(data, assignedList);
}

d3.csv("https://raw.githubusercontent.com/sabrinamochi/hungarian-art/master/data/d3_structured_artist_rankings_united.csv")
    .then(loadData);
