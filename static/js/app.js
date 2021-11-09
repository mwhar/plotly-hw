// FUNCTION #1 of 5
function buildCharts(selectedPatientID) {
    d3.json("static/js/data/samples.json").then(data => {
        console.log(data)
        // getting all MetaData and Samples
        var metadata = data.metadata
        var samplevalues = data.samples
        // filter for first id
        var filteredmetadata = metadata.filter(patient => patient.id == selectedPatientID)[0]
        var filteredsample = samplevalues.filter(patient => patient.id == selectedPatientID)[0]
        console.log(filteredsample)

        // Plot Bar Graph
        //* Use `sample_values` as the values for the bar chart.
        // * Use `otu_ids` as the labels for the bar chart.
        // * Use `otu_labels` as the hovertext for the chart.
        // convert the otu_id into string
        var trace1 = {
            x: filteredsample.sample_values.slice(0, 10).reverse(),
            y: filteredsample.otu_ids.slice(0, 10).map(otu_id => `OTU #${otu_id}`).reverse(),           
            type: 'bar',
            orientation: 'h'
        };
        var data = [trace1];
        var layout = {
            title: 'Top 10 Bacteria Cultures Found'
        };
        Plotly.newPlot('barDiv', data, layout);

        // Plot Bubble chart
        // * Use `otu_ids` for the x values.
        // * Use `sample_values` for the y values.        
        // * Use `sample_values` for the marker size.        
        // * Use `otu_ids` for the marker colors.        
        // * Use `otu_labels` for the text values.
        var trace1 = {
            x: filteredsample.otu_ids,
            y: filteredsample.sample_values,
            mode: 'markers',
            marker: {
                size: filteredsample.sample_values,
                color: filteredsample.otu_ids,
                colorscale: "Earth"                
            },
            text: filteredsample.otu_labels            
        };
        var data = [trace1];
        var layout = {
            title: 'OTU IDS',
            showlegend: false,
            height: 600,
            width: 1000
        };
        Plotly.newPlot('bubbleDiv', data, layout);

        // BONUS - Plot Gauge chart      
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: filteredmetadata.wfreq,
                title: { text: "Weekly Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400, increasing: { color: "LightSkyBlue" } },
                gauge: { axis: { range: [null, 10] } }
            }
        ];
        var layout = { width: 600, height: 400 };
        Plotly.newPlot('gaugeDiv', data, layout, {responsive:true});
    })
};

// FUNCTION #2 of 5 - Populate demographic information
function populateDemographicInfo(selectedPatientID) {
    d3.json("samples.json").then(data => {
        var metadata = data.metadata;
        var filteredmetadata = metadata.filter(patient => patient.id == selectedPatientID)[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(filteredmetadata).forEach(([key, value]) => {
            panel.append("h5").text(`${key}: ${value}`);
        });
    })
}

// FUNCTION #3 of 5
function optionChanged(selectedPatientID) {
    console.log(selectedPatientID);
    buildCharts(selectedPatientID);
    populateDemographicInfo(selectedPatientID);
}

// FUNCTION #4 of 5 - Dropdown element
function populateDropdown() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value", patientID)
        })
    })
}

// FUNCTION #5 of 5
function buildWebsiteOnStartup() {
    populateDropdown();
    d3.json("samples.json").then(data => {
        buildCharts(data.names[0]);
        populateDemographicInfo(data.names[0]);
    })
};

buildWebsiteOnStartup();