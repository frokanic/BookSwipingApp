// Express Publishing custom tools used by some custom templates.

Express = {};

Express.CustomTools = {},

Express.CustomTools.isMobile = /iPhone|iPod|iPad|Windows Phone|Mobi|Android/i.test(navigator.userAgent.toLowerCase());

Express.CustomTools.ReplaceAll = function( text, subold, subnew, limit ) {
	
	//ARGUMENTS
	
	// text 	: the text to edit.
	// subold 	: what to replace in text.
	// subnew   : with what to replace.
	// limit    : how many times to replace. (default is 1000 to prevent infinite loop if something goes wrong)
	
	if( typeof(limit) != "number" ) limit = 1000;
	
	var i = 0;
	
	while( text.search( subold ) != -1  &&  i < limit ) {
		
		text = text.replace( subold, subnew );
		
		i += 1;
		
	}
	
	return text;
}

Express.CustomTools.ShowAnswers_SelectRandom = function( select_limit, correct_count, answer_key, contents ) {
	
	//ARGUMENTS
	
	// select_limit 	: how many items the user is allowed to select for this question.
	// correct_count 	: how many coorect items exist in this question
	// answer_key		: a string containing the question answers. This function works only with this key format : 001011010 (example)
	// contents         : a pointer to the question items. (e.g. the items that the user can click)
	
	// check if the correct items are more than the items that the user is allowed to select.
	
	if( select_limit < correct_count ) {
		
		var i = 0;					// loop counter 1
		var j = select_limit;		// loop counter 2
		var n = 0;					// item counter
		var items = [];				// item container
		
		// find correct item IDs in answer key.
		
		while( i < answer_key.length && answer_key[i] != '=' ) {
			
			if( answer_key[i] == '1' ) {
				
				items[n] = i;
				n += 1;
			}
			i += 1;
		}
		
		// unselect all items. if there are correct items when show is pressed, we want to keep them for once before they get replaced by random selections.
		
		$(contents).each( function(N1) {
			
			if( $(this).hasClass("correct") ) {
				
				$(this).removeClass('correct wrong undefined');
				$(this).addClass('selected-aie');
				
				// remove the correct item from our item container so the random function bellow won't choose it again.
				
				var l_i = 0;
				while( l_i < n ) {
					
					if( items[l_i] == N1 ) {
						
						items[l_i] = items[n-1]; 	// to the position that our correct item is found, bring the item that is at the end of the array.
						n -= 1;						// reduce the array size by 1 so the last element is 'removed'.
						j -= 1;						// counter for random selections bellow
						break;
					}
					l_i += 1;
				}
			}
			
			else $(this).removeClass('wrong undefined selected-aie');
			
		});
		
		
		// randomly select correct items
		
		while( j > 0 ) {
			
			// get a random index for the item container
			var rand = Math.floor( Math.random() * n ); 
			
			// select the corresponding element using the random index of the item container.
			$( contents[ items[rand] ] ).addClass('selected-aie');
			
			// "remove" this item from the container
			// do this only if the selected index was not the last one, there is no reason to replace it with itself.
			if( rand < n ) items[rand] = items[n-1];
			n -= 1;
			j -= 1;
		}
		
	}
	
	// if we don't need to display random answers, then display all that are correct
	
	else {
	
		$(contents).each( function(N1) {
			
			// reset
			$(this).removeClass('correct wrong undefined selected-aie');
			
			// select
			if( answer_key[N1] == '1' ) $(this).addClass('selected-aie');
			
		});
		
	}
}
	
Express.CustomTools.point_distance = function(x1,y1,x2,y2) {
			
	return Math.sqrt( Math.pow( x2-x1 , 2 ) + Math.pow( y2-y1 , 2 )  );
}

Express.CustomTools.point_direction = function(x1,y1,x2,y2) {
		
	var A = Math.atan2( (y1-y2) , (x2-x1) );
	if( A < 0 ) A = (Math.PI*2.0) + A;
	return A;
}
	
Express.CustomTools.cosd = function( deg ) {
	
	return Math.cos(  ((deg / 180.0) * Math.PI)  );
}
	
Express.CustomTools.sind = function( deg ) {
	
	return Math.sin(  ((deg / 180.0) * Math.PI)  );
}

Express.CustomTools.toDeg = function( rad ) {
	
	return ( (rad / Math.PI) * 180.0 );
}

Express.CustomTools.toRad = function( deg ) {
	
	return ( (deg / 180.0) * Math.PI );
}

Express.CustomTools.DocumentReady = function( func ) {
	
	$(document).ready( function() {
		
		try { 
		
			func();
		}
		catch(e){
			
			console.log(e);
		}
	});
}

Express.CustomTools.WindowLoad = function( func ) {
	
	var temp;
	
	if( typeof(window_load_triggered) == "undefined" ) temp = false;
	else temp = window_load_triggered;
	
	if( temp ) {
	
		try { 
		
			func();
		}
		catch(e){
			
			console.log(e);
		}
	}
	else $(window).load( function() {
		
		try { 
		
			func();
		}
		catch(e){
			
			console.log(e);
		}
	});
}