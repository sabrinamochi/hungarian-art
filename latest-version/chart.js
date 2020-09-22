const svg = d3.select("svg");
const width = window.innerWidth * 0.85;
const height = window.innerWidth * 5 * 0.85 / (7.57);
const margin = {
    top: 8,
    right: 10,
    bottom: 0,
    left: 10
}


const boundedwidth = width - margin.left - margin.right;
const boundedheight = height - margin.top - margin.bottom;
const innermargin = 10;
const textwidth = 20;
const strokewidth = 0.6;
const selectedStrokeWidth = 3;
const opac = 0.6;
const numOfColumns = 5;

const x1 = "prestige_avg_rank";
const x2 = "prestige_Top10%_rank";
const x3 = "CRank"
const x4 = "prestige_rank";
const x5 = "exhibitions_total_rank";
const x6 = "exhibitions_solo_rank";

const rankingList = [x1, x2, x3, x4, x5, x6];
svg.attr("width", width)
    .attr("height", height);

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let lineGeneratorOne,
    lineGeneratorTwo,
    lineGeneratorThree,
    lineGeneratorFour,
    lineGeneratorFive,
    fontSizeScale;
   


////////////////////////////////////////
// Groups for lines and curved texts //
///////////////////////////////////////
const lineGroups = [];
for (let i = 0; i < numOfColumns; i++){
    lineGroups[i] = chart.append("g"); 
}

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



