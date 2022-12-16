// Multi Choice Opacity custom template.

AIE.Qaa.MultiChoiceOpacity = {
		
	reTry: false,
	answerCount: {},
	correctCount: {},
	maxAnswerCount: {},
	
	// check answers
	checkAnswers: function( parentobj, incr_correct_count ) {
			
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
			
		var eval_status = true;
		var qaa_id = $(parentobj).attr("id");

		// for each opt source
		$(parentobj).find('.option-source').each( function(N) {
			
			//get answer key for this option source
			
			var answerkey = Express.CustomTools.ReplaceAll( $(parentobj).find('.answer-map li:eq('+N+')').text().trim() , " " , "" );
			
			// for each LI image
			
			$(this).find('li:not(.mco_inactive):not(.mco_passive) .image-rw').each( function(NN) {
			
				// check if LI image is selected or already correct
				var isSlct = ($(this).hasClass( "selected-aie" ) == true);
				var isCrct = ($(this).hasClass( "correct" ) == true);
				
				// check for correct and wrong
				
				if( isSlct == true ) {
					
					if( answerkey[NN] == '1' ) 
						
						$(this).addClass( "correct" );
	
					else {
				
						$(this).addClass( "wrong" );
						eval_status = false;
					}
					
					$(this).removeClass( "selected-aie" );
				}
			
			});
		
		});
		
		// update user selection map
		
		if( typeof(AIE.Qaa.userSelectionMap) != 'undefined' && AIE.Qaa.userSelectionMap.hasOwnProperty(qaa_id) ) {
		
			if (eval_status && incr_correct_count) AIE.Qaa.userSelectionMap[qaa_id]['correct-count'] += 1;
			AIE.Qaa.userSelectionMap[qaa_id]['userselection'] = AIE.Qaa.MultiChoiceOpacity.save( parentobj );
		}
		
		AIE.Qaa.showFeedback(parentobj, eval_status);
		
		// call score function
		AIE.Qaa.MultiChoiceOpacity.setScoreMCO(parentobj);
		
		return eval_status;
		
	},
	
	// get max answer value automatically
	MCO_answerkey_count: function( key_text ) {
		
		var i=0;
		var n=0;
		
		while( i < key_text.length ) {
			
			if( key_text[i] == '1' ) n += 1;
			i += 1;
		}
		
		return n;
	},
	
	// check if the max answer value for a specific option source is given
	MCO_check_max_answers_given: function( key_text ) {
		
		var i = 0;
		var str = "";
		var num = 0;
		
		// check all chars
		while( i < key_text.length ) {
			
			// if seperator found
			if( key_text[i] == '=' ) {
				
				// skip seperator
				i += 1;
				
				// get all next chars
				while( i < key_text.length ) {
					
					str += key_text[i];
					i += 1;
				}
				
				// convert to integer
				num = parseInt( str );
				if( isNaN( num ) == true ) num = 0;
				break;
			}
			
			i += 1;
		}
		
		return num;
		
	},
	
	// set score
	setScoreMCO: function( obj ) {
		
		if(!$(obj).find('.buttons-rw').find('.check').attr('disabled')) {
			$(obj).find('.buttons-rw').find('.show-answers').removeAttr('disabled');
			$(obj).find('.buttons-rw').find('.save-answers').attr('disabled', 'disabled');
		}
		
		var answerkey = "";
		var items = AIE.Qaa.MultiChoiceOpacity.maxAnswerCount[ $(obj).attr('id') ];
		var correct_items = $(obj).find('.option-source ol li .image-rw.correct').length;
		var wrong_items = $(obj).find('.option-source ol li .image-rw.wrong').length;
		
		
		if( items > 0 ) {
			
			score = Math.max(
				Math.round( ((correct_items/items)*100 ) - (wrong_items*10) )
				,
				0
			);
		}
		else score = 0;
		
		$(obj).find('.qaa-score-rw').show();
		
		$(obj).find('.correct-score').find('.score').text(score+'%');
		$(obj).find('.correct-wrong-score').find('.score').text(correct_items+'/'+items);
		$(obj).find('.correct-count').find('.score').text(correct_items);
		$(obj).find('.wrong-count').find('.score').text(wrong_items);
		$(obj).attr('data-answer-mark', correct_items+','+wrong_items+','+items);
		
		
	},
	
	// show answers
	showAnswersMCO: function( parentobj ) {
		
		$(parentobj).find('.option-source').each( function(N1) {
		
			var l_ans = AIE.Qaa.MultiChoiceOpacity.answerCount[ $(this).attr('id') ]
			var l_cor = AIE.Qaa.MultiChoiceOpacity.correctCount[ $(this).attr('id') ]
			var l_key = Express.CustomTools.ReplaceAll( $(parentobj).find('.answer-map li:eq('+N1+')').text().trim() , " " , "" );
			var l_cnt = $(this).find('li:not(.mco_inactive):not(.mco_passive) .image-rw');
			
			Express.CustomTools.ShowAnswers_SelectRandom( l_ans, l_cor, l_key, l_cnt );
			
		});
	},
	
	// clear answers
	clearAnswersMCO: function( parentobj ) {
		
		parentobj.find('.option-source ol li .image-rw.selected-aie').removeClass('selected-aie');
		parentobj.find('.option-source ol li .image-rw.correct').removeClass('correct');
		parentobj.find('.option-source ol li .image-rw.wrong').removeClass('wrong');
		parentobj.find('.feedback-messages').hide();
		AIE.Qaa.CheckScore.resetScore(parentobj);
	},
	
	// save answers
	save: function( parentobj ) {
		
		var userinput = {};
		
		$(parentobj).find('.option-source ol li:not(.mco_inactive):not(.mco_passive) .image-rw').each( function() {
			
			userinput[ $(this).attr("id") ] = (   $(this).hasClass("selected-aie") || $(this).hasClass("correct") || $(this).hasClass("wrong")   );
		});
		
		return userinput;
	},
	
	// load answers
	load: function( parentobj, userinput ) {
		
		var hasinput = false;
		
		$(parentobj).find(".option-source ol li:not(.mco_inactive):not(.mco_passive) .image-rw").each( function() {
			
			get = userinput[ $(this).attr("id") ];
			
			if( typeof(get) != 'undefined' ) {
				
				if( get ) {
					if( !$(this).hasClass("selected-aie") ) $(this).addClass("selected-aie");
					hasinput = true;
				}
				else {
					if( $(this).hasClass("selected-aie") ) $(this).removeClass("selected-aie");
				}
			}
		});
		
		if( !$(parentobj).hasClass("saveonly") && hasinput ) AIE.Qaa.MultiChoiceOpacity.checkAnswers( parentobj, false );
		
		return;
	},
	
	// init  
	init:function() {
		
		var QaaAll = $('.qaa-rw.multi-choice-opacity-rw');
		
		$(QaaAll).each( function() {
			
			var qaa_obj = $(this);
			
			AIE.Qaa.MultiChoiceOpacity.maxAnswerCount[ $(qaa_obj).attr('id') ] = 0;
			
			//for each option source
			
			$(qaa_obj).find('.option-source').each( 
								
				function(i1) {
					
					// GENERATE IDS TO IMAGES ///////////////////////////////////////
					
					// for each LI
					
					$(this).find("li").each( function(i2) {
						
						var parent_id = $(this).attr("id");
						
						// for each image
						
						$(this).find(".image-rw").each( function(i3) {
							
							$(this).attr( "id" , parent_id + "_img" + String(i3) );
						});
					});
					
					//////////////////////////////////////////////////////////////////
					
					// check for max answers and save them
					
					var answer_txt  = $(qaa_obj).find('.answer-map li:eq('+i1+')').text();
					var answer_num  = AIE.Qaa.MultiChoiceOpacity.MCO_check_max_answers_given( answer_txt );
					var correct_num = AIE.Qaa.MultiChoiceOpacity.MCO_answerkey_count( answer_txt );
					
					AIE.Qaa.MultiChoiceOpacity.answerCount[ $(this).attr('id') ] = (answer_num > 0) ? answer_num : correct_num;
					AIE.Qaa.MultiChoiceOpacity.maxAnswerCount[ $(qaa_obj).attr('id') ] += AIE.Qaa.MultiChoiceOpacity.answerCount[ $(this).attr('id') ];
					
					AIE.Qaa.MultiChoiceOpacity.correctCount[ $(this).attr('id') ] = correct_num;
					
				}
			);
			
			
			//Set answers attribute
			
			$(qaa_obj).attr('data-answer-mark', "0,0," + AIE.Qaa.MultiChoiceOpacity.maxAnswerCount[ $(qaa_obj).attr('id') ] );
			
			
			//Set exercise click events
			
			$(qaa_obj).find('.option-source ol li:not(.mco_inactive):not(.mco_passive) .image-rw').click(
				
				function() {
					
					// if exercise is locked
					
					if( $(qaa_obj).hasClass('lock-exercise') ) return false;
					
					// get LI images
					
					var optSrc = $(this).parents('.option-source');
					var li_items = $(optSrc).find('li:not(.mco_inactive):not(.mco_passive) .image-rw');
					
					// check if is eval
					
					var isEval = false;
					
					li_items.each( function() {
							
						if( ($(this).hasClass('correct')) || ($(this).hasClass('wrong')) ) isEval = true;
					});
					
					
					if( isEval == true && AIE.Qaa.MultiChoiceOpacity.reTry == false ) return false;
					if( AIE.Qaa.MultiChoiceOpacity.reTry == true && $(this).hasClass("correct") == true ) return false;
					
					// Check selection state.
					
					var isSlct = ( $(this).hasClass('selected-aie') );
					var maxAns = AIE.Qaa.MultiChoiceOpacity.answerCount[ $(optSrc).attr("id") ];
					
					/*
					Select new LI.
					If there is only 1 answer, remove all selections and select new 
					Else if multi answer, select max including "correct".
					*/
					
					if( maxAns == 1 ) {
						
						//unselect
						li_items.each( function() { $(this).removeClass('selected-aie'); } );
						
						//select if no ".correct" found
						if( $(optSrc).find(".image-rw.correct").length == 0 ) {
						
							if( isSlct == false ) $(this).addClass('selected-aie');
						}
					}
					else if( maxAns > 1 ) {
						
						if( $(this).hasClass("selected-aie") == false ) {
							
							//select max including ".correct"
							if( $(this).parents(".option-source").find(".image-rw.selected-aie,.image-rw.correct").length < maxAns ) $(this).addClass("selected-aie");
						}
						else $(this).removeClass('selected-aie');
					}
					
					
					// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
					// check if author wants auto-check the answer
					if( $(this).parents('.multi-choice-opacity-rw').hasClass("auto-check-rw") ) {
						
						$(this).parents('.multi-choice-opacity-rw').find('.buttons-rw > .check').trigger('click');
					}
				}
			);	
			
			
			
			//CHECK BUTTON
			$(qaa_obj).find(".buttons-rw > .check").click( function() {
				
				AIE.Qaa.MultiChoiceOpacity.reTry = false;
				
				AIE.Qaa.recordCheckAction( qaa_obj );
				AIE.Qaa.MultiChoiceOpacity.checkAnswers( qaa_obj );
				AIE.Qaa.UserResultStorage.saveUserResult();
			});	
			
			
			
			//TRY AGAIN
			$(qaa_obj).find(".buttons-rw > .try-again").click( function() {
				
				AIE.Qaa.MultiChoiceOpacity.reTry = true;
				
				AIE.Qaa.recordTryAgainAction( qaa_obj );
				AIE.Qaa.retryOptions( qaa_obj );
				AIE.Qaa.CheckScore.resetScore( qaa_obj );
				AIE.Qaa.UserResultStorage.saveUserResult();
			});	
			
		
			
			//RESET EVENT HANDLER <?>
			$(qaa_obj).find(".buttons-rw > .reset").click( function() {
				var target=$(this).parent().parent().attr("id");
				$('#'+target+' ol > li:not(.mco_inactive):not(.mco_passive) .image-rw').removeClass("wrong correct undefined");
				$parentobj = $(this).parents('.qaa-rw');
				AIE.Qaa.recordResetAction($parentobj);
				AIE.Qaa.MultiChoiceOpacity.clearAnswersMCO( $parentobj );
				AIE.Qaa.UserResultStorage.saveUserResult();
			});
			
			
			
		});
		
	}
}
