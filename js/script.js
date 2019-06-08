var dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9qGeumntFjt6wEd6hgT2ZaLbhhYkfdXBbIx_iriMrVTznvcUP6TT-9PMuZ0GD0uu96q7mX4rup0Xj/pub?gid=0&single=true&output=csv'

d3.csv(dataUrl).then(function(data) {
	console.log(data);
});