function selectArtistsThenDraw(dataset) {
    const difference = 30;
    let del, delTimes, labelPositionArray;

    let data = dataset;
    let numOfArtists = data.length;
    let numOfArtistsArr = [...Array(numOfArtists).keys()]

    let timeCount = 0;    

    const empty = () => {
        labelPositionArray = [[], [], [], [], [],
                              [], [], [], [], []]
    }

    empty();

    function pickAPosition(artist){
        
        let chance;
        let ranking;
        let sel;
        let selArray;
        let selArrIndex;
        let choose = true;
        let findTimes = 0;

        if (typeof del !== "undefined" && delTimes == 0){
            // console.log(del)
            for (let [i, arr] of labelPositionArray.entries()) {
                if(i%2 == 0){
                    if (del.row_number == i/2 && del.scatter_number == 0){
                        labelPositionArray[i].splice(labelPositionArray[i].indexOf(Math.round(del.values[i/2].number)), 1) 
                        break;
                    }
                }  else {
                    if (del.row_number == (i-(i-1)/2)-1 && del.scatter_number == 1) {
                        labelPositionArray[i].splice(labelPositionArray[i].indexOf(Math.round(del.values[(i-(i-1)/2)].number)), 1) 
                        break;
                    }
                }
            }
        }
        

        while (choose == true && findTimes < 3){
            chance = Math.random()
            findTimes += 1;
            for (let [i, arr] of labelPositionArray.entries()) {
                    if (chance > i/labelPositionArray.length &&
                        chance <= (i+1)/labelPositionArray.length){ 
                            
                            selArray = labelPositionArray[i];
                            selArrIndex = i;
                            if (i%2==0){
                                sel = artist.values[i/2] 
                            } else {
                                sel = artist.values[(i-(i-1)/2)]
                            }
                            ranking = +sel.number;

                            if (selArray.length > 0){
                                const different = (n) => Math.abs(ranking - n) < difference;
                                if (selArray.some(different)){
                                    choose = true 
                                } else {
                                    choose = false
                                }
                            } else {
                                choose = false;
                            }
                        break;                
                    }
            }

        } if (choose == true && findTimes >= 3){
            return false;
        } else {
            selArray.push(ranking);
            if (selArrIndex%2==0){
                artist.row_number = selArrIndex/2;
                artist.scatter_number = 0;
            } else {
                artist.row_number = (selArrIndex-(selArrIndex-1)/2)-1;
                artist.scatter_number = 1;
            }
            return artist;
        }
        

    }

    function getUniqueArtists(number) {

        const rem = [];

        for (let i = 0, len = number; i < len; i++) {
            let index = Math.floor(Math.random() * data.length)
            delTimes = 0;
            let positioned = pickAPosition(data[index]);
            while (typeof positioned === "undefined" || positioned === false){
                console.log("reselect!")
                delTimes += 1
                index = Math.floor(Math.random() * data.length)
                positioned = pickAPosition(data[index]);
            } 
            rem.push(positioned)
            const pickedName = data[index].key;
            data = data.filter(d => {
                return d.key !== pickedName;
            })
        }
        // console.log(labelPositionArray)
        return rem;
        
    }

    let selectedArtists;

    function selectArtists(time, artistNum) {
        console.log(numOfArtistsArr.length)
        if (numOfArtistsArr.length > 1) {
            if (timeCount == 0) {
                del = "undefined";
                selectedArtists = getUniqueArtists(artistNum);
                for (let i = 0, len = selectedArtists.length; i < len; i++) {
                    numOfArtistsArr.splice(numOfArtistsArr.indexOf(selectedArtists[i].key), 1);
                }

            } else {
                newArtists = getUniqueArtists(1)[0];
                del = selectedArtists.shift();
                selectedArtists.push(newArtists)
                numOfArtistsArr.splice(numOfArtistsArr.indexOf(newArtists.key), 1);
            }
        } else {
            clearInterval(timing);
            console.log("done!");
            data = dataset;
            numOfArtists = data.length;
            numOfArtistsArr = [...Array(numOfArtists).keys()]
            timeCount = 0; 
            empty()
            selectedDataset = [];
            selectArtists(t, numOfSelectedArtists);
            timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
        }

        timeCount += 1;

        const newFlatData = selectedArtists.reduce(
            (arr, elem) => {
        
                for (const c of elem.values) {
                    c.row_number = elem.row_number;
                    c.scatter_number = elem.scatter_number;
                    arr.push(c);
                }
                return arr;
            }, []
        );


        function drawChart(dataInput) {

            d3.selectAll(".curve-texts").remove();
            d3.selectAll("path").remove();

            const lineOneData = dataInput.filter(d => {
                return d.type == rankingList[0] ||
                    d.type == rankingList[1]
            })

            const lineTwoData = dataInput.filter(d => {
                return d.type == rankingList[1] ||
                    d.type == rankingList[2]
            })

            const lineThreeData = dataInput.filter(d => {
                return d.type == rankingList[2] ||
                    d.type == rankingList[3]
            })

            const lineFourData = dataInput.filter(d => {
                return d.type == rankingList[3] ||
                    d.type == rankingList[4]
            })

            const lineFiveData = dataInput.filter(d => {
                return d.type == rankingList[4] ||
                    d.type == rankingList[5]
            })

            function returnSourceTarget(data) {
                const newData = [];
                const nested = d3.nest()
                    .key(d => d.Artist)
                    .entries(data)

                for (let i = 0; i < nested.length; i++) {
                    const obj = nested[i].values;
                    newData.push({
                        source: {
                            name: obj[0].Artist,
                            number: +obj[0].number,
                            type: obj[0].type,
                            row_number: +obj[0].row_number,
                            scatter_number: +obj[0].scatter_number
                        },
                        target: {
                            name: obj[1].Artist,
                            number: +obj[1].number,
                            type: obj[1].type,
                            row_number: +obj[1].row_number,
                            scatter_number: +obj[1].scatter_number
                        }
                    });
                }
                return newData;
            }


            const lineOneLinks = returnSourceTarget(lineOneData);
            const lineTwoLinks = returnSourceTarget(lineTwoData);
            const lineThreeLinks = returnSourceTarget(lineThreeData);
            const lineFourLinks = returnSourceTarget(lineFourData);
            const lineFiveLinks = returnSourceTarget(lineFiveData);

            const linesOne = lineGroups[0].selectAll(".one")
                .data(lineOneLinks, (d, i) => d.source.name);

            linesOne.enter().append("path")
                .attr('id', d => `${formatName(d.source.name)}-for-curves-1`)
                .attr('d', lineGeneratorOne)
                .attr('class', 'one')
                .attr("fill", "none")
                .attr("stroke-width", strokewidth)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke", "#70c1b3")
                // .transition().duration(time)
                .attr("opacity", opac)


            linesOne.exit()
                // .transition().duration(time / 2)
                // .attr("opacity", 0)
                .remove()

            const linesTwo = lineGroups[1].selectAll(".two")
                .data(lineTwoLinks, (d, i) => d.source.name);

            linesTwo.enter().append("path")
                .attr('id', d => `${formatName(d.source.name)}-for-curves-2`)
                .attr('d', lineGeneratorTwo)
                .attr('class', 'two')
                .attr("fill", "none")
                .attr("stroke-width", strokewidth)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke", "#70c1b3")
                // .transition().duration(time)
                .attr("opacity", opac)


            linesTwo.exit()
                // .transition().duration(time / 2)
                // .attr("opacity", 0)
                .remove()


            const linesThree = lineGroups[2].selectAll(".three")
                .data(lineThreeLinks, (d, i) => d.source.name);

            linesThree.enter().append("path")
                .attr('id', d => `${formatName(d.source.name)}-for-curves-3`)
                .attr('d', lineGeneratorThree)
                .attr('class', 'three')
                .attr("fill", "none")
                .attr("stroke-width", strokewidth)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke", "#70c1b3")
                // .transition().duration(time)
                .attr("opacity", opac)


            linesThree.exit()
                // .transition().duration(time / 2)
                // .attr("opacity", 0)
                .remove()


            const linesFour = lineGroups[3].selectAll(".four")
                .data(lineFourLinks, (d, i) => d.source.name);

            linesFour.enter().append("path")
                .attr('id', d => `${formatName(d.source.name)}-for-curves-4`)
                .attr('d', lineGeneratorFour)
                .attr('class', 'four')
                .attr("fill", "none")
                .attr("stroke-width", strokewidth)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke", "#70c1b3")
                // .transition().duration(time)
                .attr("opacity", opac)


            linesFour.exit()
                // .transition().duration(time / 2)
                // .attr("opacity", 0)
                .remove()

            const linesFive = lineGroups[4].selectAll(".five")
                .data(lineFiveLinks, (d, i) => d.source.name);

            linesFive.enter().append("path")
                .attr('id', d => `${formatName(d.source.name)}-for-curves-5`)
                .attr('d', lineGeneratorFive)
                .attr('class', 'five')
                .attr("fill", "none")
                .attr("stroke-width", strokewidth)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke", "#70c1b3")
                // .transition().duration(time)
                .attr("opacity", opac)


            linesFive.exit()
                // .transition().duration(time / 2)
                // .attr("opacity", 0)
                .remove()
        }

        drawChart(newFlatData);
        
        const filtered = newFlatData.filter((d, i) => i % (rankingList.length) == 0)

        let curveTexts = curveTextsGroup.selectAll("text")
            .data(filtered, (q) => q.Artist)

        curveTextsEnter = curveTexts.enter()
            .append("text")
            .attr("class", "curve-texts")

        curveTextsEnter.append("textPath")
                .attr("xlink:href", (d, i) => {
                        return `#${formatName(d.Artist)}-for-curves-${+d.row_number+1}`    
                    })
                .attr("startOffset", d => {
                    if (+d.scatter_number == 0){
                        return "2%"
                    } else{
                        return "98%"
                    }
                })
                .style("text-anchor", d => {
                    if (+d.scatter_number == 0){
                        return "start"
                    } else{
                        return "end"
                    }
                })
                .text((d, i) => {
                    return d.Artist
                })
                .attr("font-size", 8)
                .attr("opacity", 0)
                // .transition().duration(time)
                .attr("opacity", 1)

            curveTexts.exit()
                // .transition().delay(time / 2).duration(time)
                // .attr("opacity", 0)
                .remove()

        // })

        d3.selectAll("text.axis-text")
            .style("cursor", "pointer")
            .on("mouseover", (d, i) => {
                clearInterval(timing);
                d3.selectAll(".curve-texts")
                    .remove();

                d3.selectAll("text")
                    .attr("opacity", opac / 6);

                const completeFlatData = data.reduce(
                    (arr, elem) => {
                        for (const c of elem.values) {
                            c.row_number = elem.row_number;
                            c.scatter_number = elem.scatter_number;
                            arr.push(c);
                        }
                        return arr;
                    }, []
                );

                //   console.log(completeFlatData)

                drawChart(completeFlatData)

                const sel = d.Artist;
                d3.selectAll("path")
                    .attr("opacity", e => {
                        if (e.source.name == sel) {
                            return opac
                        } else {
                            return 0
                        }
                    })
                    .attr("stroke-width", e => {
                        if (e.source.name == sel) {
                            return strokewidth * 2
                        } else {
                            return 0
                        }
                    })

                d3.select(`#${formatName(d.Artist)}-text`)
                    .attr("font-size", 15)
                    .attr("opacity", opac);

            })
            .on("mouseout", (q, i) => {
                d3.selectAll("path")
                    .remove();

                d3.selectAll("text")
                    .attr("font-size", e => {
                        return fontSizeScale(+e.number)
                    })
                    .attr("opacity", opac / 2);

                    clearInterval(timing)
                    data = dataset;
                    numOfArtists = data.length;
                    numOfArtistsArr = [...Array(numOfArtists).keys()]
                    timeCount = 0; 
                    empty()
                    selectedDataset = [];
                    selectArtists(t, numOfSelectedArtists);
                    timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);

            })

    }
    
    let timeButtonText,
        t = 1000,
        intervalTime = 3000,
        numOfSelectedArtists = 60;

    selectArtists(t, numOfSelectedArtists);
    var timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);

    const timeButtons = d3.selectAll(".time");

    timeButtons.on("click", (q, i) => {
        clearInterval(timing);
        data = dataset;
        numOfArtists = data.length;
        numOfArtistsArr = [...Array(numOfArtists).keys()]
        timeCount = 0; 
        empty()
        selectedDataset = [];
        const selButton = timeButtons.nodes()[i];
        timeButtonText = selButton.innerHTML;
        intervalTime = parseFloat(timeButtonText.replace("s", "")) * 1000;
        selectArtists(t, numOfSelectedArtists);
        timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
    })
}

