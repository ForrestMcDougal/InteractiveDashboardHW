function buildMetadata(sample) {
	d3.json(`/metadata/${sample}`).then((sampleName) => {
		const meta = d3.select('#sample-metadata');
		meta.html('');
		for (const [ key, value ] of Object.entries(sampleName)) {
			const metaDiv = meta.append('div');
			metaDiv.text(`${key}: ${value}`);
		}
	});
}

function buildCharts(sample) {
	d3.json(`/samples/${sample}`).then((sampleName) => {
		// Make bubble chart
		let bubbleData = [
			{
				x: sampleName.otu_ids,
				y: sampleName.sample_values,
				mode: 'markers',
				marker: {
					size: sampleName.sample_values,
					color: sampleName.otu_ids
				},
				text: sampleName.otu_labels
			}
		];
		Plotly.newPlot('bubble', bubbleData);

		// make pie chart
		let samples = [];
		for (let i = 0; i < sampleName.sample_values.length; i++) {
			samples.push({
				sample_values: sampleName.sample_values[i],
				otu_ids: sampleName.otu_ids[i],
				otu_labels: sampleName.otu_labels[i]
			});
		}
		samples.sort((a, b) => (a.sample_values < b.sample_values ? 1 : -1));
		let sampleValues = [];
		let otuIDs = [];
		let otuLabels = [];
		for (let i = 0; i < 10; i++) {
			sampleValues.push(samples[i].sample_values);
			otuIDs.push(samples[i].otu_ids);
			otuLabels.push(samples[i].otu_labels);
		}
		let pieData = [
			{
				values: sampleValues,
				labels: otuIDs,
				type: 'pie',
				hovertext: otuLabels
			}
		];
		Plotly.newPlot('pie', pieData);
	});
}

function init() {
	// Grab a reference to the dropdown select element
	var selector = d3.select('#selDataset');

	// Use the list of sample names to populate the select options
	d3.json('/names').then((sampleNames) => {
		sampleNames.forEach((sample) => {
			selector.append('option').text(sample).property('value', sample);
		});

		// Use the first sample from the list to build the initial plots
		const firstSample = sampleNames[0];
		buildCharts(firstSample);
		buildMetadata(firstSample);
		buildGauge(firstSample);
	});
}

function optionChanged(newSample) {
	// Fetch new data each time a new sample is selected
	buildCharts(newSample);
	buildMetadata(newSample);
	buildGauge(newSample);
}

// Initialize the dashboard
init();
