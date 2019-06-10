var dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9qGeumntFjt6wEd6hgT2ZaLbhhYkfdXBbIx_iriMrVTznvcUP6TT-9PMuZ0GD0uu96q7mX4rup0Xj/pub?gid=0&single=true&output=csv'

d3.csv(dataUrl).then(function(data) {

	var nested = d3.nest()
  	.key(function(d) { return d.date; })
  	.entries(data);

	console.log(nested);

	var cards = d3.select('#gameResults')
		.selectAll('div.card')
		.data(nested)
		// .data(nested.reverse())
		.enter()
		.append('div')
		.attr('class', 'card');

	var cardHeaders = cards.append('div')
		.attr('class', 'card-header')
		.attr('id', function(d, i) {
			return 'gameDay' + (nested.length - i);
		})
		.append('h5')
		.attr('class', 'mb-0 text-center text-primary')
		.append('button')
		.attr('class', 'btn btn-link')
		.attr('type', 'button')
		.attr('data-toggle', 'collapse')
		.attr('data-target', function(d, i) {
			// return '#collapseGameDay' + (nested.length - i);
			return '#collapseGameDay' + (i+1);
		})
		.attr('aria-expanded', 'true')
		.html(function(d, i) {
			// return 'Game Day ' + (nested.length - i) + ' - ' + d.key;
			return 'Game Day ' + (i+1) + ' - ' + d.key;
		});

	var cardBodies = cards.append('div')
		.attr('class', 'collapse show')
		.attr('id', function(d, i) {
			// return 'collapseGameDay' + (nested.length - i);
			return 'collapseGameDay' + (i+1);
		})
		.append('div')
		.attr('class', 'card-body text-center')
		.append('table')
		.attr('class', 'table table-sm') //table-responsive
		.append('tbody');

	var games = cardBodies.selectAll('td')
		.data(function(d) { return d.values; })
		.enter()
		.append('tr')
		.attr('class', 'd-flex table-borderless');

	games.append('td')
		.attr('class', 'text-right col-5')
		.html(function(g) { return g.home + '<span><img src="https://github.com/jinlong25/amgen-soccer-league/raw/master/img/' + g.home + '.png"></span>'; });
		// .html(function(g) { return g.home + '<span><img src="/img/' + g.home + '.png"></span>'; });


	games.append('td')
		.attr('class', 'text-center col-2 font-weight-bold')
		.html(function(g) {
			if(g.home_goal === '') {
				return g.time;
			} else {
				return g.home_goal + ':' + g.away_goal;
			}

		});

	games.append('td')
		.attr('class', 'text-left col-5')
		.html(function(g) { return '<span><img src="https://github.com/jinlong25/amgen-soccer-league/raw/master/img/' + g.away + '.png"></span>' + g.away; });
});

d3.selectAll('.tab-toggle button').on('click', function(d) {
	d3.selectAll('.tab-toggle button').classed('btn-secondary', true);
	d3.selectAll('.tab-toggle button').classed('btn-primary', false);
	d3.select(this).classed('btn-secondary', false);
	d3.select(this).classed('btn-primary', true);

	if (d3.select(this).classed('game-day')) {
		d3.select('.game-day-tab').classed('d-none', false);
	} else {
		d3.select('.game-day-tab').classed('d-none', true);
	}
	console.log(d3.select(this).classed('game-day'))
});
