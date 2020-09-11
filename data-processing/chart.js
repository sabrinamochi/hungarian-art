function processData(dataset){
    const groupedData = d3.nest()
            .key(d => d.artist)
            .entries(dataset);

        groupedData.forEach((row, index) => {
            switch(index % 4) {
                case 0:
                    row.row_number = 0;
                    break
                case 1:
                    row.row_number = 1;
                    break
                case 2: 
                    row.row_number = 2;
                    break
                default:
                    row.row_number = 3;
                    break
            }
        })

        return groupedData;
}

d3.csv("../data/d3_structured_artist_rankings_united.csv")
    .then(processData)