function drawBackBone(dataset) {

    /////////////
    // SCALES //
    ////////////
    const xScaleText = d3.scalePoint()
        .domain(rankingList)
        .range([0, boundedwidth]);

    const yScale = d3.scaleLinear()
        .domain([1, d3.max(dataset, d => +d.number)])
        .range([margin.top, boundedheight - margin.bottom]);

    const columnPadding = textwidth / 2;
    const columnWidth = (boundedwidth - columnPadding * (rankingList.length)  * 2) / (numOfColumns);

    const xScaleOne = d3.scalePoint()
        .domain([rankingList[0], rankingList[1]])
        .range([columnPadding / 2, (columnWidth + columnPadding * 2)])

    const xScaleTwo = d3.scalePoint()
        .domain([rankingList[1], rankingList[2]])
        .range([(columnWidth + columnPadding * 3), (columnWidth * 2 + columnPadding * 4)])

    const xScaleThree = d3.scalePoint()
        .domain([rankingList[2], rankingList[3]])
        .range([(columnWidth * 2 + columnPadding * 5.5), (columnWidth * 3 + columnPadding * 6.5)])

    const xScaleFour = d3.scalePoint()
        .domain([rankingList[3], rankingList[4]])
        .range([(columnWidth * 3 + columnPadding * 8), (columnWidth * 4 + columnPadding * 9)])

    const xScaleFive = d3.scalePoint()
        .domain([rankingList[4], rankingList[5]])
        .range([(columnWidth * 4 + columnPadding * 10), (columnWidth * 5 + columnPadding * 11.5)])

    
    fontSizeScale = d3.scaleLinear()
        .domain(d3.extent(dataset, d => +d.number))
        .range([2, 0.5])

    /////////////////////
    // DRAW TEXT AXES //
    ////////////////////
    const texts = chart.append("g");
    texts.selectAll("text")
        .data(dataset, d => d.Artist)
        .enter().append("text")
        .attr("class", "axis-text")
        .attr("id", d => {
            switch(d.type){
                case rankingList[2]:
                case rankingList[3]:
                    return `${formatName(d.Artist)}-text`
                    break;
            }
        })
        .attr("x", d => xScaleText(d.type))
        .attr("y", d => yScale(+d.number))
        .text(d => d.Artist)
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

    lineGeneratorFive = d3.linkHorizontal()
        .x(d => xScaleFive(d.type))
        .y(d => yScale(+d.number))

    const groupedData = d3.nest()
        .key(d => d.Artist)
        .entries(dataset);

    groupedData.map(d => {
        d.row_number = +d.values[0].row_number
        d.scatter_number = +d.values[0].scatter_number
    })

    return groupedData;
}

d3.csv("../data/d3_structured_artist_rankings_united.csv")
    .then(drawBackBone)
    .then(selectArtistsThenDraw);
