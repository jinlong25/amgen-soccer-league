var dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9qGeumntFjt6wEd6hgT2ZaLbhhYkfdXBbIx_iriMrVTznvcUP6TT-9PMuZ0GD0uu96q7mX4rup0Xj/pub?gid=0&single=true&output=csv'

d3.csv(dataUrl).then(function(data) {

	//show hidden components after data return
	d3.select('.updated').classed('d-none', false);
	d3.select('.tab-toggle').classed('d-none', false);
	d3.select('footer').classed('d-none', false);
	d3.select('.loader').classed('d-none', true);

	var nested = d3.nest()
  	.key(function(d) { return d.date; })
  	.entries(data);

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
			if (d.values[0].game_type === 'season') {
				return 'gameDay' + (nested.length - i);
			} else {
				return d.values[0].game_type;
			}
		})
		.append('h5')
		.attr('class', 'mb-0 text-center text-primary')
		.append('button')
		.attr('class', 'btn btn-link font-weight-bold')
		.attr('type', 'button')
		.attr('data-toggle', 'collapse')
		.attr('data-target', function(d, i) {
			// return '#collapseGameDay' + (nested.length - i);
			return '#collapseGameDay' + (i+1);
		})
		.attr('aria-expanded', 'true')
		.html(function(d, i) {
			// return 'Game Day ' + (nested.length - i) + ' - ' + d.key;
			if (d.values[0].game_type === 'season') {
				return 'Game Day ' + (i+1) + ' - ' + d.key;
			} else {
				return d.values[0].game_type + ' - ' + d.key;
			}
			//return 'Game Day ' + (i+1) + ' - ' + d.key;
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
		.html(function(g) {
			if (g.home === 'TBD') {
				return g.home;
			} else {
				return g.home + '<span><img src="https://github.com/jinlong25/amgen-soccer-league/raw/master/img/' + g.home + '.png"></span>';
			}
			});
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
		.html(function(g) {
			if (g.away === 'TBD') {
				return g.away;
			} else {
				return '<span><img src="https://github.com/jinlong25/amgen-soccer-league/raw/master/img/' + g.away + '.png"></span>' + g.away;
			}
		});



	//Calculate league Table
	var lt = {};

	//get all teams
	data.forEach(function(d) {
		if (!lt.hasOwnProperty(d.home)) {
			lt[d.home] = {
				'gp': 0,
				'gs': 0,
				'gc': 0,
				'gd': 0,
				'pts': 0,
				'w': 0,
				'd': 0,
				'l': 0
			}
		}
		if (!lt.hasOwnProperty(d.away)) {
			lt[d.away] = {
				'gp': 0,
				'gs': 0,
				'gc': 0,
				'gd': 0,
				'pts': 0,
				'w': 0,
				'd': 0,
				'l': 0
			}
		}
	});

	//calculate gs, gc
	data.forEach(function(d) {
		//gp, gs, gc
		if (d.home_goal !== '') {
			lt[d.home]['gp'] += 1;
			lt[d.away]['gp'] += 1;

			lt[d.home]['gs'] += parseInt(d.home_goal);
			lt[d.home]['gc'] += parseInt(d.away_goal);

			lt[d.away]['gs'] += parseInt(d.away_goal);
			lt[d.away]['gc'] += parseInt(d.home_goal);

			if(parseInt(d.home_goal) > parseInt(d.away_goal)) {
				lt[d.home]['pts'] += 3;
				lt[d.home]['w'] += 1;
				lt[d.away]['l'] += 1;
			} else if (parseInt(d.home_goal) === parseInt(d.away_goal)) {
				lt[d.home]['pts'] += 1;
				lt[d.away]['pts'] += 1;
				lt[d.home]['d'] += 1;
				lt[d.away]['d'] += 1;
			} else if (parseInt(d.home_goal) < parseInt(d.away_goal)) {
				lt[d.away]['pts'] += 3;
				lt[d.home]['l'] += 1;
				lt[d.away]['w'] += 1;
			}
		}
	});

	//calculate gd
	for (var property in lt) {
	    if (lt.hasOwnProperty(property)) {
	        lt[property]['gd'] = parseInt(lt[property]['gs']) - parseInt(lt[property]['gc']);
	    }
	}

	//convert lt to an object array
	ltData = [];
	for (var property in lt) {
			if (lt.hasOwnProperty(property)) {
				var obj = {
					'team': property,
					'gp': lt[property]['gp'],
					'gs': lt[property]['gs'],
					'gc': lt[property]['gc'],
					'gd': lt[property]['gd'],
					'pts': lt[property]['pts'],
					'w': lt[property]['w'],
					'd': lt[property]['d'],
					'l': lt[property]['l'],
				}
				ltData.push(obj);
			}
	}

	//sort teams by pts
	ltData.sort(function(a, b) {
  	return b.pts - a.pts || b.gd - a.gd;
	});
	//console.log(ltData);

	//populate league table
	var rows = d3.select('.league-table-tab tbody')
		.selectAll('tr')
		.data(ltData)
		.enter()
		.append('tr');

	rows.append('th')
		.attr('class', 'font-weight-normal text-left')
		.html(function(d) {
			return '<span><img src="https://github.com/jinlong25/amgen-soccer-league/raw/master/img/' + d.team+ '.png"></span>' + d.team;
		});

	rows.append('th')
		.attr('class', 'font-weight-normal')
		.html(function(d) {
			return d.gp;
		});

	rows.append('th')
		.attr('class', 'font-weight-normal')
		.html(function(d) {
			return d.w;
		});

	rows.append('th')
		.attr('class', 'font-weight-normal')
		.html(function(d) {
			return d.d;
		});

	rows.append('th')
		.attr('class', 'font-weight-normal')
		.html(function(d) {
			return d.l;
		});

	rows.append('th')
		.attr('class', 'font-weight-normal')
		.html(function(d) {
			return d.gs;
		});

	rows.append('th')
		.attr('class', 'font-weight-normal')
		.html(function(d) {
			return d.gc;
		});

	rows.append('th')
		.attr('class', 'font-weight-normal')
		.html(function(d) {
			return d.gd;
		});

	rows.append('th')
		.html(function(d) {
			return d.pts;
		});

});

d3.selectAll('.tab-toggle button').on('click', function(d) {
	d3.selectAll('.tab-toggle button').classed('btn-secondary', true);
	d3.selectAll('.tab-toggle button').classed('btn-primary', false);
	d3.select(this).classed('btn-secondary', false);
	d3.select(this).classed('btn-primary', true);

	if (d3.select(this).classed('game-day')) {
		d3.select('.game-day-tab').classed('d-none', false);
		d3.select('.league-table-tab').classed('d-none', true);
	} else {
		d3.select('.game-day-tab').classed('d-none', true);
		d3.select('.league-table-tab').classed('d-none', false);
	}
});

//enable tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
