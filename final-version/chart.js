const svg = d3.select("svg");
const width = window.innerWidth * 0.9;
const height = window.innerWidth * 5 * 0.9 / (7.57);
const margin = {
    top: 10,
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

const x1 = "CRank"
const x2 = "prestige_rank";
const x3 = "prestige_avg_rank";
const x4 = "prestige_Top10%_rank";
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
const linesOneGroup = chart.append("g");
const linesTwoGroup = chart.append("g");
const linesThreeGroup = chart.append("g");
const linesFourGroup = chart.append("g");
const linesFiveGroup = chart.append("g");

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

function selectArtistsThenDraw(data) {
    let first = data.filter(d => d.row_number == 1);
    let second = data.filter(d => d.row_number == 2);
    let third = data.filter(d => d.row_number == 3);
    let fourth = data.filter(d => d.row_number == 4);
    let five = data.filter(d => d.row_number == 5);

    let numOfArtists = data.length;
    let numOfArtistsArr = [...Array(numOfArtists).keys()]

    let timeCount = 0; 
    let indexFirst, indexSecond, indexThird, indexFourth, indexFive;

    function getUniqueArtists(number) {

        const rem = [];

        if (number > 1) {
            for (let i = 0, len = (number / numOfColumns); i < len; i++) {
                indexFirst = Math.floor(Math.random() * first.length)
                rem.push(first[indexFirst])
                const nameOne = first[indexFirst].key;
                first = first.filter(d => {
                    return d.key !== nameOne;
                })

                indexSecond = Math.floor(Math.random() * second.length)
                rem.push(second[indexSecond])
                const nameTwo = second[indexSecond].key;
                second = second.filter(d => {
                    return d.key !== nameTwo;
                })

                indexThird = Math.floor(Math.random() * third.length)
                rem.push(third[indexThird])
                const nameThree = third[indexThird].key;
                third = third.filter(d => {
                    return d.key !== nameThree;
                })

                indexFourth = Math.floor(Math.random() * fourth.length)
                rem.push(fourth[indexFourth])
                const nameFour = fourth[indexFourth].key;
                fourth = fourth.filter(d => {
                    return d.key !== nameFour;
                })

                indexFive = Math.floor(Math.random() * five.length)
                rem.push(five[indexFive])
                const nameFive = five[indexFive].key;
                five = five.filter(d => {
                    return d.key !== nameFive;
                })

            }
        } else {
            const lineToShow = timeCount % numOfColumns;

            if (lineToShow == 1) {
                indexFirst = Math.floor(Math.random() * first.length);
                rem.push(first[indexFirst])
                const name = first[indexFirst].key;
                first = first.filter(d => {
                    return d.key !== name;
                })
                

            } else if (lineToShow == 2) {
                indexSecond = Math.floor(Math.random() * second.length)
                rem.push(second[indexSecond])
                const name = second[indexSecond].key;
                second = second.filter(d => {
                    return d.key !== name;
                })

            } else if (lineToShow == 3) {
                indexThird = Math.floor(Math.random() * third.length)
                rem.push(third[indexThird])
                const name = third[indexThird].key;
                third = third.filter(d => {
                    return d.key !== name;
                })
            } else if (lineToShow == 4){
                indexFourth = Math.floor(Math.random() * fourth.length)
                rem.push(fourth[indexFourth])
                const name = fourth[indexFourth].key;
                fourth = fourth.filter(d => {
                    return d.key !== name;
                })


            } else {
                indexFive = Math.floor(Math.random() * five.length)
                rem.push(five[indexFive])
                const name = five[indexFive].key;
                five = five.filter(d => {
                    return d.key !== name;
                })
            }
        }

        return rem;
    }

    let selectedArtists;

    function selectArtists(time, artistNum) {
        console.log(numOfArtistsArr.length)
        if (numOfArtistsArr.length > 1) {
            if (timeCount == 0) {
                selectedArtists = getUniqueArtists(artistNum);
                for (let i = 0, len = selectedArtists.length; i < len; i++) {
                    numOfArtistsArr.splice(numOfArtistsArr.indexOf(selectedArtists[i].key), 1);
                }

            } else {
                newArtists = getUniqueArtists(1)[0];
                selectedArtists.shift();
                selectedArtists.push(newArtists)
                numOfArtistsArr.splice(numOfArtistsArr.indexOf(newArtists.key), 1);
            }
        } else {
            clearInterval(timing);
            console.log("done!");
            numOfArtists = data.length;
            numOfArtistsArr = [...Array(numOfArtists).keys()]
            first = data.filter(d => d.row_number == 1);
            second = data.filter(d => d.row_number == 2);
            third = data.filter(d => d.row_number == 3);
            fourth = data.filter(d => d.row_number == 4);
            five = data.filter(d => d.row_number == 5);
            selectedDataset = [];
            timeCount = 0;
            selectArtists(t, numOfSelectedArtists);
            timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
        }

        timeCount += 1;

        const newFlatData = selectedArtists.reduce(
            (arr, elem) => {
                for (const c of elem.values) {
                    const startOffsetValue = Math.random() < 0.5 ? "2%" : "98%";
                    const anchorValue = startOffsetValue == "2%" ? "start" : "end";
                    c.row_number = elem.row_number
                    c.start_offset = startOffsetValue;
                    c.anchor = anchorValue;
                    arr.push(c);
                }
                return arr;
            }, []
        );

        function drawChart(dataInput) {
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
                            number: obj[0].number,
                            type: obj[0].type,
                        },
                        target: {
                            name: obj[1].Artist,
                            number: obj[1].number,
                            type: obj[1].type,
                        }
                    });
                }
                return newData;
            }

            // function returnSourceTarget2(data) {
            //     const newData = [];
            //     const nested = d3.nest()
            //         .key(d => d.Artist)
            //         .entries(data)

            //     for (let i = 0; i < nested.length; i++) {
            //         const obj = nested[i].values;
            //         newData.push({
            //             source: {
            //                 name: obj[1].Artist,
            //                 number: obj[1].number,
            //                 type: obj[1].type
            //             },
            //             target: {
            //                 name: obj[0].Artist,
            //                 number: obj[0].number,
            //                 type: obj[0].type
            //             }
            //         });
            //     }

            //     return newData;
            // }

            const lineOneLinks = returnSourceTarget(lineOneData);
            const lineTwoLinks = returnSourceTarget(lineTwoData);
            const lineThreeLinks = returnSourceTarget(lineThreeData);
            const lineFourLinks = returnSourceTarget(lineFourData);
            const lineFiveLinks = returnSourceTarget(lineFiveData);

            const linesOne = linesOneGroup.selectAll(".one")
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

            const linesTwo = linesTwoGroup.selectAll(".two")
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


            const linesThree = linesThreeGroup.selectAll(".three")
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


            const linesFour = linesFourGroup.selectAll(".four")
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

            const linesFive = linesFiveGroup.selectAll(".five")
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
                        return `#${formatName(d.Artist)}-for-curves-${d.row_number}`    
                    })
                .attr("startOffset", d => d.start_offset)
                .style("text-anchor", d => d.anchor)
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

        d3.selectAll("text.center-axis-text")
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
                            // c.row_number = elem.row_number
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

                selectedDataset = [];
                timeCount = 0;
                numOfArtists = data.length;
                numOfArtistsArr = [...Array(numOfArtists).keys()]
                first = data.filter(d => d.row_number == 1);
                second = data.filter(d => d.row_number == 2);
                third = data.filter(d => d.row_number == 3);
                fourth = data.filter(d => d.row_number == 4);
                five = data.filter(d => d.row_number == 5);
                selectArtists(t, numOfSelectedArtists);
                timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);

            })

    }

    let timeButtonText,
        artistsButtonText,
        t = 1000,
        intervalTime = 5000,
        numOfSelectedArtists = 60;

    selectArtists(t, numOfSelectedArtists);
    var timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);

    const timeButtons = d3.selectAll(".time");
    const numOfArtistsButtons = d3.selectAll(".num-of-artists");

    timeButtons.on("click", (q, i) => {
        clearInterval(timing);
        numOfArtists = data.length;
        numOfArtistsArr = [...Array(numOfArtists).keys()]
        first = data.filter(d => d.row_number == 1);
        second = data.filter(d => d.row_number == 2);
        third = data.filter(d => d.row_number == 3);
        fourth = data.filter(d => d.row_number == 4);
        five = data.filter(d => d.row_number == 5);
        selectedDataset = [];
        timeCount = 0;
        const selButton = timeButtons.nodes()[i];
        timeButtonText = selButton.innerHTML;
        intervalTime = parseFloat(timeButtonText.replace("s", "")) * 1000;
        selectArtists(t, numOfSelectedArtists);
        timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);
    })
    numOfArtistsButtons.on("click", (q, i) => {
        clearInterval(timing);
        numOfArtists = data.length;
        numOfArtistsArr = [...Array(numOfArtists).keys()]
        first = data.filter(d => d.row_number == 1);
        second = data.filter(d => d.row_number == 2);
        third = data.filter(d => d.row_number == 3);
        fourth = data.filter(d => d.row_number == 4);
        five = data.filter(d => d.row_number == 5);
        selectedDataset = [];
        timeCount = 0;
        const selButton = numOfArtistsButtons.nodes()[i];
        artistsButtonText = selButton.innerHTML;
        numOfSelectedArtists = parseInt(artistsButtonText);
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
        .attr("class", d => {
            switch(d.type){
                case rankingList[2]:
                case rankingList[3]:
                    return "center-axis-text";
                    break;
            }
        })
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
    
    groupedData.forEach((row, index) => {
        for (let i = 0; i < numOfColumns; i++) {
            if (index % numOfColumns == i) {
                row.row_number = i + 1;
            }
        }
    })
    return groupedData;
}

d3.csv("../data/d3_structured_artist_rankings_united.csv")
    .then(drawBackBone)
    .then(selectArtistsThenDraw);
