function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let strUrl = "/metadata/" + sample;
  console.log(`metadata sample: ${sample}`);
  let jsonData = d3.json(strUrl).then(function(data){
		console.log(data);
  
    // Use d3 to select the panel with id of `#sample-metadata`
		let pbod = d3.select("#sample-metadata");
	
    // Use `.html("") to clear any existing metadata
		pbod.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
		Object.entries(data).forEach(([key, val])=>{
			pbod.append("p").text(key + ": " + val);
		});

    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
    return(data);
  });
}

function buildGauge(sample) {
	var data = [{domain: {x: [0, 1], y: [0, 1]}, value: sample, title: {text: "Belly Button Scrubs per Week"},
    type: "indicator", mode: "gauge+number", gauge:
    {axis: {range: [0, 9]}, steps: [{range: [0, 1], color: "rgb(0, 256, 0)"},
		{range: [1, 2], color: "rgb(0, 244, 0)"}, {range: [2, 3], color: "rgb(0, 232, 0)"},
		{range: [3, 4], color: "rgb(0, 220, 0)"}, {range: [4, 5], color: "rgb(0, 208, 0)"},
		{range: [5, 6], color: "rgb(0, 196, 0)"}, {range: [6, 7], color: "rgb(0, 184, 0)"},
		{range: [7, 8], color: "rgb(0, 172, 0)"}, {range: [8, 9], color: "rgb(0, 160, 0)"}], 
		thickness: 0.75, value: 0}}];

	Plotly.newPlot("gauge", data);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let strUrl = "/samples/" + sample;
  console.log(`charts sample: ${sample}`);
  let jsonData = d3.json(strUrl).then(function(data){
		console.log(data.otu_ids.slice(0, 10));
		console.log(data.sample_values.slice(0, 10));
		console.log(data.otu_labels.slice(0, 10));
		
		// @TODO: Build a Bubble Chart using the sample data
		// didn't understand the color mapping scheme, so I made up my own
		let intMax = d3.max(data.otu_ids);
		let arrColor = data.otu_ids.map(itm=>`rgb(${(intMax*0.5-itm)/intMax*256}, ${itm/intMax*256}, ${256-256*itm/intMax})`);
		let arrBubTrace = [{
			x: data.otu_ids,
			y: data.sample_values,
			hoverinfo: "x+y+text",
			marker: {
				color: arrColor,
				size: data.sample_values
			},
			mode: "markers",
			text: data.otu_labels,
			type: "scatter"
		}];
		let objBubLayout = {
			title: "All Belly Buttons"
		};
		Plotly.newPlot("bubble", arrBubTrace, objBubLayout);

		// @TODO: Build a Pie Chart
		// HINT: You will need to use slice() to grab the top 10 sample_values,
		// otu_ids, and labels (10 each).
		let arrPieTrace = [{
			labels: data.otu_ids.slice(0, 10),
			values: data.sample_values.slice(0, 10),
			text: data.otu_labels.slice(0, 10),
			hoverinfo: "text+percent+value",
			textinfo: "percent",
			type: "pie"
		}];
		let objPieLayout = {
			title: "Top Ten Grooviest Belly Buttons"
		};
		Plotly.newPlot("pie", arrPieTrace, objPieLayout);
	});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();