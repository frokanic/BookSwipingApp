// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine Starter Function

// Modified by Express Publishing 2022

Express.CustomTools.DocumentReady( function() {

	if( $('.qaa-rw').length > 0 ) {
		AIE.Qaa.TextMatch.dragItems();
		AIE.Qaa.init();
	}
});

Express.CustomTools.WindowLoad( function() {
	
	var tap_puzzle = $(".qaa-rw.tap-puzzle-rw");
		
	if( tap_puzzle.length > 0 ) {
			
		tap_puzzle.each( function() {
			
			AIE.Qaa.TapPuzzle.lockOptionDivs( $(this) );
			AIE.Qaa.TapPuzzle.autoTargetWidth( $(this) );
		});
	}
});