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
const opac = 1;

const x1 = "exhibitions_solo_rank";
const x2 = "exhibitions_total_rank";
const x3 = "prestige_rank";
const x4 = "prestige_avg_rank";
const x5 = "prestige_Top10%_rank";

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

function selectArtistsThenDraw(data) {

    let first = data.filter(d => d.row_number == 0);
    let second = data.filter(d => d.row_number == 1);
    let third = data.filter(d => d.row_number == 2);
    let fourth = data.filter(d => d.row_number == 3);

    let numOfArtists = data.length;
    let numOfArtistsArr = [...Array(numOfArtists).keys()]

    let timeCount = 0;
    const conditions = [+1, -1, +2, -2, +3, -3, +4, -4, +5, -5];

    let fArray = [],
        sArray = [],
        thArray = [],
        foArray = [];
    let indexFirst, f, indexSecond, s, indexThird, th, indexFourth, fo;

    function getUniqueArtists(number) {

        const rem = [];

        if (number > 1) {
            for (let i = 0, len = (number / 4); i < len; i++) {
                indexFirst = Math.floor(Math.random() * first.length)
                f = +first[indexFirst].values[0].number
                // while (fArray.includes(f)) {
                //     indexFirst = Math.floor(Math.random() * first.length)
                //     f = +first[indexFirst].values[0].number
                // }
                fArray.push(f);
                if (i > 0) {
                    while (conditions.some(el => fArray.includes(f + el))) {
                        fArray.pop()
                        indexFirst = Math.floor(Math.random() * first.length)
                        f = +first[indexFirst].values[0].number
                        fArray.push(f);
                    }
                }
                rem.push(first[indexFirst])
                const nameOne = first[indexFirst].key;
                first = first.filter(d => {
                    return d.key !== nameOne;
                })

                indexSecond = Math.floor(Math.random() * second.length)
                s = +second[indexSecond].values[1].number

                // while (sArray.includes(s)) {
                //     indexSecond = Math.floor(Math.random() * second.length)
                //     s = +second[indexSecond].values[1].number
                // }
                sArray.push(s);
                if (i > 0) {
                    while (conditions.some(el => sArray.includes(s + el))) {
                        sArray.pop()
                        indexSecond = Math.floor(Math.random() * second.length)
                        s = +second[indexSecond].values[1].number
                        sArray.push(s);
                    }
                }
                rem.push(second[indexSecond])
                const nameTwo = second[indexSecond].key;
                second = second.filter(d => {
                    return d.key !== nameTwo;
                })

                indexThird = Math.floor(Math.random() * third.length)
                th = +third[indexThird].values[2].number
                // while (thArray.includes(th)) {
                //     indexThird = Math.floor(Math.random() * third.length)
                //     th = +third[indexThird].values[2].number
                // }
                thArray.push(th);
                if (i > 0) {
                    while (conditions.some(el => thArray.includes(th + el))) {
                        thArray.pop()
                        indexThird = Math.floor(Math.random() * third.length)
                        th = +third[indexThird].values[2].number
                        thArray.push(th);
                    }
                }
                rem.push(third[indexThird])
                const nameThree = third[indexThird].key;
                third = third.filter(d => {
                    return d.key !== nameThree;
                })

                indexFourth = Math.floor(Math.random() * fourth.length)
                fo = +fourth[indexFourth].values[4].number
                // while (foArray.includes(fo)) {
                //     indexFourth = Math.floor(Math.random() * fourth.length)
                //     fo = +fourth[indexFourth].values[4].number
                // }
                foArray.push(fo);
                if (i > 0) {
                    while (conditions.some(el => foArray.includes(fo + el))) {
                        foArray.pop()
                        indexFourth = Math.floor(Math.random() * fourth.length)
                        fo = +fourth[indexFourth].values[4].number
                        foArray.push(fo);
                    }
                }
                rem.push(fourth[indexFourth])
                const nameFour = fourth[indexFourth].key;
                fourth = fourth.filter(d => {
                    return d.key !== nameFour;
                })

            }
        } else {
            const lineToShow = timeCount % 4;

            if (lineToShow == 1) {
                indexFirst = Math.floor(Math.random() * first.length);
                f = +first[indexFirst].values[0].number
                // while (fArray.includes(f)) {
                //     indexFirst = Math.floor(Math.random() * first.length);
                //     f = +first[indexFirst].values[0].number
                // }
                fArray.shift();
                fArray.push(f);
                while (conditions.some(el => fArray.includes(f + el))) {
                    fArray.pop()
                    indexFirst = Math.floor(Math.random() * first.length)
                    f = +first[indexFirst].values[0].number
                    fArray.push(f);
                }
                rem.push(first[indexFirst])
                const name = first[indexFirst].key;
                first = first.filter(d => {
                    return d.key !== name;
                })
                

            } else if (lineToShow == 2) {
                indexSecond = Math.floor(Math.random() * second.length)
                s = +second[indexSecond].values[1].number
                // while (sArray.includes(s)) {
                //     indexSecond = Math.floor(Math.random() * second.length)
                //     s = +second[indexSecond].values[1].number
                // }
                sArray.shift();
                sArray.push(s);
                while (conditions.some(el => sArray.includes(s + el))) {
                    sArray.pop()
                    indexSecond = Math.floor(Math.random() * second.length)
                    s = +second[indexSecond].values[1].number
                    sArray.push(s);
                }
                rem.push(second[indexSecond])
                const name = second[indexSecond].key;
                second = second.filter(d => {
                    return d.key !== name;
                })

            } else if (lineToShow == 3) {
                indexThird = Math.floor(Math.random() * third.length)
                th = +third[indexThird].values[2].number
                // while (thArray.includes(th)) {
                //     indexThird = Math.floor(Math.random() * third.length)
                //     th = +third[indexThird].values[2].number
                // }

                thArray.shift()
                thArray.push(th);
                while (conditions.some(el => thArray.includes(th + el))) {
                    thArray.pop()
                    indexThird = Math.floor(Math.random() * third.length)
                    th = +third[indexThird].values[2].number
                    thArray.push(th);
                }
                rem.push(third[indexThird])
                const name = third[indexThird].key;
                third = third.filter(d => {
                    return d.key !== name;
                })
            } else {
                indexFourth = Math.floor(Math.random() * fourth.length)
                fo = +fourth[indexFourth].values[4].number
                // while (foArray.includes(fo)) {
                //     indexFourth = Math.floor(Math.random() * fourth.length)
                //     fo = +fourth[indexFourth].values[4].number
                // }
                foArray.shift()
                foArray.push(fo);
                while (conditions.some(el => foArray.includes(fo + el))) {
                    foArray.pop()
                    indexFourth = Math.floor(Math.random() * fourth.length)
                    fo = +fourth[indexFourth].values[4].number
                    foArray.push(fo);
                    

                }
                rem.push(fourth[indexFourth])
                const name = fourth[indexFourth].key;
                fourth = fourth.filter(d => {
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
            console.log("done!")
        }

        timeCount += 1;

        const newFlatData = selectedArtists.reduce(
            (arr, elem) => {
                for (const c of elem.values) {
                    c.row_number = elem.row_number
                    arr.push(c);
                }
                return arr;
            }, []
        );

        function drawChart(dataInput) {
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
                return d.type == list[3] ||
                    d.type == list[4]
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
                            row_number: obj[0].row_number
                        },
                        target: {
                            name: obj[1].Artist,
                            number: obj[1].number,
                            type: obj[1].type,
                            row_number: obj[1].row_number
                        }
                    });
                }
                return newData;
            }

            function returnSourceTarget2(data) {
                const newData = [];
                const nested = d3.nest()
                    .key(d => d.Artist)
                    .entries(data)

                for (let i = 0; i < nested.length; i++) {
                    const obj = nested[i].values;
                    newData.push({
                        source: {
                            name: obj[1].Artist,
                            number: obj[1].number,
                            type: obj[1].type,
                            row_number: obj[1].row_number
                        },
                        target: {
                            name: obj[0].Artist,
                            number: obj[0].number,
                            type: obj[0].type,
                            row_number: obj[0].row_number
                        }
                    });
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
        }

        drawChart(newFlatData);

        let curveTexts = curveTextsGroup.selectAll("text")
            .data(newFlatData.filter((d, i) => i % 5 == 0), (q) => q.Artist)

        curveTextsEnter = curveTexts.enter()
            .append("text")
            .attr("class", "curve-texts")

        curveTextsEnter.append("textPath")
                .attr("xlink:href", (d, i) => {
                    const lineNum = +d.row_number + 1;
                    return `#${formatName(d.Artist)}-for-curves-${lineNum}`
                })
                .attr("startOffset", "2%")
                .style("text-anchor", "start")
                .text((d, i) => {
                    return d.Artist
                })
                .attr("font-size", 8)
                // .attr("opacity", 0)
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
                            c.row_number = elem.row_number
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
                first = data.filter(d => d.row_number == 0);
                second = data.filter(d => d.row_number == 1);
                third = data.filter(d => d.row_number == 2);
                fourth = data.filter(d => d.row_number == 3);
                selectArtists(t, numOfSelectedArtists);
                timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);

            })

    }

    let timeButtonText,
        artistsButtonText,
        t = 500,
        intervalTime = 50,
        numOfSelectedArtists = 60;

    selectArtists(t, numOfSelectedArtists);
    var timing = setInterval(selectArtists, intervalTime, t, numOfSelectedArtists);

    const timeButtons = d3.selectAll(".time");
    const numOfArtistsButtons = d3.selectAll(".num-of-artists");

    timeButtons.on("click", (q, i) => {
        clearInterval(timing);
        numOfArtists = data.length;
        numOfArtistsArr = [...Array(numOfArtists).keys()]
        first = data.filter(d => d.row_number == 0);
        second = data.filter(d => d.row_number == 1);
        third = data.filter(d => d.row_number == 2);
        fourth = data.filter(d => d.row_number == 3);
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
        first = data.filter(d => d.row_number == 0);
        second = data.filter(d => d.row_number == 1);
        third = data.filter(d => d.row_number == 2);
        fourth = data.filter(d => d.row_number == 3);
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
        .domain(list)
        .range([0, boundedwidth]);

    const yScale = d3.scaleLinear()
        .domain([1, d3.max(dataset, d => +d.number)])
        .range([margin.top, boundedheight - margin.bottom]);

    const xScaleOne = d3.scalePoint()
        .domain([list[0], list[1]])
        .range([textwidth / 2, ((boundedwidth / 2 - textwidth) / 2)])

    const xScaleTwo = d3.scalePoint()
        .domain([list[1], list[2]])
        .range([((boundedwidth / 2 - textwidth) / 2 + textwidth), (boundedwidth / 2 - textwidth / 2)])

    const xScaleThree = d3.scalePoint()
        .domain([list[2], list[3]])
        .range([(boundedwidth / 2 + textwidth / 2), ((boundedwidth / 2 - textwidth) / 2 + boundedwidth / 2)])

    const xScaleFour = d3.scalePoint()
        .domain([list[3], list[4]])
        .range([((boundedwidth / 2 - textwidth) / 2 + boundedwidth / 2 + textwidth), (boundedwidth - textwidth / 2)])

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
            if (d.type == list[2]) {
                return "center-axis-text";
            }
        })
        .attr("id", d => {
            if (d.type == list[2]) {
                return `${formatName(d.Artist)}-text`
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

    const groupedData = d3.nest()
        .key(d => d.Artist)
        .entries(dataset);
    
    groupedData.forEach((row, index) => {
        for (let i = 0; i < 5; i++) {
            if (index % 5 == i) {
                row.row_number = i;
            }
        }
    })
    return groupedData;
}

d3.csv("../data/d3_structured_artist_rankings_united.csv")
    .then(drawBackBone)
    .then(selectArtistsThenDraw);

// d3.json("../data/grouped-with-curve-number.json")
//     .then(selectArtistsThenDraw);