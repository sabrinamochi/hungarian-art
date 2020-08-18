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
        .range([0, boundedwidth]);

    const yScale = d3.scaleLinear()
        .domain([1, d3.max(data, d => +d.number)])
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

    // const color = d3.interpolateSpectral;

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

    const lineOneLinks = returnSourceTarget(lineOneData);
    const lineTwoLinks = returnSourceTarget(lineTwoData);
    const lineThreeLinks = returnSourceTarget(lineThreeData);
    const lineFourLinks = returnSourceTarget(lineFourData);
    
    const linesOne = chart.append("g").selectAll(".one")
        .data(lineOneLinks)
          .enter().append("path")
          .attr('class', 'one')
          .attr('d',lineGeneratorOne)


    const linesTwo = chart.append("g").selectAll(".two")
        .data(lineTwoLinks)
          .enter().append("path")
          .attr('class', 'two')
          .attr('d', lineGeneratorTwo);

    const linesThree = chart.append("g").selectAll(".three")
        .data(lineThreeLinks)
          .enter().append("path")
          .attr('class', 'three')
          .attr('d', lineGeneratorThree);

    const linesFour = chart.append("g").selectAll(".four")
        .data(lineFourLinks)
          .enter().append("path")
          .attr('class', 'four')
          .attr('d', d => lineGeneratorFour(d));
    
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

    const gradientColor = d3.scaleSequential(d3.interpolatePlasma)
    .domain([0, d3.max(data, d => +d.number)]);

    const fontSizeScale = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.number))
        .range([4, 0.5])

    const strokeSizeScale = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.number))
        .range([2.5, 0.5])


    const formatName = (data) => {
        return data.replace(".", "")
            .replace("(", "")
            .replace(")", "")
            .replace("&", "")
            .replace(" ", "-");
    }

    d3.selectAll("path")
            .attr("class", "lineGroup")
            .attr('class', d => formatName(d.source.name))
        .attr("fill", "none")
        // .attr("stroke-width", d => {
        //     return strokeSizeScale((+d.values[0].number + (+d.values[1].number)) / 2)
            
        // })
        .attr("stroke-width", strokewidth)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("opacity", 0)
        // .attr("stroke", d => colorByVariance(d))
        .attr("stroke","#70c1b3")
    
    const texts = chart.append("g");
    texts.selectAll("text")
         .data(data, d => d.artist)
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
           .attr("opacity", 0.5)
        //    .attr("baseline-shift", "-50%")
        //    .attr("fill", d => color(d.artist));

    const buttons = d3.selectAll("button");
    let buttonText,
        t = 5 * 1000;


    const artists = nestedData(lineOneData).map(d => formatName(d.key));
    const shuffledArtists = shuffle(artists);
        
    // artists.forEach((d, i) => {
    //         d3.selectAll(`.${d}`)
    //             .transition()
    //             .duration(1000)
    //             .transition()
    //             .delay(1000 + i * t)
    //             .attr("opacity", opac)
    //             .on("end", () => {
    //                 d3.select("h1")
    //                 .html(d);
    //             })
    //         d3.selectAll(`.${d}-text`)
    //             .transition()
    //             .duration(1000)
    //             .transition()
    //             .delay(1000 + i * t)
    //             .attr("opacity", 1)
                    
    //     })


    buttons.on("click", (d,i) => {

        d3.select("h1")
            .html("Hungarian Artists Ranking")

        d3.selectAll("path")
             .on("mouseover", null)
            .on("mouseout", null)

        const selButton = buttons.nodes()[i];
        buttonText = selButton.innerHTML;
 
        if (buttonText == "All") {

            artists.forEach((d, i) => {
                d3.selectAll(`.${d}`).interrupt();
            })
            
            d3.selectAll("path")
            .attr("opacity", opac)
            .on("mouseover", d => {
                // console.log(d)
                d3.select("h1")
                    .html(`${d.source.name}`);
    
                d3.selectAll("path")
                    .attr("opacity", e => {
                        if (e.source.name == d.source.name) {
                            return opac*2
                        } else {
                            return opac/4
                        }
                    })
                    .attr("stroke-width",  e => {
                        if (e.source.name == d.source.name) {
                            return strokewidth*4
                        } else {
                            return strokewidth/2
                        }
                    })
            })   
            .on("mouseout", d => {
                d3.selectAll("path")
                    .attr("opacity", opac)
                    .attr("stroke-width", strokewidth)
    
                d3.select("h1")
                    .html(`Hungarian Artists Ranking`);
                
            }) 
            
            d3.selectAll("text").attr("opacity", opac);
        
        }
        else {
            
            t = parseFloat(buttonText.replace("s", "")) * 1000;

            d3.selectAll("path").attr("opacity", 0);

            artists.forEach((d, i) => {
                d3.selectAll(`.${d}`)
                    .transition()
                    .duration(1000) 
                    .transition()
                    .delay(1000 + i * t)
                    .attr("opacity", opac)
                    .on("end", () => {
                        d3.select("h1")
                        .html(d)
                    })
                        
        })
     }
    })

    
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
