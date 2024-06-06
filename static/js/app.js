const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to build the metadata panel
function buildMetadata(sample) {
    d3.json(url).then((data) => {
        const metadata = data.metadata;
        const resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        const result = resultArray[0];
        const PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to build the charts
function buildCharts(sample) {
    d3.json(url).then((data) => {
        const samples = data.samples;
        const resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        const result = resultArray[0];
        const otu_ids = result.otu_ids;
        const otu_labels = result.otu_labels;
        const sample_values = result.sample_values;

        // Build a Bar Chart
        const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        const barData = [{
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];
        const barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };
        Plotly.newPlot('bar', barData, barLayout);

        // Build a Bubble Chart
        const bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        }];
        const bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 30, l: 150 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" }
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

// Initialize the dropdown menu
function init() {
    const selector = d3.select("#selDataset");

    d3.json(url).then((data) => {
        const sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Update the charts and metadata when a new sample is selected
function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
