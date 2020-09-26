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


const svg = d3.select("svg");
svg.attr("width", width)
    .attr("height", height);

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let fontSizeScale;
   


////////////////////////////////////////
// Groups for lines and curved texts //
///////////////////////////////////////
const xScales = [], 
      lineGenerators = [],
      lineGroups = [];

for (let i = 0; i < numOfColumns; i++){
    xScales[i] = d3.scalePoint();
    lineGenerators[i] = d3.linkHorizontal();
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
    // minimal gap between the position of each artist
    const difference = 30; 

    let del, delTimes, labelPositionArray,
        data = dataset,
        numOfArtists = data.length,
        numOfArtistsArr = [...Array(numOfArtists).keys()];

    // timeCount would be zero when selecting the first 60 artists
    let timeCount = 0;    

    // empty a 1 x 10 array every time when refreshing the vis
    const empty = () => {
        labelPositionArray = [[], [], [], [], [],
                              [], [], [], [], []]
    }
    empty();

    function pickAPosition(artist){
        
        let chance, ranking, 
            sel, selArray, selArrIndex,
            choose = true,
            findTimes = 0; // if find time is more than 3, pick another artist

        if (typeof del !== "undefined" && delTimes == 0){
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
                // first 60 artists
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

            const lineData = [],
                lineLinks = [],
                lines = [];

            for (let i = 0; i < numOfColumns; i++){
                lineData[i] = dataInput.filter(d => {
                    return d.type == rankingList[i] ||
                        d.type == rankingList[i+1]
                })
                
                lineLinks[i] = returnSourceTarget(lineData[i]);
        
                lines[i] = lineGroups[i].selectAll(`.line${i}`)
                    .data(lineLinks[i], d => d.source.name);

                lines[i].enter().append("path")
                    .attr('id', d => `${formatName(d.source.name)}-for-curves-${i}`)
                    .attr('d', lineGenerators[i])
                    .attr('class', `line${i}`)
                    .attr("fill", "none")
                    .attr("stroke-width", strokewidth)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("stroke", "#70c1b3")
                    .attr("opacity", opac)

                lines[i].exit()
                    .remove()

            }
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
                        return `#${formatName(d.Artist)}-for-curves-${+d.row_number}`    
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
                .text(d => d.Artist)
                .attr("font-size", 8)

            curveTexts.exit()
                .remove()


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
        .attr("text-anchor", "middle")
        .attr("opacity", opac / 2);


    //////////////////////
    // Line Generators //
    ////////////////////
    for (let i = 0; i < numOfColumns; i++){
        if (i == 0) {
            xScales[i].domain([rankingList[0], rankingList[1]])
            .range([columnPadding / 2, (columnWidth + columnPadding * 2)]);
        } else if (i == 1){
            xScales[i].domain([rankingList[1], rankingList[2]])
            .range([(columnWidth + columnPadding * 3), (columnWidth * 2 + columnPadding * 4)])
        } else if (i == 2){
            xScales[i].domain([rankingList[2], rankingList[3]])
            .range([(columnWidth * 2 + columnPadding * 5.5), (columnWidth * 3 + columnPadding * 6.5)])
        } else if (i == 3){
            xScales[i].domain([rankingList[3], rankingList[4]])
            .range([(columnWidth * 3 + columnPadding * 8), (columnWidth * 4 + columnPadding * 9)])
        } else {
            xScales[i].domain([rankingList[4], rankingList[5]])
        .range([(columnWidth * 4 + columnPadding * 10), (columnWidth * 5 + columnPadding * 11.5)])
        }
        lineGenerators[i]
            .x(d => xScales[i](d.type))
            .y(d => yScale(+d.number))
    }

    const groupedData = d3.nest()
        .key(d => d.Artist)
        .entries(dataset);

    groupedData.map(d => {
        d.row_number = +d.values[0].row_number
        d.scatter_number = +d.values[0].scatter_number
    })

    return groupedData;
}

// Load the data 
d3.csv("./data/d3_structured_artist_rankings_united.csv")
    .then(drawBackBone)
    .then(selectArtistsThenDraw);
