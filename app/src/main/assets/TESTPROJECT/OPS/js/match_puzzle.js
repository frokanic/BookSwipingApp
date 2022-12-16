/* Prject: AZARDI event Education Library
Module: Cross Words for K-12
Created by: Milan Bishwakarma
Version: 0.0.1
Copyright 2013 Infogrid Pacific. All rights reserved.
*/
var AIEL = AIEL || {};
AIEL.PuzzleMatch = {
	settings: {},
	userdata: {},
	init:function(){
		$('.puzzle-match-i-rw').find('.option-source li').each(function(){
			var txt = $.trim($(this).html());
			var t = '<span class="option">'+txt+'</span><span class="target"></span>';
			$(this).html(t);
		});
		
		$('.option-source').each(function(){
			var num = 0;
			var src = $(this);
			$(this).find('ol, .match-images-rw').each(function(i){
				$(this).find('li, p').each(function(j){
					$(this).attr('data-row', 'row_'+(num+1));
					//$(this).find('.option').attr('data-seq', num+1);
					
					$(src).find('ol:eq(0)').find('.option:eq('+j+')').attr('data-seq', 'a'+(num+1));
					$(src).find('ol:eq(1)').find('.option:eq('+j+')').attr('data-seq', 'b'+(num+1));
					
					num++;
				});
				num = 0;
			});
		});
		
		AIEL.PuzzleMatch.generateIDs();
		AIEL.PuzzleMatch.populateAnswer();
		//AIEL.PuzzleMatch.CrossWordsAsignment();
		
		AIEL.PuzzleMatch.crossWordSetup();
		AIEL.PuzzleMatch.eventHandler();
		
		AIEL.PuzzleMatch.UserResultStorage.init();
	},
	
	crossWordSetup:function(){
		$('.crosswords-i-rw').each(function(){
			//.auto-event-i-rw
			var ID = $(this).attr('id');
			AIEL.PuzzleMatch.settings[ID] = {
				'editables': [],
				'editNav': [],
				'result': 0,
				'mode': 'learning',
				'score': 0,
				'attempts': 0,
				'marks': 0,
				'allowTestAttempts': 4,
				'attemptsMade': 0,
			}
			AIEL.PuzzleMatch.settings[ID].mode = $(this).hasClass('mode-learning') ? 'learning':'test';
			AIEL.PuzzleMatch.settings[ID].allowTestAttempts = parseInt($.trim($(this).find('.crosswords-setup .edit-chance').text())) ? $.trim(parseInt($(this).find('.crosswords-setup .edit-chance').text())):1;
			//AIEL.PuzzleMatch.autoEventHandler(ID);
			AIEL.PuzzleMatch.constructCrosswordsRelationship(ID);
		});
	},
	
	eventHandler:function(){
		
		$(document).on('click', '.puzzle-match-i-rw .option', function(){
			if(!$(this).hasClass('disabled')) {
				$(this).parents('.option-source').find('.option').removeClass('selected');
				$(this).addClass('selected');
			}
		});
		
		$(document).on('click', '.puzzle-match-i-rw .target', function(){
			var sel_ele = $(this).parents('.option-source').find('.selected');
			var sel_data = $(sel_ele).html();
			if($(sel_ele).length>0) {
				if($(this).hasClass('matched')) {
					var pre_data = $(this).html();
					var ref = $(this).attr('data-ref');
					$('#'+ref).find('.option').html(pre_data).removeClass('disabled');
				}
				$(this).html(sel_data).addClass('matched');
				$(this).attr('data-eval', $(sel_ele).attr('data-seq'));
				$(this).attr('data-ref', $(sel_ele).parents('li').attr('id'));
				
				//$(this).parents('.option-source').find('.selected').addClass('disabled').removeClass('selected');
				$(this).parents('.option-source').find('.selected').html('').attr('data-content', sel_data).addClass('disabled').removeClass('selected');
			}
			
		});
		$(document).on('dblclick', '.puzzle-match-i-rw .matched', function(){
			var ref = $(this).attr('data-ref');
			var data = $(this).html();
			$(this).parents('.option-source').find('#'+ref).find('.disabled').html(data).removeClass('disabled');
			$(this).html('').removeClass('matched');
		});
		
		/*$(document).on('click', '.match-images-rw img', function(){
			var sel_ele = $(this).parents('.option-source').find('.selected');
			var sel_data = $(sel_ele).html();
			if($(sel_ele).length>0) {
				var event_row = $(this).parents('p').attr('data-row');
				var tar = $(sel_ele).parents('ol').find('li[data-row="'+event_row+'"]').find('.target');
				if($(tar).hasClass('matched')) {
					var pre_data = $(tar).html();
					var ref = $(tar).attr('data-ref');
					$('#'+ref).find('.option').html(pre_data).removeClass('disabled');
				}
				//if(!$(tar).hasClass('matched')) {
					$(tar).html(sel_data).addClass('matched');
					$(tar).attr('data-ref', $(sel_ele).parents('li').attr('id'));
					$(this).parents('.option-source').find('.selected').html('').attr('data-content', sel_data).addClass('disabled').removeClass('selected');
				//}
			}
		});*/
		
		$(document).on('click', '.puzzle-match-i-rw .check', function(){
			var ID = $(this).parents('.puzzle-match-i-rw').attr('id');
			AIEL.PuzzleMatch.checkPMAnswer(ID);
		});
		$(document).on('click', '.puzzle-match-i-rw .try-again', function(){
			var ID = $(this).parents('.puzzle-match-i-rw').attr('id');
			AIEL.PuzzleMatch.tryAgainPMAnswer(ID);
		});
		$(document).on('click', '.puzzle-match-i-rw .reset', function(){
			var ID = $(this).parents('.puzzle-match-i-rw').attr('id');
			AIEL.PuzzleMatch.resetPMAnswer(ID);
		});
	},
	checkPMAnswer:function(ID){
		var eval = true;
		$('#'+ID).find('.option-source li').each(function(i){
			var ans = $.trim($(this).attr('data-ans'));
			var input = $.trim($(this).find('.target').attr('data-eval'));
			var data_seq = $.trim($(this).find('.option').attr('data-seq'));
			if(input == ans) {
				$(this).find('.target.matched').addClass('correct').removeClass('matched');
				$(this).parent().find("[data-seq='"+input+"']").addClass('fixed_match');
			} else {
				$(this).find('.target.matched').addClass('wrong').removeClass('matched');
				eval = false;
			}
			$(this).find('.option').addClass('disabled');
		});
		AIEL.PuzzleMatch.showFeedback(eval, ID);
	},
	tryAgainPMAnswer:function(ID){
		$('#'+ID).find('.option-source li .wrong').each(function(i){
			$(this).text('').removeClass('wrong');
			var ref = $(this).attr('data-ref');
			$(this).parents('.option-source').find('#'+ref).find('.disabled').html($(this).parents('.option-source').find('#'+ref).find('.disabled').attr('data-content'));
			$(this).parents('.option-source').find('#'+ref).find('.disabled').removeClass('disabled');
		});
		$('#'+ID).find('.option-source li .option').each(function(i){
			if(!$(this).hasClass('fixed_match')) {
				$(this).removeClass('disabled');
			}
		});
		$('#'+ID).find('.feedback-messages').hide();
		$('#'+ID).find('.puzzle-score-rw').hide();
	},
	resetPMAnswer:function(ID){
		$('#'+ID).find('.option-source li').each(function(i){
			$(this).find('.disabled').html($(this).find('.disabled').attr('data-content'));
			$(this).find('.target').text('').removeClass('correct wrong matched');
			$(this).find('.target').attr('data-ref','');
			$(this).find('.target').removeAttr('data-eval');
			$(this).find('.option').removeClass('disabled fixed_match selected');
			$(this).find('.option').removeAttr('data-content');
		});
		$('#'+ID).find('.feedback-messages').hide();
		$('#'+ID).find('.puzzle-score-rw').hide();
	},
	populateAnswer:function(){
		$('.puzzle-match-i-rw').each(function(){
			var ans_txt = '';
			
			$(this).find('.answer-map li:eq(0)').each(function(){
				ans_txt = ans_txt =='' ? ans_txt + $(this).text() : ans_txt +' , '+ $(this).text();
			});
			
			var ans_map = ans_txt.split(',');
			$(this).find('.option-source ol:eq(0) li').each(function(i){
				$(this).attr('data-ans',  'a'+ $.trim(ans_map[i]));
			});
			
			var ans_txt2 = '';
			$(this).find('.answer-map li:eq(1)').each(function(){
				ans_txt2 = ans_txt2 + $(this).text();
			});
			var ans_map2 = ans_txt2.split(',');
			$(this).find('.option-source ol:eq(1) li').each(function(i){
				$(this).attr('data-ans', 'b'+ $.trim(ans_map2[i]));
			});
			
		});
	},
	showFeedback:function(eval, ID){
		$('#'+ID).find('.feedback-messages').show();
		if(eval == true) {
			$('#'+ID).find('.feedback-messages .correct').show();
			$('#'+ID).find('.feedback-messages .wrong').hide();
		} else {
			$('#'+ID).find('.feedback-messages .correct').hide();
			$('#'+ID).find('.feedback-messages .wrong').show();
		}
		AIEL.PuzzleMatch.scoreCalc(ID);
	},
	scoreCalc:function(ID){
		var total = $('#'+ID).find('.option-source li').length;
		var correct = $('#'+ID).find('.option-source li .correct').length;
		var wrong = $('#'+ID).find('.option-source li .wrong').length;
		
		var score =  Math.round((correct/total)*100) ? Math.round((correct/total)*100) : 0;
		$('#'+ID).find('.correct-score .score').text(score+'%');
		$('#'+ID).find('.correct-wrong-score .score').text(correct +' / '+total);
		$('#'+ID).find('.correct-count .score').text(correct);
		$('#'+ID).find('.wrong-count .score').text(wrong);
		$('#'+ID).find('.puzzle-score-rw').show();
	},
	generateIDs:function(){
		$('.puzzle-match-i-rw').each(function(i){
			var par_id = 'pm__'+(i+1);
			var old_id = $(this).attr('id');
			if(!old_id) {
				$(this).attr('id', par_id);
			}
			var objid = $(this).attr('id');
			$(this).find('.option-source li').each(function(i){
				var spn_id = objid+'__'+'li__'+(i+1);
				$(this).attr('id',spn_id);
			});
		});
	},
	navigateFocus:function(self){
		var ID = $(self).parents('.crosswords-i-rw').attr('id');
		alert(AIEL.PuzzleMatch.settings[ID].result);
	},
	checkIfFinished:function(self){
		var ID = $(self).parents('.crosswords-i-rw').attr('id');
		var correct = $('.crosswords-i-rw').find('table td[contenteditable].correct').length;
		var wrong = $('.crosswords-i-rw').find('table td[contenteditable].wrong').length;
		var total = AIEL.PuzzleMatch.settings[ID].result;
		var completed = correct+wrong;
		if(total == completed) {
			$('#'+ID).find('.feedback-messages').show();
			if(total == correct) {
				$('#'+ID).find('.feedback-messages .fbm-correct').show();
				$('#'+ID).find('.feedback-messages .fbm-wrong').hide();
			} else {
				$('#'+ID).find('.feedback-messages .fbm-correct').hide();
				$('#'+ID).find('.feedback-messages .fbm-wrong').show();
				AIEL.PuzzleMatch.generateWrongWords(ID);
			}
		} else {
			$('#'+ID).find('.feedback-messages').hide();
			$('#'+ID).find('.puzzle-score-rw').hide();
		}
	},
	
	evaluateUserEvent:function(td_id) {
		var ID = $('#'+td_id).parents('.crosswords-i-rw').attr('id');
		var eval = $('#'+td_id).attr('data-eval');
		var usr_input = $.trim($('#'+td_id).text());
		if(eval === usr_input) {
			$('#'+td_id).addClass('correct').attr('contenteditable', 'false');
			$('#'+td_id).removeClass('wrong');
			AIEL.PuzzleMatch.settings[ID].score = AIEL.PuzzleMatch.settings[ID].score+1;
		} else {
			$('#'+td_id).addClass('wrong');
			$('#'+td_id).removeClass('correct');
			AIEL.PuzzleMatch.settings[ID].attempts = AIEL.PuzzleMatch.settings[ID].attempts+1;
		}
		AIEL.PuzzleMatch.scoreCalc(ID);
	},
}

