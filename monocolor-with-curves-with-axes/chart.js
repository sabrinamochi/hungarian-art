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

    const linesOneGroup = chart.append("g");
    const linesTwoGroup = chart.append("g");
    const linesThreeGroup = chart.append("g");
    const linesFourGroup = chart.append("g");

    const formatName = (data) => {
        return data.replace(" ", "-")
            .replace(".", "-")
            .replace("(", "-")
            .replace(")", "-")
            .replace("&", "-")
            .replace(" ", "-")
            .replace(",", "-");
    }
    
    const fontSizeScale = d3.scaleLinear()
        .domain(d3.extent(dataset, d => +d.number))
        .range([2, 0.5])

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
            .attr("opacity", opac);
         //    .attr("baseline-shift", "-50%")
         //    .attr("fill", d => color(d.artist)); 

     
     const curveTextsGroup = chart.append("g");                

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
            const newData =[];
            
            for (let i = 0; i < numOfSelectedArtists; i++){
                newData.splice(i, 0, arr[indices[i]])
                
            }
           return newData
          }
    
     let selectedDataset= [];
     let firstTime = 0;
     
     function selectArtists(time, artistNum){
            if(numOfArtistsArr.length < 1){
                clearInterval(timing);
                console.log("done!")
            }

            const selectedArtists = getUniqueArtists(artistNum);

            if (firstTime == 0){
                const selectedArtists = getUniqueArtists(artistNum);
    
                for (let i = 0; i < selectedArtists.length; i++){
                    numOfArtistsArr.splice(numOfArtistsArr.indexOf(selectedArtists[i]), 1);
                    selectedDataset.push(selectedArtists[i])
                }
                
            } else {
                const selectedArtists = getUniqueArtists(1);
                selectedDataset.shift()
                for (let i = 0; i < selectedArtists.length; i++){
                    numOfArtistsArr.splice(numOfArtistsArr.indexOf(selectedArtists[i]), 1);
                    selectedDataset.push(selectedArtists[i])
                 }
            }
    
            firstTime += 1;
      

        const data = getNewData(groupedData, selectedDataset); 
        // console.log(selectedDataset)
        let newDataset = [];
        data.map(d => {
            d.values.map(e => {
                newDataset.push(e)
            })
        });
        // console.log(newDataset)
        const lineOneData = newDataset.filter(d => {
            return d.type == list[0] || 
                    d.type == list[1]
        })
    
        const lineTwoData = newDataset.filter(d => {
            return d.type == list[1] || 
                    d.type == list[2]
        })
    
        const lineThreeData = newDataset.filter(d => {
            return d.type == list[2] || 
                    d.type == list[3]
        })
    
        const lineFourData = newDataset.filter(d => {
            return d.type == list[3]|| 
                    d.type == list[4]
        })
        
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
        .transition().delay(time / 2).duration(time / 2)
        .attr("opacity", 0)
        .remove()

        const linesTwo = linesOneGroup.selectAll(".two")
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
        .transition().delay(time / 2).duration(time / 2)
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
        .transition().delay(time / 2).duration(time / 2)
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
            .transition().delay(time / 2).duration(time / 2)
            .attr("opacity", 0)
            .remove()

          
         let curveTexts = curveTextsGroup.selectAll("text")
            .data(newDataset, (d, i) => {
                return i + d.artist
                // console.log(i + d.artist)
            })

         curveTextsEnter = curveTexts.enter()
            .append("text")
             .attr("class", "curve-texts")
             .attr("id", d => `${formatName(d.artist)}-curve-text`)
          
        let curvedTextsOrderList = [];

        if (artistNum >= 4) {
            for (let n = 0; n < newDataset.length / 20; n++){
                curvedTextsOrderList.push(n * 20);
            }
        } else {
                curvedTextsOrderList.push(0)
        }

         curvedTextsOrderList.forEach(el => {
             
            curveTextsEnter.append("textPath")
                            .attr("xlink:href", (d, i) => {
                                const index = i % 4 + 1   

                                if (((el) <= i) && (i < (el + 5))){
                                        if (index == 1) {
                                            return `#${formatName(d.artist)}-for-curves-${1}`
                                           } else {
                                               return;
                                           }
                                } else if (((el + 5) <= i) && (i < (el + 10))){
                                        if (index == 2) {
                                            return `#${formatName(d.artist)}-for-curves-${2}`
                                           } else {
                                               return;
                                           }
                                } else if (((el + 10) <= i) && (i < (el + 15))){
                                        if (index == 3) {
                                            return `#${formatName(d.artist)}-for-curves-${3}`
                                           } else {
                                               return;
                                           }
                                } else if (((el + 15) <= i) && (i < (el + 20))){
                                        if (index == 4){
                                            return `#${formatName(d.artist)}-for-curves-${4}`
                                            } else {
                                                return;
                                            }
                                }
  
                            })
                            .text(d => d.artist)
                            .transition().duration(time)
                            .attr("opacity", 1)

                // curveTexts = curveTextsEnter.merge(curveTexts)
            
                curveTexts.exit()
                .transition().delay(time / 2).duration(time) 
                .attr("opacity", 0)
                .remove()

         })
    }

        let timeButtonText,
            artistsButtonText,
            t = 2000,
            intervalTime = t * 3,
            numOfSelectedArtists = 4;
            
        selectArtists(t, numOfSelectedArtists);
        var timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
        
        const timeButtons = d3.selectAll(".time");
        const numOfArtistsButtons = d3.selectAll(".num-of-artists");
        
        timeButtons.on("click", (d,i) => {
            clearInterval(timing);
            selectedDataset= [];
            firstTime = 0;
            const selButton = timeButtons.nodes()[i];
            timeButtonText = selButton.innerHTML;
            t = parseFloat(timeButtonText.replace("s", "")) * 1000;
            intervalTime = t * 3;
            selectArtists(t, numOfSelectedArtists);
            timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
        })
        numOfArtistsButtons.on("click", (d,i) => {
            clearInterval(timing);
            selectedDataset= [];
            firstTime = 0;
            const selButton = numOfArtistsButtons.nodes()[i];
            artistsButtonText = selButton.innerHTML;
            numOfSelectedArtists = parseInt(artistsButtonText);
            selectArtists(t, numOfSelectedArtists);
            timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
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
    drawChart(data);
}

d3.csv("../data/d3_structured_artist_rankings_united.csv")
    .then(loadData);

     
  