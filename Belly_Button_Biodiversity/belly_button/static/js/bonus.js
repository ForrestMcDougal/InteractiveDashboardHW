function buildGauge(sample) {
	d3.json(`/wfreq/${sample}`).then((sampleName) => {
		// Enter a speed between 0 and 180
		const level = sampleName.WFREQ;

		// Trig to calc meter point
		const degrees = 180 - level * 180 / 9,
			radius = 0.5;
		const radians = degrees * Math.PI / 180;
		const x = radius * Math.cos(radians);
		const y = radius * Math.sin(radians);

		// Path: may have to change to create a better triangle
		const mainPath = 'M -.0 -0.025 L .0 0.025 L ',
			pathX = String(x),
			space = ' ',
			pathY = String(y),
			pathEnd = ' Z';
		const path = mainPath.concat(pathX, space, pathY, pathEnd);

		const data = [
			{
				type: 'scatter',
				x: [ 0 ],
				y: [ 0 ],
				marker: { size: 28, color: '850000' },
				showlegend: false,
				name: 'washes',
				text: level,
				hoverinfo: 'text+name'
			},
			{
				values: [ 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 ],
				rotation: 90,
				text: [ '8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', '' ],
				textinfo: 'text',
				textposition: 'inside',
				marker: {
					colors: [
						'#CCFFCC',
						'#99FF99',
						'#66FF66',
						'#33FF33',
						'#00FF00',
						'#00CC00',
						'#009900',
						'#006600',
						'#003300',
						'rgba(255, 255, 255, 0)'
					]
				},
				labels: [ '8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', '' ],
				hoverinfo: 'label',
				hole: 0.5,
				type: 'pie',
				showlegend: false
			}
		];

		var layout = {
			shapes: [
				{
					type: 'path',
					path: path,
					fillcolor: '850000',
					line: {
						color: '850000'
					}
				}
			],
			title: 'Scrubs Per Week',
			xaxis: {
				zeroline: false,
				showticklabels: false,
				showgrid: false,
				range: [ -1, 1 ]
			},
			yaxis: {
				zeroline: false,
				showticklabels: false,
				showgrid: false,
				range: [ -1, 1 ]
			}
		};

		Plotly.newPlot('gauge', data, layout);
	});
}