AIEL.PuzzleMatch.UserResultStorage = {
	init: function() {
		AIEL.PuzzleMatch.UserResultStorage.loadUserResult();
	},
	
	getUniqueName: function() {
		// we have local storage saving problem on the AZARDI IOS Reader from ACF
		var acf_bookid = '';
		try {
			acf_bookid = key; // key variable is not defined on this js, this defined on iOS reader of ACF and it mean to give Book ID and Account ID
		} catch(e) {
			acf_bookid = 'AIEL_CrossWords';
		}
		var path = window.location.pathname;
		var solitnames = path.split('/');
		var pagename = solitnames[solitnames.length-1];
		var uniquename = pagename + "::" + acf_bookid;
		return uniquename;
	},
	
	// Function to store the result of the user in local storage
	 saveUserResult: function() {
		var uname = this.getUniqueName();
		//AIEL.PuzzleMatch.userdata = {};
		//alert(JSON.stringify(AIEL.PuzzleMatch.userdata));
		localStorage.setItem(uname, JSON.stringify(AIEL.PuzzleMatch.userdata));
		return;
	 },
	 
	 // Function to load the result of the user from local storage 
	 loadUserResult: function() {
		var uname = this.getUniqueName();
		var retrievedObject = localStorage.getItem(uname);
		var user_objects = JSON.parse(retrievedObject);
		AIEL.PuzzleMatch.userdata = user_objects;
		if (user_objects) {
			var ID = '';
			var scorescard = {};
			for (item in user_objects) {
				ID = item;
				scorescard = user_objects[item].scores;
				var objects = user_objects[item];
				for (td in objects) {
					if(td == 'scores') {
						
					} else {
						var ele = td;
						var val = objects[td];
						$('#'+ele).text(val);
						AIEL.PuzzleMatch.evaluateUserEvent(ele);
					}
				}
			}
			$('#'+ID).find('.score-board').find('.cw-score').text(scorescard.score);
			$('#'+ID).find('.score-board').find('.cw-attempts').text(scorescard.attempts);
			$('#'+ID).find('.score-board').find('.cw-marks').text(scorescard.marks);
		} else {
			AIEL.PuzzleMatch.userdata = {};
		}
		return;
	},
}

$(document).ready(function(){
	if($('.puzzle-match-i-rw:not(.qaa-rw)').length > 0 ) {
		AIEL.PuzzleMatch.init();
	}
});