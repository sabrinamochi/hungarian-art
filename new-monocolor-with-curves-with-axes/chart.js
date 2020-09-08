const svg = d3.select("svg"); 
const width = window.innerWidth * 0.8;
const height = window.innerWidth * 5  * 0.8 / (7.57);
const margin = {
    top: 5,
    right: 10,
    bottom: 5,
    left: 10
}


const boundedwidth = width - margin.left - margin.right;
const boundedheight = height - margin.top - margin.bottom;
const innermargin = 10;
const textwidth = 20;
const strokewidth = 0.6;
const selectedStrokeWidth = 3;
const opac = 1;

const x1 = "exhibitions_solo_rank";
const x2 = "exhibitions_total_rank";
const x3 = "prestige_rank";
const x4 =  "prestige_avg_rank";
const x5 =  "prestige_Top10%_rank";

const list = [x1, x2, x3, x4, x5];

svg.attr("width", width)
    .attr("height", height);

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


let lineGeneratorOne, 
    lineGeneratorTwo,  
    lineGeneratorThree, 
    lineGeneratorFour,
    fontSizeScale;

////////////////////////////////////////
// Groups for lines and curved texts //
///////////////////////////////////////
const linesOneGroup = chart.append("g");
const linesTwoGroup = chart.append("g");
const linesThreeGroup = chart.append("g");
const linesFourGroup = chart.append("g");

const curveTextsGroup = chart.append("g"); 


/////////////////////
// NAME FORMATTER //
////////////////////

const formatName = (data) => {
    return data.replace(" ", "-")
        .replace(".", "-")
        .replace("(", "-")
        .replace(")", "-")
        .replace("&", "-")
        .replace(" ", "-")
        .replace(",", "-");
}

