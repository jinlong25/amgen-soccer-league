var dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9qGeumntFjt6wEd6hgT2ZaLbhhYkfdXBbIx_iriMrVTznvcUP6TT-9PMuZ0GD0uu96q7mX4rup0Xj/pub?gid=0&single=true&output=csv'

d3.csv(dataUrl).then(function(data) {

	var nested = d3.nest()
  	.key(function(d) { return d.date; })
  	.entries(data);
	
	console.log(nested);
	
	var cards = d3.select('#gameResults')
		.selectAll('div.card')
		.data(nested.reverse())
		.enter()
		.append('div')
		.attr('class', 'card');
		
	cards.append('div')
		.attr('class', 'card-header')
		.attr('id', function(d, i) {
			return 'gameDay' + (nested.length - i);
		})
		.append('h5')
		.attr('class', 'mb-0 text-center')
		.append('button')
		.attr('class', 'btn btn-link')
		.attr('type', 'button')
		.attr('data-toggle', 'collapse')
		.attr('data-target', function(d, i) {
			return '#collapseGameDay' + (nested.length - i);
		})
		.attr('aria-expanded', 'true')
		.html(function(d, i) {
			return 'Game Day ' + (nested.length - i) + ' - ' + d.key;
		});
		
	cards.append('div')
		.attr('class', 'collapse show')
		.attr('id', function(d, i) {
			return 'collapseGameDay' + (nested.length - i);
		})
		.append('div')
		.attr('class', 'card-body text-center')
		
		
		
		.html(function(d) {
			d.values.forEach
			console.log(d);
			return d.values[0].home 
				+ ' '
				+ d.values[0].home_goal 
				+ ':'
				+ d.values[0].away_goal
				+ ' '
				+ d.values[0].away;
		});
		
});