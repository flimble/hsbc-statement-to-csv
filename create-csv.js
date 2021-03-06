var csv = '';
var nl = '\n';
var $table = $('table:not(".extPibTable")');
var statement_date = $('.extContentHighlightPib:eq(1) .extPibRow:eq(0) .hsbcTextRight').html();
var year = statement_date.substr(statement_date.length-4);

statement_date = new Date(Date.parse(statement_date)).toISOString().split('T')[0];

// build header
$('thead th', $table).each(function(){
	if($('a', $(this)).length) {
		csv = csv + '"' + $('strong', $(this)).html() + '",';
	} else {
		csv = csv + '"' + $(this).html() + '"';
	}
});

//csv = csv + nl;
csv = '';

// get rest of data

var rows = $('tbody tr', $table).length - 1;


// loop rows
$('tbody tr', $table).each(function(i){
	if(i > 0 && i != rows) {
		
	
	// loop cells
	var cell_count = 0;
	$('td', $(this)).each(function(){
		
		if(cell_count==0) {
			// this is the date
			var dateString = $('p', $(this)).html().trim() + ' ' + year;
			var date = new Date(Date.parse(dateString));
			csv = csv + '"' + date.toISOString().split('T')[0] + '",';
		} else if(cell_count==5) {
			// this is the balance
			
			var balance = $('p', $(this)).html().trim().replace('<b>', '').replace('</b>', '');
			if($('p', $(this).next()).html().trim()=='D') {
				balance = '-' + balance;
			}
			csv = csv + '"' + balance + '"';
		}	
		else if(cell_count==3) {
			// this is the paid out
			var paidOut = $('p', $(this)).html().trim().replace('&nbsp;', '').replace('<b>', '').replace('</b>', '');
			
			csv = csv + '"' + paidOut * -1 + '",';
		} else if(cell_count!=6) {
			
			if($('a', $(this)).length) {
				csv = csv + '"' + $('a', $(this)).html().trim() + '",';
			} else {
				
				if($('strong', $(this)).length) {
					csv = csv + '"' + $('strong', $(this)).html().trim().replace('<b>', '').replace('</b>', '') + '",';
				} else {
					csv = csv + '"' + $('p', $(this)).html().trim().replace('&nbsp;', '').replace('<b>', '').replace('</b>', '') + '",';
				}
				
			}
		}
		
		cell_count++;
	});
	
	csv = csv + nl;
	}
});

var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

$('body').append('<a href="'+data+'" download="statement-'+statement_date+'.csv" id="download-statement" style="display: none;">Download</a>');

$('#download-statement')[0].click();