function selectArtists(data){
    const first = data.filter(d => d.row_number == 0 );
    const second = data.filter(d => d.row_number == 1 );
    const third = data.filter(d => d.row_number == 2 );
    const fourth = data.filter(d => d.row_number == 3 );

    let numOfArtists =  data.length;
    const numOfArtistsArr = [...Array(numOfArtists).keys()]

    let timeCount = 0;
    
    function getUniqueArtists(number){
        
        const rem = [];
        if (number > 1) {
            for (let i = 0, len = (number / 4); i < len; i++){
                const indexFirst = Math.floor(Math.random()*first.length)
                rem.push(first[indexFirst])
                const indexSecond = Math.floor(Math.random()*second.length)
                rem.push(second[indexSecond])
                const indexThird = Math.floor(Math.random()*third.length)
                rem.push(third[indexThird])
                const indexFourth = Math.floor(Math.random()*fourth.length)
                rem.push(fourth[indexFourth])
            }
        } else {
                const lineToShow = timeCount % 4;
                if (lineToShow == 1) {
                    const indexFirst = Math.floor(Math.random()*first.length)
                    rem.push(first[indexFirst])
                } else if (lineToShow == 2){
                    const indexSecond = Math.floor(Math.random()*second.length)
                    rem.push(second[indexSecond])
                } else if (lineToShow == 3){
                    const indexThird = Math.floor(Math.random()*third.length)
                    rem.push(third[indexThird])
                } else {
                    const indexFourth = Math.floor(Math.random()*fourth.length)
                    rem.push(fourth[indexFourth])
                    
                }      
            }
            return rem;
        }

        let selectedArtists;
        
        function selectArtists(time, artistNum){   
            if(numOfArtistsArr.length < 1){
                clearInterval(timing);
                console.log("done!")
            } else {
                if (timeCount == 0){
                    selectedArtists = getUniqueArtists(artistNum);
                    for (let i = 0, len = selectedArtists.length; i < len; i++){
                        numOfArtistsArr.splice(numOfArtistsArr.indexOf(selectedArtists[i].key), 1);
                        if(selectedArtists[i].row_number == 0){
                            first.splice(first.indexOf(selectedArtists[i]), 1)
                        }else if (selectedArtists[i].row_number == 1){
                            second.splice(second.indexOf(selectedArtists[i]), 1)
                        }else if (selectedArtists[i].row_number == 2){
                            third.splice(third.indexOf(selectedArtists[i]), 1)
                        }else {
                            fourth.splice(fourth.indexOf(selectedArtists[i]), 1)
                        }
                    }
                
                } else {
                    newArtists = getUniqueArtists(1);
                    selectedArtists.shift();
                    selectedArtists.push(newArtists[0])
                
                    numOfArtistsArr.splice(numOfArtistsArr.indexOf(newArtists[0].key), 1);

                    if(newArtists[0].row_number == 0){
                        first.splice(first.indexOf(newArtists[0]), 1)
                    }else if (newArtists[0].row_number == 1){
                        second.splice(second.indexOf(newArtists[0]), 1)
                    }else if (newArtists[0].row_number == 2){
                        third.splice(third.indexOf(newArtists[0]), 1)
                    }else {
                        fourth.splice(fourth.indexOf(newArtists[0]), 1)
                    }
                }

            }

    timeCount += 1;

    const newFlatData = [];
    // console.log(selectedArtists)
    selectedArtists.map(d => {
        d.values.map(e => {
            e.row_number = d.row_number;
            newFlatData.push(e)
        })
    });

    // console.log(newFlatData)
    
    function drawChart(dataInput){
        const lineOneData = dataInput.filter(d => {
            return d.type == list[0] || 
                    d.type == list[1]
        })
    
        const lineTwoData = dataInput.filter(d => {
            return d.type == list[1] || 
                    d.type == list[2]
        })
    
        const lineThreeData = dataInput.filter(d => {
            return d.type == list[2] || 
                    d.type == list[3]
        })
    
        const lineFourData = dataInput.filter(d => {
            return d.type == list[3]|| 
                    d.type == list[4]
        })

        function returnSourceTarget(data){
            const newData = [];
            for (let i = 0, len = data.length; i < len; i++) {
                for (let j = i + 1, len = data.length; j < len; j++) {
                    if (data[i].artist === data[j].artist) {
                        newData.push({
                            source: {name: data[i].artist, number: data[i].number, type: data[i].type,  row_number: data[i].row_number},
                            target: {name: data[j].artist, number: data[j].number, type: data[j].type, row_number: data[j].row_number}
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
                            source: {name: data[j].artist, number: data[j].number, type: data[j].type, row_number: data[i].row_number},
                            target: {name: data[i].artist, number: data[i].number, type: data[i].type, row_number: data[j].row_number}
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
    
        const linesOne = linesOneGroup.selectAll(".one")
            .data(lineOneLinks, (d, i) => d.source.name);
            
        linesOne.enter().append("path")
            .attr('id', d => `${formatName(d.source.name)}-for-curves-1`)
            .attr('d',lineGeneratorOne)
            .attr('class', 'one')
            .attr("fill", "none")
            .attr("stroke-width", strokewidth)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke","#70c1b3")
            .transition().duration(time)
            .attr("opacity", 1)
    
            
        linesOne.exit()
        .transition().duration(time / 2)
        .attr("opacity", 0)
        .remove()
    
        const linesTwo = linesTwoGroup.selectAll(".two")
            .data(lineTwoLinks, (d, i) => d.source.name);
            
        linesTwo.enter().append("path")
            .attr('id', d => `${formatName(d.source.name)}-for-curves-2`)
            .attr('d',lineGeneratorTwo)
            .attr('class', 'two')
            .attr("fill", "none")
            .attr("stroke-width", strokewidth)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke","#70c1b3")
            .transition().duration(time)
            .attr("opacity", 1)
    
    
        linesTwo.exit()
        .transition().duration(time / 2)
        .attr("opacity", 0)
        .remove()
    
    
        const linesThree = linesThreeGroup.selectAll(".three")
            .data(lineThreeLinks, (d, i) => d.source.name);
            
        linesThree.enter().append("path")
            .attr('id', d => `${formatName(d.source.name)}-for-curves-3`)
            .attr('d',lineGeneratorThree)
            .attr('class', 'three')
            .attr("fill", "none")
            .attr("stroke-width", strokewidth)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke","#70c1b3")
            .transition().duration(time)
            .attr("opacity", 1)
    
    
        linesThree.exit()
        .transition().duration(time / 2)
        .attr("opacity", 0)
        .remove()
    
    
        const linesFour = linesFourGroup.selectAll(".four")
            .data(lineFourLinks, (d,i) => d.source.name);
            
        linesFour.enter().append("path")
            .attr('id', d => `${formatName(d.source.name)}-for-curves-4`)
            .attr('d',lineGeneratorFour)
            .attr('class', 'four')
            .attr("fill", "none")
            .attr("stroke-width", strokewidth)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke","#70c1b3")
            .transition().duration(time)
            .attr("opacity", 1)
    
    
        linesFour.exit()
            .transition().duration(time / 2)
            .attr("opacity", 0)
            .remove()
    }

    drawChart(newFlatData);

     let curveTexts = curveTextsGroup.selectAll("text")
        .data(newFlatData, (d, i) => {
            return i + d.artist
        })

     curveTextsEnter = curveTexts.enter()
        .append("text")
         .attr("class", "curve-texts")
         .attr("id", d => `${formatName(d.artist)}-curve-text`)
      
    let curvedTextsOrderList = [];

    if (artistNum >= 4) {
        for (let n = 0, len = (newFlatData.length  / 20); n < len; n++){
            curvedTextsOrderList.push(n * 20);
        }
    } else {
            curvedTextsOrderList.push(0)
    }

     curvedTextsOrderList.forEach(el => {
         
        curveTextsEnter.append("textPath")
                        .attr("xlink:href", (d, i) => {
                            const lineNum = +d.row_number + 1;
                            return `#${formatName(d.artist)}-for-curves-${lineNum}`
                        })
                        .text(d => d.artist)
                        .attr("font-size", 8)
                        .transition().duration(time)
                        .attr("opacity", 1)
        
            curveTexts.exit()
            .transition().delay(time / 2).duration(time) 
            .attr("opacity", 0)
            .remove()

     })

     d3.selectAll(".center-axis-text")
            .style("cursor", "pointer")
            .on("mouseover", (d, i) => {
                clearInterval(timing);
                d3.selectAll(".curve-texts")
                    .remove();

                d3.selectAll("text")
                    .attr("opacity", opac / 6);

                const completeFlatData = [];
                data.map(d => {
                    // console.log(d)
                    d.values.map(e => {
                        e.row_number = d.row_number;
                        completeFlatData.push(e)
                    })
                });
                drawChart(completeFlatData)

                const sel = d.artist;
                d3.selectAll("path")
                    .attr("opacity", e => {
                        if (e.source.name == sel) {
                            return opac
                        } else {
                            return 0
                        }
                    })
                    .attr("stroke-width",  e => {
                        if (e.source.name == sel) {
                            return strokewidth * 2
                        } else {
                            return 0
                        }
                    })

                d3.select(`#${formatName(d.artist)}-text`)
                    .attr("font-size", 15)
                    .attr("opacity", opac);

            })
            .on("mouseout", (d, i) => {
                d3.selectAll("path")   
                    .remove();

                d3.selectAll("text")
                    .attr("font-size", d => {
                        return fontSizeScale(+d.number)
                    })
                    .attr("opacity", opac / 2);

                selectedDataset= [];
                timeCount = 0;
                selectArtists(t, numOfSelectedArtists);
                timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
                
            })

  }

  let timeButtonText,
      artistsButtonText,
      t = 1000,
      intervalTime = 3000,
      numOfSelectedArtists = 40;
            
        selectArtists(t, numOfSelectedArtists);
        var timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
        
        const timeButtons = d3.selectAll(".time");
        const numOfArtistsButtons = d3.selectAll(".num-of-artists");
        
        timeButtons.on("click", (d,i) => {
            clearInterval(timing);
            selectedDataset= [];
            timeCount = 0;
            const selButton = timeButtons.nodes()[i];
            timeButtonText = selButton.innerHTML;
            intervalTime = parseFloat(timeButtonText.replace("s", "")) * 1000;
            selectArtists(t, numOfSelectedArtists);
            timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
        })
        numOfArtistsButtons.on("click", (d,i) => {
            clearInterval(timing);
            selectedDataset= [];
            timeCount = 0;
            const selButton = numOfArtistsButtons.nodes()[i];
            artistsButtonText = selButton.innerHTML;
            numOfSelectedArtists = parseInt(artistsButtonText);
            selectArtists(t, numOfSelectedArtists);
            timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
        })
}

function drawBackBone(dataset){
      
        /////////////
        // SCALES //
        ////////////
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

        fontSizeScale = d3.scaleLinear()
            .domain(d3.extent(dataset, d => +d.number))
            .range([2, 0.5])

        /////////////////////
        // DRAW TEXT AXES //
        ////////////////////
        const texts = chart.append("g");
        texts.selectAll("text")
            .data(dataset, d => d.artist)
                .enter().append("text")
                .attr("class", d => {
                    if (d.type == list[2]){
                        return "center-axis-text";
                    }
                })
                .attr("id", d => {
                    if (d.type == list[2]){
                       return `${formatName(d.artist)}-text`
                    }
                })
                .attr("x", d => xScaleText(d.type))
                .attr("y", d => yScale(+d.number))
                .text(d =>  d.artist)
                .attr("font-size", d => {
                    return fontSizeScale(+d.number)
                })
                .attr("font-family", "helvetica")
                .attr("text-anchor", "middle")
                .attr("opacity", opac / 2);
        
        
        //////////////////////
        // Line Generators //
        ////////////////////

        lineGeneratorOne = d3.linkHorizontal()
            .x(d => xScaleOne(d.type))
            .y(d => yScale(+d.number))

        lineGeneratorTwo = d3.linkHorizontal()
            .x(d => xScaleTwo(d.type))
            .y(d => yScale(+d.number))

        lineGeneratorThree = d3.linkHorizontal()
            .x(d => xScaleThree(d.type))
            .y(d => yScale(+d.number))

        lineGeneratorFour = d3.linkHorizontal()
            .x(d => xScaleFour(d.type))
            .y(d => yScale(+d.number))
        
        const groupedData = d3.nest()
            .key(d => d.artist)
            .entries(dataset);

        groupedData.forEach((row, index) => {
            if (index % 4 == 0) {
                row.row_number = 0;
            } else if (index % 4 == 1){
                row.row_number = 1;
            } else if (index % 4 == 2){
                row.row_number = 2;
            } else if (index % 4 == 3){
                row.row_number = 3;
            }
        })

        return groupedData;
}

d3.csv("../data/d3_structured_artist_rankings_united.csv")
    .then(drawBackBone)
    .then(selectArtists);

// d3.json("../data/grouped-with-curve-number.json")
//     .then(selectArtistsAndDraw);