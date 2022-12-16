// Type In Choose custom template

//.s5 			= type in 
//.qaa-word-rw 	= choose

AIE.Qaa.TypeInChoose = {
	
	inSet : ( $(".qaa-set-rw").length > 0 ),
	
	selectLimit : {},
	correctCount : {},
	totals : {},
	
	type_in_next : {}, 				// used for per-letter mode.
	per_letter_text_before : {},	// used by per-letter key event to cancel not allowed characters <mobile>.
	
	
	// GENERATE IDS
	generateID : function( obj ) {

		obj = $(obj);
		var par_id = obj.attr('id');

		// OPTION SOURCE
		$(obj).find('.option-source').each( function(I1) {

			var rel_id_1 = par_id + "_os" + String(I1);
			$(this).attr('id', rel_id_1 );

			// OPTION SOURCE'S <LI>
			$(this).find('li').each( function(I2) {
				
				var rel_id_2 = rel_id_1 + "_li" + String(I2);
				$(this).attr('id',rel_id_2);

				// TYPE IN BOXES INSIDE <LI>
				$(this).find('span.s5').each( function(I3) {
					
					var rel_id_3 = rel_id_2 + "_sp" + String(I3);
					$(this).attr('id', rel_id_3);
				});
				
				// OPTION SOURCE INLINES INSIDE <LI>
				$(this).find('span.option-source-inline').each( function(I3) {
					
					var rel_id_3 = rel_id_2 + "_osi" + String(I3);
					$(this).attr('id', rel_id_3);
					
					// SELECTIONS INSIDE OPTION SOURCE INLINES
					$(this).find('span.qaa-word-rw').each( function(I4) {
						
						var rel_id_4 = rel_id_3 + "_sp" + String(I4);
						$(this).attr('id', rel_id_4);
					});
				});
			});
		});
	},
	
	// CHECK USER INPUT
	checkAnswers : function( qaa, incr_correct_count ) {
	
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
		
		var qaa_id = $(qaa).attr("id");
		var corrects = 0;
		var wrongs = 0;
		var totals = AIE.Qaa.TypeInChoose.totals[ $(qaa).attr("id") ];
		
		// check all text fields.
		
		$(qaa).find(".option-source li .s5").each( function(N) {
			
			// unselect
			$(this).removeClass("selected-aie");
			
			// get user's text
			var tx_inp = $(this).text().trim();
			
			// skip it if it is empty, if not empty disable it
			if( tx_inp == "" ) return;
			$(this).attr("contenteditable","false");
			
			// get answer key
			var tx_key = $(qaa).find(".answer-map-typein li:eq(" + String(N) + ")").text();
			
			// check if it has capitalize or lowercase.
			if(      $(this).parents(".per-letter-capitalize").length > 0 ) { tx_key = tx_key.toUpperCase(); tx_inp = tx_inp.toUpperCase(); }
			else if( $(this).parents(".per-letter-lowercase" ).length > 0 ) { tx_key = tx_key.toLowerCase(); tx_inp = tx_inp.toLowerCase(); }
			
			// split alternatives
			tx_key = tx_key.split("|");
			
			// trim spaces and check
			var i = 0;
			var ok = false;
			
			while( i < tx_key.length ) {
				
				if( tx_key[i].trim() == tx_inp ) {
					ok = true;
					break;
				}
				i += 1;
			}
			
			// add result classes
			if( ok == true ) {
				
				$(this).addClass("correct");
				corrects += 1;
			}
			else { 
			
				$(this).addClass("wrong");
				wrongs += 1;
			}
			
		});
		
		// check all choose items
		
		$(qaa).find(".option-source .option-source-inline").each( function(N) {
			
			// get key but remove the manual selection limit given with '='
			
			var tx_key = Express.CustomTools.ReplaceAll( $(qaa).find(".answer-map-choose li:eq(" + String(N) + ")").text() , " " , "" );
			tx_key = tx_key.split("=")[0];
			
			// get selection limit
			
			var l_l = AIE.Qaa.TypeInChoose.selectLimit[ $(this).attr("id") ];
			var l_c = 0;
			var l_w = 0;
			
			// check
			
			$(this).find(".qaa-word-rw").each( function(N2) {
				
				// already correct
				if( $(this).hasClass("correct") ) {
					
					l_c += 1;
					return;
				}
								
				// not clicked
				if( $(this).hasClass("selected-aie") == false ) return;
				
				// check
				if( tx_key[N2] == '1' ) {
					
					$(this).addClass("correct");
					l_c += 1;
				}
				else {
					
					$(this).addClass("wrong"); 
					l_w += 1;
				}
				
				$(this).removeClass("selected-aie");
				
			});
			
			// feedback refers to the whole choose part not each choose span so... eval == 0 means not attempted
			if( l_w == 0 ) {
				if( l_c == l_l ) corrects += 1;
			}
			else wrongs += 1;
			
		});
		
		// update the attribute 
				
		$(qaa).attr('data-answer-mark', corrects+','+wrongs+','+totals);
		
		// if not in set, show score
		
		if( AIE.Qaa.TypeInChoose.inSet == false ) {
			
			//calculate percentance
			
			var percent = 0;
			if( totals > 0 ) percent = Math.max( 0 , Math.round( (corrects / totals) * 100 ) - ( wrongs * 10 ) );
			
			// set results
			
			$(qaa).find('.correct-score .score').text(percent+'%');
			$(qaa).find('.correct-wrong-score .score').text(corrects+'/'+totals);
			$(qaa).find('.correct-count .score').text(corrects);
			$(qaa).find('.wrong-count .score').text(wrongs);
			
			// display results 
			
			$(qaa).find('.qaa-score-rw').show();
		}
		
		// update user selection map
		
		if( typeof(AIE.Qaa.userSelectionMap) != 'undefined' && AIE.Qaa.userSelectionMap.hasOwnProperty(qaa_id) ) {
		
			if( wrongs==0 && incr_correct_count ) AIE.Qaa.userSelectionMap[qaa_id]['correct-count'] += 1;
			AIE.Qaa.userSelectionMap[qaa_id]['userselection'] = AIE.Qaa.TypeInChoose.save(qaa);
		}
		
		return (wrongs == 0);
		
		
	}, // END OF CHECK ANSWERS
	
	// GET SELECTION LIMIT AUTOMATICALLY 
	answerkey_count: function( key_text ) {
		
		var i=0;
		var n=0;
		
		while( i < key_text.length ) {
			
			if( key_text[i] == '1' ) n += 1;
			i += 1;
		}
		
		return n;
	},
	
	// CHECK IF SELECTION LIMIT IS MANUALLY GIVEN WITH '='
	check_max_answers_given: function( key_text ) {
		
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
	
	// SHOW ANSWERS
	showAnswersTIC: function( parentobj ) {
	
		// write in all .s5
					
		$(parentobj).find(".option-source li .s5").each( function(N) {
					
			$(this).removeClass("correct wrong undefined");
			$(this).text( $(parentobj).find(".answer-map-typein li:eq("+String(N)+")").text().split("|")[0] );
			$(this).attr("contenteditable","false");
			$(this).addClass("selected-aie ans-show");
			
			
		});
		
		// select all choose items
		
		$(parentobj).find(".option-source .option-source-inline").each( function(N) {
		
			var l_max = AIE.Qaa.TypeInChoose.selectLimit[ $(this).attr("id") ];
			var l_cor = AIE.Qaa.TypeInChoose.correctCount[ $(this).attr("id") ];
			var l_key = Express.CustomTools.ReplaceAll( $(parentobj).find(".answer-map-choose li:eq("+String(N)+")").text() , " " , "" );
			var l_cnt = $(this).find(".qaa-word-rw");
			
			Express.CustomTools.ShowAnswers_SelectRandom( l_max, l_cor, l_key, l_cnt );
			
		});
		
	},
	
	// CLEAR ANSWERS
	clearAnswersTIC: function( parentobj ) {
		
		parentobj.find('.option-source .s5').text("").attr("contenteditable","true").removeClass("ans-show");
		parentobj.find('.option-source .selected-aie').removeClass('selected-aie');
		parentobj.find('.option-source .correct').removeClass('correct');
		parentobj.find('.option-source .wrong').removeClass('wrong');
		parentobj.find('.feedback-messages').hide();
		
		parentobj.find(".buttons-rw > .check").removeAttr("disabled");
		parentobj.find(".buttons-rw > .try-again").removeAttr("disabled");
		parentobj.find(".buttons-rw > .show-answers").attr("disabled","disabled");
		
		AIE.Qaa.CheckScore.resetScore(parentobj);
	},
	
	// SAVE ANSWERS
	save: function( parentobj ) {
		
		var userinput = {};
		
		$(parentobj).find(".option-source .s5").each( function() {
			
			var t = $(this).text().trim();
			if( t != "" ) userinput[ $(this).attr("id") ] = t;
		});
		
		$(parentobj).find(".option-source .qaa-word-rw").each( function() {
			
			userinput[ $(this).attr("id") ] = (   $(this).hasClass("selected-aie") || $(this).hasClass("correct") || $(this).hasClass("wrong")   );
		});
		
		return userinput;
	},
	
	// LOAD ANSWERS
	load: function( parentobj, userinput ) {
		
		var get;
		var hasinput = false;
		
		// set texts
		$(parentobj).find(".option-source .s5").each( function() {
			
			get = userinput[ $(this).attr("id") ];
			
			if( typeof(get) != 'undefined' ) {
				
				if( get != "" ) {
					
					$(this).html(get);
					hasinput = true;
				}
			}
		});
		
		// set choose
		$(parentobj).find(".option-source .qaa-word-rw").each( function() {
			
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
		
		if( !$(parentobj).hasClass("saveonly") && hasinput ) AIE.Qaa.TypeInChoose.checkAnswers( parentobj, false );
		
		return;
	},
	
	//INIT
	init: function() {
		
		var QAA_ALL = $(".qaa-rw.type-in-choose-rw");
		
		$(QAA_ALL).each( function() {
			
			
			var QAA = $(this);
			var PTR = AIE.Qaa.TypeInChoose;
			
			
			// CALCULATE EXERCISE TOTAL FEEDBACK AND SET THE EXERCISE ATTRIBUTE
			
			PTR.totals[ $(QAA).attr("id") ] = $(QAA).find(".option-source .s5 , .option-source .option-source-inline").length;
			
			$(QAA).attr( 'data-answer-mark', "0,0," +  PTR.totals[ $(QAA).attr("id") ] );
			
			
			
			// ----> INIT TYPE IN PART. <---- //
			// ENABLE TYPE IN FIELDS
			
			var temp = $(QAA).find(".option-source .s5");
			temp.attr("contenteditable","true");
			temp.focusin( function() { $(this).selectText(); } );
			
			// SAVE THEIR NEXT
			
			var i = 0;
			while( i < temp.length ) {
				
				if( i < temp.length-1 ) PTR.type_in_next[ temp[i].getAttribute("id") ] = temp[i+1].getAttribute("id");
				else PTR.type_in_next[ temp[i].getAttribute("id") ] = "";
				i += 1;
			}
			
			// PER LETTER ITEMS AND EVENTS
			
			var pers = $(QAA).find(".option-source .per-letter .s5");
			if( pers.length > 0 ) {
			
				// PER LETTER EVENT FOR MOBILE TOUCH KEYBOARD
				//   EVENT OBJECT DOES NOT READ KEYCODE,
				//   KEYUP IS USED TO FIND WHAT WAS PRESSED FROM INNERHTML.
				//   KEYDOWN IS USED TO RE-SET THE INNERHTML TO THE OLD VALUE IF A NON-ALLOWED CHARACTER IS FOUND IN KEYUP.
				
				if( Express.CustomTools.isMobile ) {
					
					pers.keydown( function(e) { AIE.Qaa.TypeInChoose.per_letter_text_before[ $(this).parents(".type-in-choose-rw").attr("id") ] = e.target.innerHTML; } );
					pers.keyup( function(e) {
			
						var temp = e.target.innerHTML;
						var charcode;
						
						if( temp.length > 0 ) charcode = temp.charCodeAt( temp.length-1 );
						else charcode = 0;
						
						if(   ( charcode >= 97 && charcode <= 122 ) || ( charcode >= 65 && charcode <= 90 ) || ( charcode >= 48 && charcode <= 57 )   ) {
							
							e.target.innerHTML = String.fromCharCode(charcode);
							
							var next = AIE.Qaa.TypeInChoose.type_in_next[ $(this).attr("id") ];
							
							if( next != "" ) {
								
								e.target.blur();
								$("#"+next).focus();
							}
						}
						else if( charcode == 0 ) { e.target.innerHTML = ""; }
						else { e.target.innerHTML = AIE.Qaa.TypeInChoose.per_letter_text_before[ $(this).parents(".type-in-choose-rw").attr("id") ]; }
						
					});
					
				}
				
				// PER LETTER EVENT FOR PC
				//   READS KEY CODES SO SIMPLY USE KEYDOWN ONLY.
				
				else {
					
					pers.keydown( function(e) {
			
						e.preventDefault();
						var next = AIE.Qaa.TypeInChoose.type_in_next[ $(this).attr("id") ];
						
						if( e.key != "Backspace" && e.key != "Tab" ) {
							
							var charcode;
							
							if( (e.key).length != 1 ) return;
							charcode = (e.key).charCodeAt(0);
							
							if(   ( charcode >= 97 && charcode <= 122 ) || ( charcode >= 65 && charcode <= 90 ) || ( charcode >= 48 && charcode <= 57 )   ) {
								
								e.target.innerHTML = String.fromCharCode(charcode);
								
								if( next != "" ) {  e.target.blur();	$("#"+next).focus(); }
							}
						}
						else if( e.key == "Tab" ) { if( next != "" ) { e.target.blur();  $("#"+next).focus(); } }
						else if( e.key == "Backspace" ) { e.target.innerHTML = ""; }
					});
				}
				
			}
			
			
			
			
			// ----> INIT CHOOSE PART. <---- //
			// READ OPTION SOURCE INLINES AND CREATE INNER SPANS
			
			$(QAA).find(".option-source .option-source-inline").each( function(N) {
				
				// get max selections for this choose part
				
				l_text = $(QAA).find(".answer-map-choose li:eq(" + String(N) + ")").text();
				l_auto = AIE.Qaa.TypeInChoose.answerkey_count(l_text);
				l_manual = AIE.Qaa.TypeInChoose.check_max_answers_given(l_text);
				
				AIE.Qaa.TypeInChoose.selectLimit[ $(this).attr('id') ] = (l_manual > 0) ? l_manual : l_auto;
				AIE.Qaa.TypeInChoose.correctCount[ $(this).attr('id') ] = l_auto;
				
				// get parent id
				
				var id = $(this).attr("id");
				
				// get all inner words
				
				var spans = $(this).text().trim().split(" ");
				
				// gather inner spans
				
				var i=0; 
				var l_html = "";
				var l_id;
				
				while( i < spans.length ) {
					
					l_id = id + "_sp" + String(N);
					l_html += '<span id="' + l_id + '" class="qaa-word-rw">' + spans[i].trim() + '</span>';
					
					i += 1;
				}
				
				// create inner spans
				
				$(this).html(l_html);
				
			});
			
			
			// SET EVENTS TO CREATED INNER SPANS FOR CHOOSE PART
			
			$(QAA).find(".option-source .option-source-inline").each( function() {
				
				var DIV = $(this);
				
				$(DIV).find(".qaa-word-rw").click( function() {
					
					// if locked
					
					if( $(QAA).hasClass("lock-exercise") ) return;
				
					var limit = AIE.Qaa.TypeInChoose.selectLimit[ $(DIV).attr('id') ];
					var evals = $(DIV).find(".correct, .wrong").length;
				
					// mode 1 : if only one selection
					
					if( limit == 1 ) {
						
						// if it's evaluated
						if( evals > 0 ) return;
						
						// if trying to unselect
						var unselect = $(this).hasClass("selected-aie");
						
						// diselect all choose items
						$(DIV).find(".selected-aie").removeClass("selected-aie");
						
						// select new
						if( unselect == false ) $(this).addClass("selected-aie");
					}
					
					// mode 2 : multiple selections possible
					
					else {
						
						// if trying to unselect.
						if( $(this).hasClass("selected-aie") ) $(this).removeClass("selected-aie");
						
						// if trying to select new
						else if( $(DIV).find(".selected-aie").length < (limit-evals) ) $(this).addClass("selected-aie");
					}
					
				});
			
			});
			
			
			//CHECK BUTTON
			
			$(QAA).find(".buttons-rw > .check").click( function() {
				
				var thisqaa = $(this).parents(".type-in-choose-rw");
				
				AIE.Qaa.TypeInChoose.checkAnswers( thisqaa );
				
				AIE.Qaa.recordCheckAction( thisqaa );
				AIE.Qaa.UserResultStorage.saveUserResult();
				
				thisqaa.find(".buttons-rw > .show-answers").removeAttr("disabled");
				
			});	
			
			
			//TRY AGAIN BUTTON
			
			$(QAA).find(".buttons-rw > .try-again").click( function() {
				
				var thisqaa = $(this).parents(".type-in-choose-rw");
				
				thisqaa.find('.feedback-messages').hide();
				
				AIE.Qaa.recordTryAgainAction( thisqaa );
				AIE.Qaa.CheckScore.resetScore( thisqaa );
				AIE.Qaa.UserResultStorage.saveUserResult();
				
				thisqaa.find(".option-source .s5.wrong").text("").removeClass("wrong").attr("contenteditable","true");
				thisqaa.find(".option-source .qaa-word-rw.wrong").removeClass("wrong");
				
			});
			
			
			//RESET BUTTON
			
			$(QAA).find(".buttons-rw > .reset").click( function() {
				
				var thisqaa = $(this).parents(".type-in-choose-rw");
				
				AIE.Qaa.TypeInChoose.clearAnswersTIC( thisqaa );
				AIE.Qaa.recordResetAction( thisqaa );
				AIE.Qaa.UserResultStorage.saveUserResult();
			});
			
			
			// IDS ( this must go after the 'init choose' part in which qaa-word-rw spans are created )
			
			PTR.generateID( QAA );
			
		}); // END OF EACH .QAA-RW.TYPE-IN-CHOOSE FOUND
		

	} // END OF INIT


}
