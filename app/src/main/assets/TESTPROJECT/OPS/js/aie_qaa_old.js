// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine

/*
aie_qaa.js - AIE module for Question and answers
*/

var AIE = AIE || {};

AIE.Qaa = {
	evalMap: {},
	feedbackOptions: {},
	dadMap: {},
	userSelectionMap: {},
	qaaSetLoader: {qaaset:false, qaacount:0, qaaloaded:0},
	init: function() {
		this.generateID();
		AIE.Qaa.Decryption.init();
		this.createEvaluationLookup();
		this.createFeedbackLookup();
		AIE.Qaa.TrueFalse.init();
		AIE.Qaa.MultiTrueFalse.init();
		AIE.Qaa.MultiTrueFalseInline.init();
		AIE.Qaa.MultiChoice.init();
		AIE.Qaa.MultiResponse.init();
		AIE.Qaa.TextMatch.init();
		AIE.Qaa.MultiTextMatch.init();
		AIE.Qaa.TextMatch_tap.init();
		//AIE.Qaa.Association.init();
		//AIE.Qaa.Association_tap.init();
		AIE.Qaa.Sequence.init();
		AIE.Qaa.Sequence_tap.init();
		AIE.Qaa.Grouping.init();
		AIE.Qaa.SortWords.init();
		AIE.Qaa.QASet.init();
		AIE.Qaa.CustomFeature.init();
		AIE.Qaa.UserResultStorage.init();
		AIE.Qaa.UserEventNotifications.notificationsEvents();
		AIE.Qaa.Decryption.encrypt();
	},

	generateID: function(object) {
		//Generate ID for each qaa
		//ID pattern qaa{n}
		
		// generate id for particular qaa object item when required
		// this is called by a individual qaa object
		if(object) {
			$('#'+object).find('.option-source li').each(function(lii){
				//ID pattern for LI qaa{n}_os{n}_li{n}
				var osid = $(this).parents('.option-source').attr('id');
				var liid = osid + "_" + "li" + lii;

				$(this).find('span[contenteditable]').each(function(sii){
					//ID pattern for LI qaa{n}_os{n}_li{n}
					var siid = liid + "_sp" + sii;
					$(this).attr('id', siid);
				});
				
				$(this).find('.inputcontent').each(function(sii){
					//ID pattern for LI qaa{n}_os{n}_li{n}
					var siid = liid + "_in" + sii;
					$(this).attr('id', siid);
				});
				
				$(this).find('span:not(.style1-rw, .style2-rw, .style3-rw, .style4-rw, .style5-rw, .style6-rw, .style7-rw, .style8-rw, .style9-rw, .style10-rw, .mark-word)').each(function(sii){
					//ID pattern for LI qaa{n}_os{n}_li{n}
					var txtmatch = $(this).parents('.qaa-rw').hasClass('multi-textmatch-rw');
					if(!txtmatch) {
						var siid = liid + "_sp" + sii;
						var currid = $(this).attr('id');
						if (typeof currid == 'undefined') {
							$(this).attr('id', siid);
						}
					}
				});
			});
			$('#'+object).find('.option-source-inline').find('span.qaa-word-rw').each(function(sii){
				//ID pattern for LI qaa{n}_os{n}_li{n}
				var liid = $(this).parents('.option-source-inline').attr('id');
				var siid = liid + "_sp" + sii;
				var currid = $(this).attr('id');
				if (typeof currid == 'undefined') {
					$(this).attr('id', siid);
				}
			});
			
		} else {
			$('.qaa-rw').each(function(index) {
				var qaaid = 'qaa'+index;
				//Dont lose the original id as it could be used for CSS mapping
				var origid = $(this).attr('id');
				if (origid){ 
					$(this).attr('id', origid);
					qaaid = origid + "___" + qaaid;
				} else {
					qaaid = qaaid + "___" + qaaid;
					$(this).attr('id', qaaid);
				}
				
				//Generate ID for each option source inside the qaa
				//ID pattern for ol option source - qaa{n}_os{n}
				$(this).find('.option-source, .option-source-inline').each(function(osi){
					var osid = qaaid + "_" + "os" + osi;
					$(this).attr('id', osid);
					$(this).find('li').each(function(lii){
						//ID pattern for LI qaa{n}_os{n}_li{n}
						var liid = osid + "_" + "li" + lii;
						$(this).attr('id', liid);
						$(this).find('span[contenteditable]').each(function(sii){
							//ID pattern for LI qaa{n}_os{n}_li{n}
							var siid = liid + "_sp" + sii;
							$(this).attr('id', siid);
						});
						
						$(this).find('.inputcontent').each(function(sii){
							//ID pattern for LI qaa{n}_os{n}_li{n}
							var siid = liid + "_in" + sii;
							$(this).attr('id', siid);
						});
						$(this).find('span:not([style], .aie-hn, .style1-rw, .style2-rw, .style3-rw, .style4-rw, .style5-rw, .style6-rw, .style7-rw, .style8-rw, .style9-rw, .style10-rw, .mark-word)').each(function(sii){
							//ID pattern for LI qaa{n}_os{n}_li{n}
							var txtmatch = $(this).parents('.qaa-rw').hasClass('multi-textmatch-rw');
							if(!txtmatch) {
								var siid = liid + "_sp" + sii;
								var currid = $(this).attr('id');
								if (typeof currid == 'undefined') {
									$(this).attr('id', siid);
								}
							}
						});
						$(this).find('span.qaa-word-rw').each(function(sii){
							//ID pattern for LI qaa{n}_os{n}_li{n}
							var siid = liid + "_sp" + sii;
							var currid = $(this).attr('id');
							
							if (typeof currid == 'undefined') {
								$(this).attr('id', siid);
							}
						});
					});
					// multi truefalse inline
					$(this).find('span.qaa-word-rw').each(function(sii){ 
						//ID pattern for LI qaa{n}_os{n}_li{n}
						var liid = $(this).parents('.option-source-inline').attr('id');
						var siid = liid + "_sp" + sii;
						var currid = $(this).attr('id');
						if (typeof currid == 'undefined') {
							$(this).attr('id', siid);
						}
					});
				});
				//Generate ID for options target
				$(this).find('.option-target').each(function(oti){
					var osid = qaaid + "_" + "ot" + oti;
					$(this).attr('id', osid);
					$(this).find('li').each(function(olii){
						//ID pattern for LI qaa{n}_os{n}_li{n}
						var liid = osid + "_" + "li" + olii;
						$(this).attr('id', liid);
					});
				});
				
				//Generate ID for each Question control answer map inside the qaa
				//ID pattern for ol option source - qaa{n}_am{n}
				$(this).find('.answer-map').each(function(osi){
					var osid = qaaid + "_" + "am" + osi;
					$(this).attr('id', osid);
					$(this).find('li').each(function(lii){
						//ID pattern for LI qaa{n}_am{n}_li{n}
						var liid = osid + "_" + "li" + lii;
						$(this).attr('id', liid);
					});
				});
			});
		}
	},
	
	/*
		Create a lookup structure to map option source to its target value
	*/
	createEvaluationLookup: function() {
		//Create a lookup structure for li
		$('.qaa-rw').find('.option-source > li').each( function() {
			var optid = $(this).attr('id');
			var targetid = "#" + optid.replace("_os", "_am");
			AIE.Qaa.evalMap[optid] = "";
			if($(targetid).text() || $(targetid).val()) {
				AIE.Qaa.evalMap[optid] = $(targetid).text() || $(targetid).val();
			}
		});
		
		//Now iterate throught all option source
		//AIE.Qaa.evalMap[qaa0_os0_li2_sp0] = actual answer goes here
		$('.qaa-rw').find(".option-source").each(function(){
			//Iterate each span inside the option source
			$(this).find('span[contenteditable]').each( function(counter) {
				var optid = $(this).attr('id');
				var li_id = $(this).parent('li').attr('id');
				
				var opt_index_index = optid.indexOf("___");
				var prefix = optid.substring(0, opt_index_index+3);
				var suffix = optid.substring(opt_index_index+3);
				
				//Span id structure is: qaa0_os0_li1_sp0
				//We are trying to get the index from the span 
				var opt_index_l = optid.split("_");
				
				//Get the last item from the list
				var opt_index_s = opt_index_l[opt_index_l.length-1];
				//Remove sp to get just the number 
				opt_index_s = opt_index_s.replace("sp", "");
				//Convert the string into a number
				var opt_index_index = counter + 1;
				//create the id for the equivalent answermap for this option source
				//Split the suffix after ___ to get the first two parts of the id
				var t = suffix.split("_");
				var temp = prefix + t[0] + "_" + t[1] ;
				var am_id = temp.replace("_os", "_am");
				
				//Now create a filter to get the target answer based on nth-child selector
				var targetfilter =  "#" + am_id + " > li:nth-child(" + opt_index_index + ")";
				var answer = $(targetfilter).text() ||  $(targetfilter).val();
				
				AIE.Qaa.evalMap[optid] = "";
				if(answer) {
					AIE.Qaa.evalMap[optid] = answer;
				}
				//alert(answer);
			});
			
			$(this).find('.inputcontent').each( function(counter) {
				var optid = $(this).attr('id');
				var li_id = $(this).parent('li').attr('id');
				
				var opt_index_index = optid.indexOf("___");
				var prefix = optid.substring(0, opt_index_index+3);
				var suffix = optid.substring(opt_index_index+3);
				
				//Span id structure is: qaa0_os0_li1_sp0
				//We are trying to get the index from the span 
				var opt_index_l = optid.split("_");
				
				//Get the last item from the list
				var opt_index_s = opt_index_l[opt_index_l.length-1];
				//Remove sp to get just the number 
				opt_index_s = opt_index_s.replace("sp", "");
				//Convert the string into a number
				var opt_index_index = counter + 1;
				//create the id for the equivalent answermap for this option source
				//Split the suffix after ___ to get the first two parts of the id
				var t = suffix.split("_");
				var temp = prefix + t[0] + "_" + t[1] ;
				var am_id = temp.replace("_os", "_am");
				
				//Now create a filter to get the target answer based on nth-child selector
				var targetfilter =  "#" + am_id + " > li:nth-child(" + opt_index_index + ")";
				var answer = $(targetfilter).text() ||  $(targetfilter).val();
				
				AIE.Qaa.evalMap[optid] = "";
				if(answer) {
					AIE.Qaa.evalMap[optid] = answer;
				}
			});
		});
	},
	
	/* */
	createFeedbackLookup: function() {
		//Generate ID for each qaa
		//ID pattern qaa{n}
		$('.qaa-rw').each(function(index) {
			var qaaid = $(this).attr('id');
			//Load the feedback messages class and message for this qaa div
			AIE.Qaa.feedbackOptions[qaaid] = {};
			var qacl = $(this).attr('class');
			qacl = qacl.replace("qaa-rw", "");
			qacl = jQuery.trim(qacl);
		
			AIE.Qaa.feedbackOptions[qaaid]["qaatype"] = qacl;
			AIE.Qaa.feedbackOptions[qaaid]["evaluation"] = $(this).find(".evaluation").text();
			AIE.Qaa.feedbackOptions[qaaid]["feedback"] = $(this).find(".feedback").text();
			AIE.Qaa.feedbackOptions[qaaid]["results"] = $(this).find(".results").text();
			$(this).find('.feedback-messages').children().each(function(){
				var cl = $(this).attr('class');
				AIE.Qaa.Association_tapl = cl.replace("fbm", "");
				cl = jQuery.trim(cl);
				
				switch (cl) {
					case "correct":
						AIE.Qaa.feedbackOptions[qaaid]["correct"] = $(this).text();
						break;
					case "wrong":
						AIE.Qaa.feedbackOptions[qaaid]["wrong"] = $(this).text();
						break;
					case "reinforcement":
						AIE.Qaa.feedbackOptions[qaaid]["reinforcement"] = $(this).html();
						break;
				}
			});
		});
	},
	
	showFeedback: function($parentobj, state) {
		var rl = 'reinforcement';
		//Create the dynamic eventname
		var eventname = $parentobj.attr("id") + "-";
		if (state == true) {
			//user has got it right
			//Show the correct message
			var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
			$parentobj.find(" > .feedback-messages > ." + cl).show();
			$parentobj.find(" > .feedback-messages > .wrong").hide();
			//custom class for checking answers in a set without mark-by-items
			//fixing moving content in tap-tap exerices (like scrabbled sentences)
			//bypassing something.show() or something.hide() with display:none in CSS
			$parentobj.find(" > .feedback-messages > .correct").addClass("alt_feed");
			$parentobj.find(" > .feedback-messages > .wrong").removeClass("alt_feed");
			//Hide the reinforcement if it is displayed
			$parentobj.find(" > .feedback-messages > ." + rl).hide();
			$parentobj.find(" > .feedback-messages").show();
			eventname = eventname + "correct";
			// hide show feedback message when user has checked the answer
			$parentobj.find(".show-answer-feedback").show();

		} else {
			//user has got it wrong
			//hide the correct message
			var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
			$parentobj.find(" > .feedback-messages > ." + cl).hide();
			$parentobj.find(" > .feedback-messages > .wrong").show();
			//custom class for checking answers in a set without mark-by-items
			//fixing moving content in tap-tap exerices (like scrabbled sentences)
			//bypassing something.show() or something.hide() with display:none in CSS
			$parentobj.find(" > .feedback-messages > .wrong").addClass("alt_feed");
			$parentobj.find(" > .feedback-messages > .correct").removeClass("alt_feed");
			//show the reinforcement if it is displayed
			$parentobj.find(" > .feedback-messages > ." + rl).show();
			$parentobj.find("> .feedback-messages").show();
			eventname = eventname + "wrong";
			// hide show feedback message when user has checked the answer
			$parentobj.find(".show-answer-feedback").hide();
		}
		//Publish the dynamic event
		$.publish(eventname, []);
	},
	
	evaluate: function(qaaobj, selobj) {
		var qaaid = qaaobj.attr('id');
		var fb = AIE.Qaa.feedbackOptions[qaaid]["feedback"];
		if(fb){
			//Handle the different types of feedback here
			switch (fb) {
				
				default:
					//Default is no feedback on a user event
					break;
			}
		}
	},
	
	getAnswer: function(elid) {
		var ans = AIE.Qaa.evalMap[elid];
		ans = jQuery.trim(ans);
		return ans;
	},
	
	getWrongFeedbackClass: function(qaaid) {
		return "wrong";
	},
	
	getCorrectFeedbackClass: function(qaaid) {
		return "correct";
	},
	
	resetOptions: function($parentobj) {
		$parentobj.find('.option-source >li, .option-source-inline span.qaa-word-rw').each(function(){
			$(this).removeClass('wrong');
			$(this).removeClass('correct');
			$(this).removeClass('selected-aie');
		});
		
		var qaaid = $parentobj.attr("id");
		
		//Set the userselection to empty
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
		}
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
	},
	
	retryOptions: function($parentobj) {
		var  id = $parentobj.attr("id");
		
		//Set the userselection to empty
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(id) == true)) {
			var userselection = AIE.Qaa.userSelectionMap[id]["userselection"];
		}
		$("#"+id+" ol, #"+id+" .option-source-inline").find('.wrong').each(function() {
			$(this).removeClass('wrong');
			if (userselection) {
				userselection[$(this).attr("id")] = false;
			}
		});
		
		//Set the userselection to empty
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(id) == true)) {
			if (userselection) {
				AIE.Qaa.userSelectionMap[id]["userselection"] = userselection;
			}
		}
		
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
	},
	
	recordCheckAction: function($parentobj) {
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 0, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0};
		}
		AIE.Qaa.userSelectionMap[qaaid]["attempts"] = AIE.Qaa.userSelectionMap[qaaid]["attempts"] + 1;
	},
	
	recordTryAgainAction: function($parentobj) {
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 0, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0};
		}
		AIE.Qaa.userSelectionMap[qaaid]["try-again-count"] = AIE.Qaa.userSelectionMap[qaaid]["try-again-count"] + 1;
	},
	
	recordResetAction: function($parentobj) {
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 0, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0};
		}
		AIE.Qaa.userSelectionMap[qaaid]["reset-count"] = AIE.Qaa.userSelectionMap[qaaid]["reset-count"] + 1;
	},
	
	checkAnswers: function($parentobj, incr_correct_count){
		//Make sure that incr correct count is set to true if calling function
		//does not pass an arg. 
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
		
		//we declare the variable here to check if any one of the answers
		//is wrong. If that happens, we need to show wrong message
		var eval_status = false;
		var once = true;
		var user_options = {};
		$parentobj.find('.option-source >li').each(function() {
			if (once) {
				//set the eval_status to true for first time
				eval_status = true;
				once = false;
			}
			var src_id = $(this).attr("id");
			var answer = AIE.Qaa.getAnswer($(this).attr("id"));
			user_options[src_id] = false; 
			if ($(this).hasClass('selected-aie') == false) {
				//We need to make sure that we show a reenforcement
				//if user does not attempt something, But the answer is true
				//This happens when a check is done after doing a try again
				if ((answer == "1") && ($(this).hasClass('correct') == false)) {
					eval_status = false;
				} else if ((answer == "1") && ($(this).hasClass('correct') == true)) {
					user_options[src_id] = true;
				} else if ($(this).hasClass('wrong') == true) {
					eval_status = false;
					user_options[src_id] = true;
				}
			} else {
				//User has selected this as the correct option
				user_options[src_id] = true;
				switch (answer) {
					case "0":
						var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
						$(this).addClass(cl).removeClass('selected-aie');
						eval_status = false;
						break;
					case "1":
						var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
						$(this).addClass(cl).removeClass('selected-aie');
						break;
					default:
						var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
						eval_status = false;
						$(this).addClass(cl).removeClass('selected-aie');
				}
			}
		});
		
		var qaaid = $parentobj.attr("id");
		
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = user_options;
			if (eval_status && incr_correct_count) {
				AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
			}
		}
		//alert(eval_status);
		AIE.Qaa.showFeedback($parentobj, eval_status);
		//AIE.Qaa.CheckScore.setScore($parentobj, eval_status); // commented on 2706025
		//call score function
		AIE.Qaa.CheckScore.setScore($parentobj);
		return eval_status;
	},
	
	checkTFIAnswers: function($parentobj, incr_correct_count){
		//Make sure that incr correct count is set to true if calling function
		//does not pass an arg. 
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
		//we declare the variable here to check if any one of the answers
		//is wrong. If that happens, we need to show wrong message
		var eval_status = false;
		var once = true;
		var user_options = {};
		$parentobj.find('.option-source-inline').each(function(ind) {
			if (once) {
				//set the eval_status to true for first time
				eval_status = true;
				once = false;
			}
			$(this).find('span.qaa-word-rw').each(function(k){
				var src_id = $(this).attr("id");
				//var answer = AIE.Qaa.getAnswer($(this).attr("id"));
				user_options[src_id] = false; 
				var m_ans = [];
				var ans_target_id = $.trim($(this).parents('.qaa-rw').find('.answer-map li:eq('+ind+')').text());
				if(ans_target_id[0] == '[') {
					var ma = ans_target_id.split(',');
					for (var i=0; i<ma.length; i++){
						var op = ma[i];
						op = $.trim(op);
						op = op.replace('[', '');
						op = op.replace(']', '');
						if((op != '[') && (op != ']')) {
							m_ans.push(op);
						}
					}
				}
				if ($(this).hasClass('selected-aie') == false) {
					//We need to make sure that we show a reenforcement
					//if user does not attempt something, But the answer is true
					//This happens when a check is done after doing a try again
					if(m_ans.length>0) {
						var y = AIE.Qaa.TFInlineMultiAnswer(m_ans, (k+1));
						if (($(this).index()+1 == y) && ($(this).hasClass('correct') == false)) {
							eval_status = false;
						} else if (($(this).index()+1 == y) && ($(this).hasClass('correct') == true)) {
							user_options[src_id] = true;
						} else if ($(this).hasClass('wrong') == true) {
							eval_status = false;
							user_options[src_id] = true;
						}
					} else {
						if (($(this).index()+1 == ans_target_id) && ($(this).hasClass('correct') == false)) {
							eval_status = false;
						} else if (($(this).index()+1 == ans_target_id) && ($(this).hasClass('correct') == true)) {
							user_options[src_id] = true;
						} else if ($(this).hasClass('wrong') == true) {
							eval_status = false;
							user_options[src_id] = true;
						} 
					}
				} else {
					//User has selected this as the correct option
					user_options[src_id] = true;
					if(m_ans.length>0) {
						var x = AIE.Qaa.TFInlineMultiAnswer(m_ans, (k+1));
						if((k+1) == x) {
							var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
							$(this).addClass(cl).removeClass('selected-aie');
						} else {
							var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
							$(this).addClass(cl).removeClass('selected-aie');
							eval_status = false;
						}
					} else {
						if($(this).index()+1 == ans_target_id) {
							var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
							$(this).addClass(cl).removeClass('selected-aie');
						} else {
							var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
							$(this).addClass(cl).removeClass('selected-aie');
							eval_status = false;
						}
					}
				}
			});
		});
		
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = user_options;
			if (eval_status && incr_correct_count) {
				AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
			}
		}
		AIE.Qaa.showFeedback($parentobj, eval_status);
		// call score function
		AIE.Qaa.CheckScore.setScore($parentobj);
		return eval_status;
	},
	TFInlineMultiAnswer:function(ar, n) {
		var ind = 0;
		for (var i=0; i<ar.length; i++){
			if(ar[i] == n) {
				ind = ar[i];
			}
		}
		return ind;
	},
	checkTextMatchAnswers: function($parentobj, incr_correct_count){
		
		/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		/*~~~~~~~~~~~~~~~~~		CROSSWORD CHECK SCORE		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		//remove background-color of cross_active_sel
		if($parentobj.find(".crossword").length > 0) {
			$parentobj.find(".cross_active_sel").removeClass("cross_active_sel");
		}
		/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		/*~~~~~~~~~~~~~~~~~		CROSSWORD CHECK SCORE		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		
		//Make sure that incr correct count is set to true if calling function
		//does not pass an arg. 
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
		
		var eval_status = false;
		var once = true;
		var parentid = $parentobj.attr('id');
		var useroptions = {};
		var span = true;
		if($("#" + parentid + " input").hasClass('inputcontent')){
			var filter = "#" + parentid + ' .inputcontent';
			span = false;
		} else{
			span = true;
			var filter = "#" + parentid + ' span[contenteditable]' ;
		}
		$(filter).each(function() {
			if (once) {
				//set the eval_status to true for first time
				eval_status = true;
				once = false;
			}
			var user_answer = $(this).text() 
			if(!span) {
				user_answer = $(this).val();
			}
			user_answer = jQuery.trim(user_answer);
			// IE sometime has problem with space, when user enters 2 spaces, it treats as non-breaking space #160 
			// so it has problem evaluating with normal space in answer
			user_answer = user_answer.replace(/\s/g, " ");
			useroptions[$(this).attr("id")] = user_answer;
			var sys_answer = AIE.Qaa.getAnswer($(this).attr("id"));
			$(this).removeClass('selected-aie');
			$(this).removeClass('wrong');
			$(this).removeClass('correct');
			var correct_answer = false;
			//Handle the multi answers here
			var multi = [];
			//multiple options are specified as quotes wrapped comma separated
			if (sys_answer[0] == "\"") {
				var tmulti = sys_answer.split('"');
				for (var k=0; k<tmulti.length; k++){
					var option = tmulti[k];
					option = jQuery.trim(option);
					if (option && (option!=",") && (option!="\"") ) multi.push(tmulti[k]);
				}
			} else if (sys_answer[0] == "'"){
				var tmulti = sys_answer.split("'");
				for (var k=0; k<tmulti.length; k++){
					var option = tmulti[k];
					option = jQuery.trim(option);
					if (option && (option!=",") && (option!="'") ) multi.push(tmulti[k]);
				}
			} else if (sys_answer[0] == "|"){
				var tmulti = sys_answer.split("|");
				for (var k=0; k<tmulti.length; k++){
					var option = tmulti[k];
					option = jQuery.trim(option);
					if (option && (option!=",") && (option!="|") ) multi.push(tmulti[k]);
				}
			} else {
				//multiple options are specified as comma separated
				multi = sys_answer.split(',');
			}
			if (multi.length > 1) {
				for (var k=0; k<multi.length; k++){
					var option = multi[k];
					option = jQuery.trim(option);
					option = option.replace('$comma$', ',');
					if (user_answer == option){
						correct_answer = true;
						break
					}
				}
			} else {
				if (multi.length == 1) sys_answer =  multi[0];
				sys_answer = sys_answer.replace('$comma$', ',');
				
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				/*~~~~~~~~~~~~~~~~~		CROSSWORD CHECK SCORE		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				//Crossword check for lowercase and uppercase letters - fix to avoid adding both uppercase and lowercase values in answermap!
				if($(this).parents(".cross_uppercase").length > 0 || $(this).parents(".crossword_uppercase").length > 0 || $(this).parents(".per_letter_capitalize").length > 0 || $(this).parents(".per-letter-capitalize").length > 0) {
					user_answer = user_answer.toUpperCase();
					sys_answer = sys_answer.toUpperCase();
				}
				if($(this).parents(".cross_lowercase").length > 0 || $(this).parents(".crossword_lowercase").length > 0 || $(this).parents(".per_letter_lowercase").length > 0 || $(this).parents(".per-letter-lowercase").length > 0) {
					user_answer = user_answer.toLowerCase();
					sys_answer = sys_answer.toLowerCase();
				}
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				/*~~~~~~~~~~~~~~~~~		CROSSWORD CHECK SCORE		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				
				//Single answer option
				if (user_answer == sys_answer){
					correct_answer = true;
				}
			}
			if (correct_answer) {
				var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
				$(this).addClass(cl);
				if($(this).parent('.mark-word').find('.wrong').length>0) {
					$(this).parent('.mark-word').addClass('word-wrong').removeClass('word-correct');
				} else if($(this).parent('.mark-word').find('[contenteditable]').length == $(this).parent('.mark-word').find('.correct').length){
					$(this).parent('.mark-word').addClass('word-correct').removeClass('word-wrong');
				} else {
					$(this).parent('.mark-word').addClass('word-wrong').removeClass('word-correct');
				}
			} else {
				if (($(this).get(0).innerHTML == "&nbsp;") ||  (user_answer == "")){
					//Dont set a error class if user has not attemped the option
					eval_status = false;
				} else {
					var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
					eval_status = false;
					$(this).addClass(cl);
					$(this).parent('.mark-word').addClass('word-wrong').removeClass('word-correct');
				}
			}
			if($(this).hasClass('correct') || $(this).hasClass('wrong')) {
				// disable droppable when the answers are checked
				$(this).droppable({
					disabled: true,
				});
			}
			// disable editing when user checks the anser
			var editable = $(this).attr('contenteditable');
			if(editable == 'true') {
				if($(this).hasClass('correct') || $(this).hasClass('wrong')) {
					$(this).attr('contenteditable', 'false').addClass('tedit');
				}
			} else if($(this).hasClass('tedit') == false){
				$(this).addClass('ttonly'); // tap tap only
			}
		});
		
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
			if (eval_status && incr_correct_count) {
				AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
			}
		}
		AIE.Qaa.showFeedback($parentobj, eval_status);
		// call score function
		AIE.Qaa.CheckScore.setScore($parentobj);
		return eval_status;
	},
	
	resetTextMatch: function($parentobj){
		var parentid = $parentobj.attr('id');
	 
		if($("#" + parentid + " input").hasClass('inputcontent')){
			var filter = "#" + parentid + ' .inputcontent';
		}
		 else{
				var filter = "#" + parentid + ' span[contenteditable]' ;
		}
		
		//var filter = "#" + parentid + ' span[contenteditable]' || "#" + parentid + ' .inputcontent';
		$(filter).each(function() {
			$(this).removeClass('wrong');
			$(this).removeClass('correct');
			$(this).removeClass('selected-aie aie-dropped ans-show');
			$(this).parents('.mark-word').removeClass('word-wrong');
			$(this).parents('.mark-word').removeClass('word-correct');
			if($(this).hasClass('inputcontent')) {
				$(this).val(" ");	
			} else {
				$(this).text(" ");	
			}	
			var index = $(this).attr('class').replace(/\D/g,'') -1 ;
			//$($parentobj.children('.textmatch-answermap').find('li:eq('+index +')').show()).css({left:'0px',top:'0px'}).removeClass('selected-aie');
			$($parentobj.children('.textmatch-answermap').find('li').show()).css({left:'0px',top:'0px'}).removeClass('selected-aie');
			// enable droppable on reset
			$(this).droppable({
				disabled: false,
			});
			// enable editing editable fields 
			if($(this).hasClass('ttonly') == false) {
				$(this).attr('contenteditable', 'true');
			}
		});
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
		}
		
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
	},
	
	retryTextMatch: function($parentobj){ 
		var parentid = $parentobj.attr('id');
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		var useroptions = {}
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			useroptions = AIE.Qaa.userSelectionMap[qaaid]["userselection"];
		}
		
		//var filter = "#" + parentid + ' span[contenteditable]' || "#" + parentid + ' .inputcontent';
		if($("#" + parentid + " input").hasClass('inputcontent')){
			var filter = "#" + parentid + ' .inputcontent';
		}
		else {
			var filter = "#" + parentid + ' span[contenteditable]' ;
		}
	 
		$(filter).each(function() {
			if ($(this).hasClass('wrong')) {
				var index = $(this).attr('class').replace(/\D/g,'') -1 ;
				//$($parentobj.children('.textmatch-answermap').find('li:eq('+index +')').show()).css({left:'0px',top:'0px'});
				var re = new RegExp('\\$|\\(|\\)|\\?|\\^|\\*|\\+|\\[|\\]',"g");
				var txt = $.trim($(this).text());
				txt = txt.replace(re, "");
				var reset = true;
				$(this).parents('.qaa-rw:not(.qaa-set-rw)').find('.textmatch-answermap li').each(function(){
					var op_txt = $(this).text();
					op_txt = op_txt.replace(re, "");
					var compare = txt.match(op_txt);
					if(txt == op_txt && reset) {
						if($(this).is(':visible') == false) {
							$(this).css({'top':'0px','left':'0px'}).show();
							reset = false;
						}
					}
				});
				$(this).removeClass('wrong');
				$(this).removeClass('correct');
				$(this).removeClass('selected-aie aie-dropped');
				if($(this).hasClass('inputcontent')) {
					$(this).val(" ");	
				} else {
					$(this).text(" ");	
				}
				if (useroptions && (useroptions.hasOwnProperty($(this).attr("id")) == true)) {
					useroptions[$(this).attr("id")] = "";
				}
				// enable droppable on try again for wrong elements
				$(this).droppable({
					disabled: false,
				});
				// enable editing editable fields 
				if($(this).hasClass('ttonly') == false) {
					$(this).attr('contenteditable', 'true');
				}
			}
		});
		$("#" + parentid).find('.textmatch-answermap li').removeClass('selected-aie');
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			if (useroptions) AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
		}		
				
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
	},
	
	
	checkDADMatchLive: function($parentobj) {
		var result = true;
		$parentobj.find('.option-target').children().each(function(){
			if($(this).hasClass('selected-aie')) {
				var target_id = $(this).attr('id');
				//check if the map has src for the selected target
				if (AIE.Qaa.dadMap[target_id]) {
					//get the src id
					var src_id = AIE.Qaa.dadMap[target_id];
					//now use the src id to get the class
					var sClass = $("#" + src_id).attr('class').split(' ')[0];
					//extract the src class index
					var sClassIndex = sClass.replace(/\D/g,'');
					//now use the target id to get the class
					var tClass = $(this).attr('class').split(' ')[0];
					var tClassIndex = tClass.replace(/\D/g,'');
					//Compare the src and target index
					if (sClassIndex == tClassIndex) {
						//do nothing
					} else {
						var srcdata = $("#" + src_id).text();
						var targetid = "#" + target_id.replace("_ot", "_am");
						var targetanswer = $(targetid).text();						if (srcdata != targetanswer) {
							result = false;
						}
					}
				} else {
					result = false;
				}
			}else {
				//looks like user has some items remaining to drop
				result = false;
			}
		});
		return result;		
	},
	
	hasUserFinishedDrop: function($parentobj) {
		var result = true;
		$parentobj.find('.option-target').children().each(function(){
			if($(this).hasClass('selected-aie')) {
				
			}else {
				//looks like user has some items remaining to drop
				result = false;
			}
		});
		return result;		
	},
	
	checkDADMatch: function($parentobj) {
		//Make sure that incr correct count is set to true if calling function
		//does not pass an arg. 
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
		
		//$(".non-draggable").removeClass("non-draggable").addClass("ui-draggable");  
		$(".non-draggable").removeClass("selected-aie") 
		//Variable used for displaying the feedback
		var eval_status = false;
		var once = true;
		var useroptions = {};
		
		$parentobj.find('.option-target').children().each(function(){
			if (once) {
				//set the eval_status to true for first time
				eval_status = true;
				once = false;
			}
			if($(this).hasClass('selected-aie') || $(this).hasClass('correct') || $(this).hasClass('wrong')) {
				var target_id = $(this).attr('id');
				//check if the map has src for the selected target
				if (AIE.Qaa.dadMap[target_id]) {
					//get the src id
					var src_id = AIE.Qaa.dadMap[target_id];
					//now use the src id to get the class
					var sClass = $("#" + src_id).attr('class').split(' ')[0];
					$("#" + src_id).removeClass('selected-aie');
					//extract the src class index
					var sClassIndex = sClass.replace(/\D/g,'');
					//now use the target id to get the class
					var tClass = $(this).attr('class').split(' ')[0];
					var tClassIndex = tClass.replace(/\D/g,'');
					//Compare the src and target index
					useroptions[target_id] = src_id;
					if (sClassIndex == tClassIndex) {
						//Show correct response
						var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
						$(this).addClass(cl);
					} else {
						//Show error response
						var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
						eval_status = false;
						$(this).addClass(cl).removeClass('selected-aie');
					}
					$(this).removeClass('selected-aie');
				} else {
					//Show error response
					var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
					eval_status = false;
					$(this).addClass(cl).removeClass('selected-aie');
				}	
			}else {
				//Make sure that you handle the case where something was 
				//checked properly in the previous check event and is not selected
				if ($(this).hasClass('correct') == false) {
					eval_status = false;
				} else {
					//Here we add the item to the variable to be stored in local storage
					var target_id = $(this).attr('id');
					var src_id = AIE.Qaa.dadMap[target_id];
					if (src_id) useroptions[target_id] = src_id;
				}
			}
		});
		
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			if (useroptions) AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
			if (eval_status && incr_correct_count) {
				AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
			}
		}		
		AIE.Qaa.showFeedback($parentobj, eval_status);
		// call score function
		AIE.Qaa.CheckScore.setScore($parentobj);
		return eval_status;
	},
	
	retryDAD: function($parentobj) {
		//Handle the update to local datastructure here
		var useroptions = {};
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			useroptions = AIE.Qaa.userSelectionMap[qaaid]["userselection"];
		}
		$(".non-draggable").removeClass("non-draggable").addClass("ui-draggable");  
		$( ".non-droppable").removeClass("non-droppable").addClass("ui-droppable"); 
		//$("option-source .ui-draggable").removeClass("selected-aie");
		$parentobj.find('.option-target').children().each(function(){
			//Check if user has done a drag operation and it is wrong
			if($(this).hasClass('wrong')) {
				var target_id = $(this).attr('id');
				if (AIE.Qaa.dadMap[target_id]) {
					//get the src id
					var src_id = AIE.Qaa.dadMap[target_id];
					//now use the src id to get the class
					var sClass = $("#" + src_id).attr('class').split(' ')[0];
					//extract the src class index
					var sClassIndex = sClass.replace(/\D/g,'');
					var srcclass ='.s'+ sClassIndex;
					var src_selector = '.option-source >' + srcclass;
					$parentobj.find("#" + src_id).css({top:'0px',left:'0px'});
					useroptions[target_id] = "";
					// enable draggable again for try again items
					$parentobj.find("#" + src_id).draggable({
						disabled: false,
					});
				}
				if (AIE.Qaa.dadMap[target_id]) {
					delete AIE.Qaa.dadMap[target_id];
				}
				$(this).removeClass('selected-aie');
				$(this).removeClass('wrong');
				$(this).removeClass('correct');
				
				
			} else if($(this).hasClass('correct')) {
				//Add the correct answers to useroptions to save it to local storage
				var src_id = AIE.Qaa.dadMap[target_id];
				useroptions[target_id] = src_id;
			}
		});
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			if (useroptions) AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
		}	
		
	},
	
	resetDAD: function($parentobj) {
		
	    $($parentobj).attr('id');
		var elemid =  $($parentobj).attr('id');
		
		var association_id = elemid;
		
		$('#'+association_id+' .check').removeAttr("disabled", "disabled");
  		$('#'+association_id+' .try-again').removeAttr("disabled", "disabled");
		
		$parentobj.find('.option-target').children().each(function(){
			var target_id = $(this).attr('id');
			
			$(this).removeClass('wrong');
			$(this).removeClass('correct')
			
			if(AIE.Qaa.dadMap[target_id]) {
				//get the src id
				var src_id = AIE.Qaa.dadMap[target_id];
				//now use the src id to get the class
				var sClass = $("#" + src_id).attr('class').split(' ')[0];
				//extract the src class index
				var sClassIndex = sClass.replace(/\D/g,'');
				var srcclass ='.s'+ sClassIndex;
				var src_selector = '.option-source >' + srcclass;
				$parentobj.find(src_selector).css({top:'0px',left:'0px'});
				
				// enable draggable again for try again items
				$parentobj.find(srcclass).draggable({
					disabled: false,
				});
				
				$(this).removeClass('selected-aie');
				$(this).removeClass('wrong');
				$(this).removeClass('correct');
			}
			
			if (AIE.Qaa.dadMap[target_id]) {
				delete AIE.Qaa.dadMap[target_id];
			}
		});
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
		
		//Setup event handler for evaluation
		$('.'+association_id+ ' > .option-source').each(function(){
			//Make sure you shuffle only if the author wants it
			if ($(this).hasClass('shuffle')) {
				$(this).shuffle();
			}
		});
		
		$parentobj.find(".option-target li").removeClass("  undefined");
		//$( ".non-droppable").removeClass("non-droppable")
		$parentobj.find(".option-target li").removeClass("selected-aie wrong correct undefined");
		
		$parentobj.find( ".non-droppable").removeClass("non-droppable").addClass("ui-droppable"); 
		$parentobj.find( ".non-draggable").removeClass("non-draggable").addClass("ui-draggable"); 
		$parentobj.find(".ui-draggable").removeClass("selected-aie");
	 
		$('#'+elemid+" .option-source li").each( function(index) {
			$(this).css( {"left" :0 , "top" :0});
		});
	
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
		}	
	},
	
	evaluateOptions: function($sel_obj){
		var isEval = false;
		$qaaobj = $sel_obj.parents('.qaa-rw');
		AIE.Qaa.evaluate($qaaobj, $sel_obj);
		//Reset selection of other classes
		$optionsrc = $sel_obj.parent();
		$optionsrc.children().each(function(){
			if (($(this).hasClass('correct')) ||  ($(this).hasClass('wrong'))){
				isEval = true;
			}
		});
		
		if (isEval == false) {
			$optionsrc.children().removeClass('selected-aie');
			//set selection on the current item
			$sel_obj.addClass('selected-aie');
		}
		AIE.Qaa.CustomFeature.checkUserEvaluation($sel_obj);
	}
};

AIE.Qaa.CheckScore = {
	setScore:function(obj, eval) {
		var x  = AIE.Qaa.evalMap;
		// when qaa is associated with an audio, 
		// check button is disabled when the page is loaded first time, to force user to listen to the audio before answering the exercise
		if(!$(obj).find('.buttons-rw').find('.check').attr('disabled')) {
			$(obj).find('.buttons-rw').find('.show-answers').removeAttr('disabled');
			$(obj).find('.buttons-rw').find('.save-answers').attr('disabled', 'disabled');
		}
		//alert(JSON.stringify(x));
		var items = 0;
		var correct_items = 0;
		var wrong_items = 0;
		if($(obj).hasClass('multi-textmatch-rw') || $(obj).hasClass('textmatch-rw')) {
			if($(obj).find('.mark-word').length>0) {
				items = $(obj).find('.mark-word').length;
				correct_items = $(obj).find('.word-correct').length;
				wrong_items = $(obj).find('.word-wrong').length;
			} else {
				items = $(obj).find('span[contenteditable]').length || $(obj).find('input').length;
				correct_items = $(obj).find('span.correct[contenteditable]').length || $(obj).find('input.correct').length;
				wrong_items = $(obj).find('span.wrong[contenteditable]').length || $(obj).find('input.wrong').length;
			}
		//} else if($(obj).hasClass('textmatch-rw')) {
			//items = $(obj).find('span[contenteditable]').length || $(obj).find('input').length;
			//correct_items = $(obj).find('span.correct[contenteditable]').length || $(obj).find('input.correct').length;
			//wrong_items = $(obj).find('span.wrong[contenteditable]').length || $(obj).find('input.wrong').length;
		} else if($(obj).hasClass('multi-truefalse-rw')) {
			items = $(obj).find('.qaa-item').length;
			correct_items = $(obj).find('.qaa-item').find('.correct').length;
			wrong_items = $(obj).find('.qaa-item').find('.wrong').length;
		} else if($(obj).hasClass('multi-truefalse-inline-rw')){
			items = $(obj).find('.option-source-inline').length;
			//correct_items = $(obj).find('.option-source-inline').find('.correct').length;
			//wrong_items = $(obj).find('.option-source-inline').find('.wrong').length;
			var mtin_c = 0;
			var mtin_w = 0;
			$(obj).find('.option-source-inline').each(function(i){
				if($(this).find('.wrong').length > 0) {
					mtin_w = mtin_w + 1;
				} else if($(this).find('.correct').length > 0) {
					// check if it has mutli answer choice, 
					// and if yes make sure user has given and made all the answers correct
					if($(this).hasClass('multi-answer')) {
						var ans = $(obj).find('.answer-map').find('li:eq('+i+')').text().split(',');
						if($(this).find('.correct').length == ans.length) {
							mtin_c = mtin_c + 1;
						}
					} else {
						mtin_c = mtin_c + 1;
					}
				}
			});
			correct_items = mtin_c;
			wrong_items = mtin_w;
		} else if($(obj).hasClass('truefalse-rw')) {
			items = $(obj).find('.option-source').length;
			correct_items = $(obj).find('.option-source').find('li.correct').length;
			wrong_items = $(obj).find('.option-source').find('li.wrong').length;
		} else if($(obj).hasClass('association-rw')) {
			items = $(obj).find('.option-target').find('li').length;
			correct_items = $(obj).find('.option-target').find('li.correct').length;
			wrong_items = $(obj).find('.option-target').find('li.wrong').length;
		} else if($(obj).hasClass('multichoice-rw')) {
			//items = $(obj).find('.option-source').find('li').length;
			var ansmap = $(obj).find('.answer-map').find('li');
			ansmap.each(function(){
				var val = $.trim($(this).text());
				if(val == 1) {
					items = items+1;
				}
			});
			correct_items = $(obj).find('.option-source').find('li.correct').length;
			wrong_items = $(obj).find('.option-source').find('li.wrong').length;
		} else if($(obj).hasClass('multiresponse-rw')) {
			//items = $(obj).find('.option-source').find('li').length;
			var ansmap = $(obj).find('.answer-map').find('li');
			ansmap.each(function(){
				var val = $.trim($(this).text());
				if(val == 1) {
					items = items+1;
				}
			});
			correct_items = $(obj).find('.option-source').find('li.correct').length;
			wrong_items = $(obj).find('.option-source').find('li.wrong').length;
		} else if($(obj).hasClass('sequence-rw')) {
			items = $(obj).find('.option-target').find('li').length;
			correct_items = $(obj).find('.option-target').find('li.correct').length;
			wrong_items = $(obj).find('.option-target').find('li.wrong').length;
		} else if($(obj).hasClass('sortword-multi-rw')) {
			items = $(obj).find('.option-target').find('li').length;
			correct_items = $(obj).find('.option-target').find('li.correct').length;
			wrong_items = $(obj).find('.option-target').find('li.wrong').length;
		} else if($(obj).hasClass('grouping-rw')) {
			items = $(obj).find('.option-source').find('li').length;
			/////////////////////////////////////////
			destructors = $(obj).find('.option-source').find('li.g0').length;
			if(destructors > 0) {
				items -=destructors;
			}
			/////////////////////////////////////////
			correct_items = $(obj).find('.option-target').find('li.correct').length;
			wrong_items = $(obj).find('.option-target').find('li.wrong').length;
		} else if($(obj).hasClass('colouring-rw')) {
			var colouringAnswers = AIE.Colouring.checkColouringAnswers($(obj));
			items = colouringAnswers[0];
			correct_items = colouringAnswers[1];
			wrong_items = colouringAnswers[2];
		}
		var score = Math.round((correct_items/items)*100) ? Math.round((correct_items/items)*100): 0;
		$(obj).find('.qaa-score-rw').show();
		if($(obj).hasClass('multiresponse-rw')) {
			var wr_ans = $(obj).find('.option-source li.wrong').length;
			var neg_ans = 10*wr_ans;
			score = score - neg_ans;
			if(score<0) {
				score = 0;
			}
		}
		$(obj).find('.correct-score').find('.score').text(score+'%');
		$(obj).find('.correct-wrong-score').find('.score').text(correct_items+'/'+items);
		$(obj).find('.correct-count').find('.score').text(correct_items);
		$(obj).find('.wrong-count').find('.score').text(wrong_items);
		$(obj).attr('data-answer-mark', correct_items+','+wrong_items+','+items);
		
		var isSet = $(obj).parent('div').hasClass('qaa-set-rw')?true:false;
		// this setScore function will be called multiple times when QAAs are inside QAA Set block
		// if you have certain things/function you don't want to be called multiple times when in qaa set
		// then put your functions or code inside below if() statement.
		if(!isSet) {
			// insert your code here to ensure your code doesn't get executed multiple times.
		}
	},
	resetScore:function(obj) {
		$(obj).parents('.qaa-set-rw').find('.qaa-set-results-rw').hide();
		$(obj).find('.qaa-score-rw').hide();
		$(obj).find('.correct-score').find('.score').text('0%');
		$(obj).find('.correct-wrong-score').find('.score').text('0/0');
		$(obj).find('.correct-count').find('.score').text('0');
		$(obj).find('.wrong-count').find('.score').text('0');
	}
}

AIE.Qaa.CustomFeature = {
	init:function() {
		var self = this;
		
		// MIA UPDATE
		$('.qaa-rw.custom-validation .buttons-rw').find('.check').attr('disabled', 'disabled');
		$('.qaa-set-rw.custom-validation').find('.qaa-set-buttons-rw').find('.qaa-set-check').attr('disabled', 'disabled');
		
		$('.qaa-rw > .buttons-rw').find('.show-answers').attr('disabled', 'disabled');
		
		$('.qaa-rw > .buttons-rw').find('.show-answers').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			self.showAnswers($parentobj);
			$($parentobj).find('.buttons-rw').find('.check, .reset, .try-again, .save-answers').attr('disabled', 'disabled');
		});
		$('.qaa-rw > .buttons-rw').find('.save-answers').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			self.saveAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});
		$('.qaa-rw > .buttons-rw').find('.clear-answers').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			self.clearAnswers($parentobj);
			var qaa_audio = $($parentobj).find('.check').attr('data-qaa-audio') ? true:false;
			if(!qaa_audio) {
				$($parentobj).find('.buttons-rw').find('.check').removeAttr('disabled');
			}
			$($parentobj).find('.buttons-rw').find('.reset, .try-again, .save-answers').removeAttr('disabled');
			$($parentobj).find('.buttons-rw').find('.show-answers').attr('disabled', 'disabled');
			AIE.Qaa.Grouping.answerChecked = false;
			if($parentobj.hasClass('colouring-rw')) {
				AIE.Colouring_tap.QASetColouringAttempted = false;
				AIE.Colouring_tap.QASetColouringCorrectClassFound = false;
			}
			
			AIE.Qaa.CustomFeature.disableCheckButtons($(this));
		});
		$('.qaa-rw > .buttons-rw').find('.load-answers').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			$($parentobj).find('.buttons-rw').find('.save-answers').attr('disabled', 'disabled');
			self.loadAnswers($parentobj);
		});
		
		$('.qaa-rw > .buttons-rw').find('.reset, .try-again').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.CheckScore.resetScore($parentobj);
			$($parentobj).find('.buttons-rw').find('.save-answers').removeAttr('disabled');
			$($parentobj).find('.buttons-rw').find('.show-answers').attr('disabled', 'disabled');
			if($(this).hasClass('reset')) {
				if($($parentobj).find('.qaa-notification-rw').length<1) {
					alert('Your saved answers have been permanently deleted.');
				}
				AIE.Qaa.CustomFeature.disableCheckButtons($(this));
			}
		});
		
		$('.qaa-set-rw > .qaa-set-buttons-rw').find('.qaa-set-reset, .qaa-set-try-again').click(function(){
			var $parentobj = $(this).parents('.qaa-set-rw');
			AIE.Qaa.CheckScore.resetScore($parentobj);
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-save-answers').removeAttr('disabled');
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-show-answers').attr('disabled', 'disabled');
			if($(this).hasClass('qaa-set-reset')) {
				if($($parentobj).find('.qaa-notification-rw, .qaa-set-notification-rw').length<1) {
					alert('Your saved answers have been permanently deleted.');
				}
				AIE.Qaa.CustomFeature.disableCheckButtons($(this));
			}
		});
	},
	showAnswers:function(obj) {
		var ID = $(obj).attr('id');
		var map = AIE.Qaa.evalMap;
		AIE.Qaa.CustomFeature.clearAnswers(obj);
		if($(obj).hasClass('multi-textmatch-rw') || $(obj).hasClass('textmatch-rw')) {
			$(obj).find('.option-source').find('li span[contenteditable], li .inputcontent').each(function(){
				$(this).addClass('ans-show');
				$(this).attr('contenteditable', 'false');
				var li_id = $(this).attr('id');
				var ans = AIE.Qaa.evalMap[li_id];
				ans = $.trim(ans);
				var mans = [];
				var comma = false;
				if(ans[0] == "\"") {
					mans = ans.split('"');
				} else if (ans[0] == "'") {
					mans = ans.split("'");
				} else if (ans[0] == "|") {
					mans = ans.split("|");
				} else {
					mans = ans.split(',');
					comma = true;
				}
				if(mans.length > 1) {
					if(comma) {
						$(this).text(mans[0]);
						$(this).val(mans[0]);
					} else {
						$(this).text(mans[1]);
						$(this).val(mans[1]);
					}
				} else {
					$(this).text(ans);
					$(this).val(ans);
				}
				$(this).addClass('selected-aie');
			});
			$(obj).find('.textmatch-answermap:not(.multi-answer)').find('li').hide();
		} else if($(obj).hasClass('multi-truefalse-rw') || $(obj).hasClass('truefalse-rw') || $(obj).hasClass('multichoice-rw') || $(obj).hasClass('multiresponse-rw')) {
			$(obj).find('.option-source li').each(function(){
				var li_id = $(this).attr('id');
				var x = AIE.Qaa.evalMap[li_id];
				if(x == 1) {
					$(this).trigger('click');
				}
			});
		} else if($(obj).hasClass('multi-truefalse-inline-rw')) {
			AIE.Qaa.Decryption.init();
			$(obj).find('.option-source-inline').each(function(ind){
				var li_id = $(this).attr('id');
				if($(this).hasClass('multi-answer')) {
					var ar = [];
					var ans = $(obj).find('.answer-map').find('li:eq('+ind+')').text();
					ans = ans.replace('[','');
					ans = ans.replace(']','');
					ar = ans.split(',');
					for(var i =0; i<ar.length;i++) {
						$(this).find('span:eq('+((ar[i]-1))+')').trigger('click');
					}
				} else {
					var target = $(obj).find('.answer-map').find('li:eq('+ind+')').text();
					$(this).find('span:eq('+(target-1)+')').trigger('click');
				}
			});
			AIE.Qaa.Decryption.encrypt();
		} else if($(obj).hasClass('association-rw') || $(obj).hasClass('sequence-rw')) {
			$(obj).find('.option-target li').each(function(){
				var tar_clas = $(this).attr('class').split(' ')[0];
				var sou_clas = tar_clas.replace('t', 's');
				$(obj).find('.'+sou_clas).trigger('click');
				$('.'+tar_clas).trigger('click');
			});
		} else if($(obj).hasClass('sortword-multi-rw')) {
			AIE.Qaa.Decryption.init();
			$(obj).find('.option-source').each(function(ind){
				var answer = $(obj).find('.answer-map:eq('+ind+')').text();
				answer = $.trim(answer);
				var words = answer.split(' ');
				$(obj).find('.option-target:eq('+ind+')').find('li').html('');
				$.each(words, function(k, v){
					var t = '<span>'+v+'</span>';
					$(obj).find('.option-target:eq('+ind+')').find('li').addClass('selected-aie').append(t);
				});
				$(this).find('span').hide();
			});
			AIE.Qaa.Decryption.encrypt();
		} else if($(obj).hasClass('grouping-rw')) {
			AIE.Qaa.Grouping.answerChecked = false;
			$(obj).find('.option-target').each(function(ind){
				var answer = $(obj).find('.option-source').find('li.g'+(ind+1));
				var parent = $(this);
				$(answer).each(function(){
					var clas = $(this).attr('class').split(' ')[1];
					////////////////////////////////
					/*	UI fix for destructors	*/
					$(this).addClass('selected-aie');
					////////////////////////////////
					if($(this).hasClass('multi') && clas == 'g'+(ind+1)) {
						$(this).trigger('click');
						$(parent).trigger('click');
					} else if($(this).hasClass('multi')==false){
						$(this).trigger('click');
						$(parent).trigger('click');
					}
				});
			});
		} else if($(obj).hasClass('colouring-rw')) {
			AIE.Colouring.showColouringAnswers(obj);
		}
		// hide show feedback message when user has checked the answer
		$(obj).find('.feedback-messages, .qaa-set-feedback-messages').show();
		$(obj).find('.feedback-messages, .qaa-set-feedback-messages').find('.correct, .wrong').hide();
		$(obj).find(".show-answer-feedback").show();
		
		$(obj).parents('.qaa-set-rw').find('.qaa-set-feedback-messages').show();
		$(obj).parents('.qaa-set-rw').find('.qaa-set-feedback-messages').find('.correct, .wrong').hide();
		$(obj).parents('.qaa-set-rw').find(".show-answer-feedback").show();
		$(obj).addClass('lock-exercise');
	},
	clearAnswers:function(obj) {
		if($(obj).hasClass('multi-textmatch-rw') || $(obj).hasClass('textmatch-rw')) {
			$(obj).find('.textmatch-answermap').find('li').removeClass('selected-aie');
			$(obj).find('.option-source').find('span[contenteditable]').text('').removeClass('selected-aie correct wrong ans-show');
			$(obj).find('.option-source').find('input').val('').removeClass('selected-aie correct wrong');
			$(obj).find('.option-source').find('.mark-word').removeClass('word-wrong');
			$(obj).find('.option-source').find('.mark-word').removeClass('word-correct');
			$(obj).find('.textmatch-answermap').find('li').show().css({'top':'0px', 'left':'0px',});
			$(obj).find('.feedback-messages').hide();
			// enable editing editable fields 
			$(obj).find('.option-source').find('span[contenteditable]:not(.ttonly)').attr('contenteditable', 'true');
			// enable droppable on clear answers
			$(obj).find('.option-source').find('span[contenteditable]:not(.typeonly)').droppable({
				disabled: false,
			});
			AIE.Qaa.CheckScore.resetScore(obj);
		} else if($(obj).hasClass('multi-truefalse-rw') || $(obj).hasClass('truefalse-rw') || $(obj).hasClass('multi-truefalse-inline-rw') || $(obj).hasClass('multichoice-rw') || $(obj).hasClass('multiresponse-rw')) {
			$(obj).find('.option-source, .option-source-inline').find('.selected-aie').removeClass('selected-aie');
			$(obj).find('.option-source, .option-source-inline').find('.correct').removeClass('correct');
			$(obj).find('.option-source, .option-source-inline').find('.wrong').removeClass('wrong');
			$(obj).find('.feedback-messages').hide();
			AIE.Qaa.CheckScore.resetScore(obj);
		} else if($(obj).hasClass('association-rw') || $(obj).hasClass('sequence-rw')) {
			$(obj).find('.option-source, .option-target').find('li').removeClass('selected-aie wrong correct');
			$(obj).find('.option-source').find('li').addClass('ui-draggable');
			// when item is dragged, make it disable so users cant drag it again
			$(obj).find( ".non-droppable").removeClass("non-droppable").addClass("ui-droppable"); 
			$(obj).find( ".non-draggable").removeClass("non-draggable").addClass("ui-draggable"); 
			$(obj).find(".ui-draggable").removeClass("selected-aie");
			$(obj).find('.option-source').find('li').each(function(){
				$(this).css({top:'0px',left:'0px'});
				$(this).draggable({
					disabled: false,
				});
			});
			$(obj).find('.feedback-messages').hide();
			AIE.Qaa.CheckScore.resetScore(obj);
		} else if($(obj).hasClass('sortword-multi-rw')) {
			$(obj).find('.option-source, .option-target').find('li').removeClass('selected-aie wrong correct');
			$(obj).find('.option-source').find('li span').removeAttr('style');
			$(obj).find('.option-target').find('li span').remove();
			$(obj).find('.feedback-messages').hide();
			AIE.Qaa.CheckScore.resetScore(obj);
		} else if($(obj).hasClass('grouping-rw')) {
			$(obj).find('.option-source').find('li').removeAttr('style');
			$(obj).find('.option-source').find('li').removeClass('selected-aie dropped__t1 dropped__t2 dropped__t3 dropped__t4 dropped__t5');
			$(obj).find('.option-target').find('li').remove();
			$(obj).find('.option-source').find('li').each(function(){
				//$(this).css({top:'0px',left:'0px'});
				/*==================================================================================================*/
				/***		adding style "position:relative" so that the options are seen when beein dragged		*/
				/***		problem after pressing the reset button													*/
				/*==================================================================================================*/
				$(this).css({position:'relative',top:'0px',left:'0px'});
				$(this).draggable({
					disabled: false,
				});
			});
			$(obj).find('.feedback-messages').hide();
			//AIE.Qaa.userSelectionMap[$(obj).attr('id')]["userselection"] = {};
			
			/*==================================================================================================*/
			/*********		GROUPING-RW Script error on exercise load and using the Reset button,		*********/
			/*********		before solving the exercise													*********/
			/*==================================================================================================*/
			if(AIE.Qaa.Grouping.answerChecked == true) {
				AIE.Qaa.userSelectionMap[$(obj).attr('id')]["userselection"] = {};
			}
			/*==================================================================================================*/
			/*																									*/	
			/*==================================================================================================*/
			AIE.Qaa.CheckScore.resetScore(obj);
		} else if($(obj).hasClass('colouring-rw')) {
			AIE.Colouring.resetColouringAnswers(obj);
			AIE.Qaa.CheckScore.resetScore(obj);
		}
		$(obj).removeClass('lock-exercise');
	},
	saveAnswers:function(obj){
		var qaaid = $(obj).attr('id');
		var useroptions = {};
		if($(obj).hasClass('multi-textmatch-rw') || $(obj).hasClass('textmatch-rw')) {
			$(obj).find('.option-source').find('span[contenteditable]').each(function(){
				var user_answer = $.trim($(this).text());
				if(user_answer != '') {
					useroptions[$(this).attr("id")] = user_answer;
				}
			});
		} else if($(obj).hasClass('multi-truefalse-rw') || $(obj).hasClass('truefalse-rw') || $(obj).hasClass('multi-truefalse-inline-rw') || $(obj).hasClass('multichoice-rw') || $(obj).hasClass('multiresponse-rw')) {
			$(obj).find('.option-source, .option-source-inline').find('.selected-aie').each(function(){
				//var user_answer = $.trim($(this).text());
				useroptions[$(this).attr("id")] = true;
			});
		} else if($(obj).hasClass('association-rw') || $(obj).hasClass('sequence-rw')) {
			$(obj).find('.option-target').find('.selected-aie').each(function(){
				var target_id = $(this).attr('id');
				var src_id = AIE.Qaa.dadMap[target_id];
				useroptions[target_id] = src_id;
			});
		} else if($(obj).hasClass('sortword-multi-rw')) {
			var targetdata = {};
			$('.qaa-item > .option-source > li > span', $(obj)).each(function(){
				if (($(this).is(":visible")) == false) {
					useroptions[$(this).attr("id")] = false;
				}
			});
			$('.qaa-item > .option-target > li', $(obj)).each(function(){
				var li_data = $(this).html();
				targetdata[$(this).attr("id")] = li_data;
			});
			AIE.Qaa.userSelectionMap[qaaid]["targetdata"] = targetdata;
		} else if($(obj).hasClass('grouping-rw')) {
			$(obj).find('.option-source li').each(function(){
				if (($(this).is(":visible")) == false) {
					var c = $(this).attr('class');
					var spc = c.split('__')[1];
					useroptions[$(this).attr("id")] = spc;
				} 
			});
		}
		useroptions['saveonly'] = true;
		if(AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"userselection": {}};
		}
		AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
		var qaaset = $(obj).parents('.qaa-set-rw').hasClass('qaa-set-rw')?true:false;
		if(!qaaset) {
			if($(obj).find('.qaa-notification-rw').length<1) {
				alert('Your answers have been saved');
			}
		}
	},
	loadAnswers:function(obj){
		$(obj).removeClass('lock-exercise');
		var id = $(obj).attr('id');
		AIE.Qaa.UserResultStorage.loadSpecificUserResult(id);
	},
	checkUserEvaluation:function(sel_ele) { // NEW FEATURE REQUEST FROM MIA - UPDATED ON 1ST SEP 2020
		//  THIS UPDATE FORCES USER TO FINISH/TRY ALL THE ANSWERS BEFORE THEY COULD CLICK CHECK BUTTON TO EVALUATE THE ANSWERS
		if($(sel_ele).parents('.qaa-rw, .qaa-set-rw').hasClass('custom-validation') == false) {
			return false;
		}
		var par_obj = $(sel_ele).parents('.qaa-rw');
		var qaa_set = false;
		qaa_set = $(par_obj).parents('.qaa-set-rw').length>0 ? true:false;
		if($(par_obj).hasClass('multichoice-rw') || $(par_obj).hasClass('multiresponse-rw')) {
			if($(par_obj).find('.option-source').find('.selected-aie, .correct').length>0) {
				$(par_obj).addClass('user-evaluated');
				$(par_obj).find('.check').removeAttr('disabled');
			} else {
				$(par_obj).find('.check').attr('disabled', 'disabled');
			}
		} else if($(par_obj).hasClass('truefalse-rw') || $(par_obj).hasClass('multi-truefalse-rw')) {
			var sel_items = $(par_obj).find('.option-source').find('.selected-aie, .correct').length;
			var qc = $(par_obj).find('.question-control').find('ol.answer-map').length;
			if(sel_items == qc) {
				$(par_obj).addClass('user-evaluated');
				$(par_obj).find('.check').removeAttr('disabled');
			}
		} else if($(par_obj).hasClass('sortword-multi-rw')) {
			var sel_items = $(par_obj).find('.option-target').find('.selected-aie, .correct').length;
			var qc = $(par_obj).find('.question-control').find('ol.answer-map').length;
			if(sel_items == qc) {
				$(par_obj).addClass('user-evaluated');
				$(par_obj).find('.check').removeAttr('disabled');
			}
		} else if($(par_obj).hasClass('association-rw') || $(par_obj).hasClass('sequence-rw')) {
			var sel_items = $(par_obj).find('.option-target').find('.selected-aie, .correct').length;
			var qc = $(par_obj).find('.question-control').find('li').length;
			if(sel_items == qc) {
				$(par_obj).addClass('user-evaluated');
				$(par_obj).find('.check').removeAttr('disabled');
			} else {
				$(par_obj).find('.check').attr('disabled', 'disabled');
			}
		} else if($(par_obj).hasClass('grouping-rw')) {
			var sel_items = $(par_obj).find('.group-target-rw li').length;
			var qc = $(par_obj).find('.group-source-rw').find('li').length;
			if(sel_items == qc) {
				$(par_obj).addClass('user-evaluated');
				$(par_obj).find('.check').removeAttr('disabled');
			} else {
				$(par_obj).find('.check').attr('disabled', 'disabled');
			}
		} else {
			var sel_items = $(par_obj).find('.option-source').find('.selected-aie, .correct').length;
			var qc = $(par_obj).find('.question-control').find('li').length;
			if(sel_items == qc) {
				$(par_obj).addClass('user-evaluated');
				$(par_obj).find('.check').removeAttr('disabled');
			} else {
				$(par_obj).find('.check').attr('disabled', 'disabled');
			}
		}
		
		// HANDLE QAA SET
		if(qaa_set) {
			var qaa_item = $(par_obj).parents('.qaa-set-rw').find('.qaa-rw').length;
			var eva_item = $(par_obj).parents('.qaa-set-rw').find('.qaa-rw.user-evaluated').length;
			if(qaa_item == eva_item) {
				$(par_obj).parents('.qaa-set-rw').find('.qaa-set-buttons-rw .qaa-set-check').removeAttr('disabled');
			}
		}
	},
	disableCheckButtons:function(btn){
		if($(btn).parents('.qaa-rw, .qaa-set-rw').hasClass('custom-validation')) {
			$(btn).parents('.qaa-set-rw').find('.qaa-rw').removeClass('user-evaluated');
			$(btn).parents('.qaa-rw').removeClass('user-evaluated');
			$(btn).parents('.qaa-rw').find('.buttons-rw .check').attr('disabled', 'disabled');
			$(btn).parents('.qaa-set-rw > .qaa-set-buttons-rw').find('.qaa-set-check').attr('disabled', 'disabled');
		}
	}
}

AIE.Qaa.TrueFalse = {
	init:function(){
		//Setup event handler for evaluation
		$('.truefalse-rw >.option-source >li').click(function(){
			var qaaobj = $(this).parents('.truefalse-rw');
			if($(qaaobj).hasClass('lock-exercise')) {
				return false;
			}
			AIE.Qaa.evaluateOptions($(this));
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.truefalse-rw').hasClass("auto-check-rw")) {
				$(this).parents('.truefalse-rw').find('.buttons-rw > .check').trigger('click');
			}
		});	
		
		//Setup event handler for CHECK button
		$('.truefalse-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkAnswers($parentobj);
			//AIE.Qaa.CheckScore.setScore($parentobj); // commented on 2706025
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.truefalse-rw > .buttons-rw > .try-again').click(function(){ 
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.truefalse-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};

AIE.Qaa.MultiTrueFalse = {
	init:function(){
		//Setup event handler for evaluation
		$('.multi-truefalse-rw').find('.option-source >li').click(function(){
			var qaaobj = $(this).parents('.multi-truefalse-rw');
			if($(qaaobj).hasClass('lock-exercise')) {
				return false;
			}
			AIE.Qaa.evaluateOptions($(this));
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.multi-truefalse-rw').hasClass("auto-check-rw")) {
				$(this).parents('.multi-truefalse-rw').find('.buttons-rw > .check').trigger('click');
			}
		});	
		
		//Setup event handler for CHECK button
		$('.multi-truefalse-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkAnswers($parentobj);
			//AIE.Qaa.CheckScore.setScore($parentobj); // commented on 2706025
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.multi-truefalse-rw > .buttons-rw > .try-again').click(function(){
			var target=$(this).parent().parent().attr("id") 
			$('#'+target+" ol li").removeClass("undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.multi-truefalse-rw > .buttons-rw > .reset').click(function(){ 
			var target=$(this).parent().parent().attr("id") 
			$('#'+target+" ol li").removeClass("wrong correct undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};

AIE.Qaa.MultiTrueFalseInline = {
	init:function(){
		$('.multi-truefalse-inline-rw').find('.option-source-inline').each(function(){
			var options = $(this).find('.qaa-word-rw').length > 0 ? true : false;
			if(!options) {
				var obj = $(this);
				var txt = $.trim($(this).text());
				var ops = txt.split(' ');
				$(this).text('');
				$.each(ops, function(i, v){
					if(v != "") {
						var t = '<span class="qaa-word-rw">'+v+'</span>';
						$(obj).append(t);
					}
				});
				AIE.Qaa.generateID($(this).parents('.multi-truefalse-inline-rw').attr('id'));
			}
			//Make sure you shuffle only if the author wants it
			/* shuffling options creates problem for answer evaluation, as it is using index number for evaluation
			if ($(this).hasClass('shuffle')) {
				$(this).shuffle();
			}
			*/
		});
		//Setup event handler for evaluation
		$('.multi-truefalse-inline-rw').find('.option-source-inline span.qaa-word-rw').click(function(){
			var qaaobj = $(this).parents('.qaa-rw');
			if($(qaaobj).hasClass('lock-exercise')) {
				return false;
			}
			if($(this).parent().hasClass('multi-answer')){
				$qaaobj = $(this).parents('.qaa-rw');
				AIE.Qaa.evaluate($qaaobj, $(this));
				//Reset selection of other classes
				$optionsrc = $(this).parent();
				//set selection on the current item
				$(this).toggleClass('selected-aie');
			} else {
				AIE.Qaa.evaluateOptions($(this));
			}
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.multi-truefalse-inline-rw').hasClass("auto-check-rw")) {
				$(this).parents('.multi-truefalse-inline-rw').find('.buttons-rw > .check').trigger('click');
			}
		});	
		
		//Setup event handler for CHECK button
		$('.multi-truefalse-inline-rw >.buttons-rw > .check').click(function(){
			AIE.Qaa.Decryption.init();
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkTFIAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
			AIE.Qaa.Decryption.encrypt();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.multi-truefalse-inline-rw > .buttons-rw > .try-again').click(function(){
			var target=$(this).parent().parent().attr("id") 
			$('#'+target+" ol li").removeClass("undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.multi-truefalse-inline-rw > .buttons-rw > .reset').click(function(){
			var target=$(this).parent().parent().attr("id");
			$('#'+target+" ol li").removeClass("wrong correct undefined");
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});
	}
};

AIE.Qaa.MultiChoice = {
	init:function(){
		//Setup event handler for evaluation
		$('.multichoice-rw').find('.option-source >li').click(function(){
			var qaaobj = $(this).parents('.qaa-rw');
			if($(qaaobj).hasClass('lock-exercise')) {
				return false;
			}
			AIE.Qaa.evaluateOptions($(this));
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.multichoice-rw').hasClass("auto-check-rw")) {
				$(this).parents('.multichoice-rw').find('.buttons-rw > .check').trigger('click');
			}
		});
		
		//Setup event handler for CHECK button
		$('.multichoice-rw >.buttons-rw > .check').click(function(){
			var target=$(this).parent().parent().attr("id");  
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkAnswers($parentobj);
			//AIE.Qaa.CheckScore.setScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.multichoice-rw > .buttons-rw > .try-again').click(function(){
			var target=$(this).parent().parent().attr("id")
			$('#'+target+" ol li").removeClass("undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
			 
		});	
		
		//RESET  EVENT HANDLER
		$('.multichoice-rw > .buttons-rw > .reset').click(function(){
			var target=$(this).parent().parent().attr("id") 
			$('#'+target+" ol li").removeClass("wrong correct undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};

AIE.Qaa.MultiResponse = {
	reTry: false,
	answerCount: {},
	init:function(){
		$('.multiresponse-rw').find('.answer-map >li').each(function(){
			var qaa_id = $(this).parents('.multiresponse-rw').attr('id');
			var ans = parseInt($(this).text());
			if(ans == 1) {
				if(AIE.Qaa.MultiResponse.answerCount.hasOwnProperty(qaa_id) == false) {
					AIE.Qaa.MultiResponse.answerCount[qaa_id] = 0;
				}
				AIE.Qaa.MultiResponse.answerCount[qaa_id] = AIE.Qaa.MultiResponse.answerCount[qaa_id]+1;
			}
		});
		//Setup event handler for evaluation
		$('.multiresponse-rw').find('.option-source >li').click(function(event){
			var qaaobj = $(this).parents('.qaa-rw');
			if($(qaaobj).hasClass('lock-exercise')) {
				return false;
			}
			//Removed the requirement for CTRL key as per client reqt - 20111121 - DC
			//if (event.ctrlKey) {
				if($(this).parents('.multiresponse-rw').hasClass('locked-answers-rw')) {
					var qaaid = $(this).parents('.multiresponse-rw').attr('id');
					var sel_count = $(this).parent('ol').find('.selected-aie, .correct, .wrong').length;
					if($(this).hasClass('selected-aie')) {
						//continue...
					} else if(sel_count == AIE.Qaa.MultiResponse.answerCount[qaaid]) {
						return false;
					}
				}
				var eval = false;
				$qaaobj = $(this).parents('.qaa-rw');
				AIE.Qaa.evaluate($qaaobj, $(this));
				//Reset selection of other classes
				$optionsrc = $(this).parent();
				$optionsrc.children().each(function(){
					if($(this).hasClass('correct') || $(this).hasClass('wrong')) {
						eval = true;
					}
				});
				//set selection on the current item
				if(!eval && !AIE.Qaa.MultiResponse.reTry) {
					$(this).toggleClass('selected-aie');
					AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
				}
				if(AIE.Qaa.MultiResponse.reTry) {
					if($(this).hasClass('correct') == false) {
						$(this).toggleClass('selected-aie');
					}
				}
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.multiresponse-rw').hasClass("auto-check-rw")) {
					$(this).parents('.multiresponse-rw').find('.buttons-rw > .check').trigger('click');
				}
			//}
		});
		
		//Setup event handler for CHECK button
		$('.multiresponse-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
			AIE.Qaa.MultiResponse.reTry = false;
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.multiresponse-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
			AIE.Qaa.MultiResponse.reTry = true;
		});	
		
		//RESET  EVENT HANDLER
		$('.multiresponse-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
			AIE.Qaa.MultiResponse.reTry = false;
		});	
	}	
};

AIE.Qaa.TextMatch = {
	dragItems:function(){
		$('.textmatch-rw >.textmatch-answermap, .multi-textmatch-rw >.textmatch-answermap').each(function(){
			if( $(this).hasClass('shuffle') ) {
				$(this).shuffle();
			}
		});
		$('.multi-textmatch-rw, .textmatch-rw').each(function(){
			var target = $(this);
			$(this).find('.textmatch-answermap li').draggable({
				containment: target,
				revert:"invalid"
			});
		});/*
		$('.textmatch-rw >.textmatch-answermap >li, .multi-textmatch-rw >.textmatch-answermap >li').draggable({
			revert:"invalid"
//			$(this).addClass('selected-aie');	
		});*/
		
		$('.textmatch-rw >.option-source >li, .multi-textmatch-rw >.option-source >li').find('span[contenteditable]:not(.typeonly), .inputcontent:not(.typeonly)').droppable({
			drop:function(e,ui){
				$(ui.draggable).offset($(this).offset());
				if($(this).hasClass('aie-dropped')) {
					var re = new RegExp('\\$|\\(|\\)|\\?|\\^|\\*|\\+|\\[|\\]',"g");
					var txt = $.trim($(this).text());
					txt = txt.replace(re, "");
					var reset = true;
					$(this).parents('.qaa-rw:not(.qaa-set-rw)').find('.textmatch-answermap li').each(function(){
						var op_txt = $(this).text();
						op_txt = op_txt.replace(re, "");
						var compare = txt.match(op_txt);
						if(txt == op_txt && reset) {
							if($(this).is(':visible') == false) {
								$(this).css({'top':'0px','left':'0px'}).show();
								reset = false;
							}
						}
					});
				}
				if($(this).hasClass('inputcontent')) {
					$(this).val($(ui.draggable).text());
				} else {
					$(this).text($(ui.draggable).text());
				}
				$(this).addClass('aie-dropped');
				$(this).addClass('selected-aie');
				if ($(ui.draggable).parents('.textmatch-answermap').hasClass('multi-answer')) {
					$($(ui.draggable)).css({'top':'0px','left':'0px'});
				} else {
					$($(ui.draggable)).hide();
				}
				if($(this).parents('.qaa-rw').hasClass("auto-check-rw")) {
					$(this).parents('.qaa-rw').find('.buttons-rw > .check').trigger('click');
				}
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
			}
//			$(this).addClass('selected-aie');	
		});
	}, 
	init:function(){
		//Setup event handler for evaluation
		$('.textmatch-rw > .option-source > li span[contenteditable]').blur(function(){
			$(this).addClass('selected-aie');
			// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
			// Updated on 1st Sep 2020
			AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
		});
		$('.textmatch-rw > .option-source >li span[contenteditable]').keyup(function(){
			var txt = $.trim($(this).text());
			if($(this).parent().hasClass('mark-word') && txt != '') {
				//$(this).next().focus();
			}
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.textmatch-rw').hasClass("auto-check-rw")) {
				$(this).parents('.textmatch-rw').find('.buttons-rw > .check').trigger('click');
			}
		});
		
		//Setup event handler for CHECK button
		$('.textmatch-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkTextMatchAnswers($parentobj);
			//AIE.Qaa.CheckScore.setScore($parentobj); // commented on 2706025
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.textmatch-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryTextMatch($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.textmatch-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetTextMatch($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};

AIE.Qaa.TextMatch_tap = {
	init:function(){
		$('.qaa-rw >.option-source >li').find('span[contenteditable], .inputcontent').each(function(){
			var empty_txt = $.trim($(this).text());
			var empty_val = $.trim($(this).val());
			if(!empty_txt || empty_val) {
				$(this).text('');
				$(this).val('');
			}
			if($(this).attr('contenteditable') == 'false') {
				$(this).addClass('ttonly');
			}
		});
	//================================================================================================//
	//***************		modification for multiple word pool TAP-TAP - START		******************//
	//================================================================================================//
		$('.qaa-rw > .textmatch-answermap > li').click(function(){
			if($(this).hasClass('selected-aie')) {
				$(this).parent().find('li').removeClass('selected-aie');
				$(this).parent().removeClass('ol-selected');
			} else {
				//use below 2 lines to clear all the selected li/ol from all tap exercises.
				//$('.qaa-rw.multi-textmatch-rw').find('ol').removeClass('ol-selected');
				//$('.qaa-rw.multi-textmatch-rw').find('li').removeClass('selected-aie');
				$(this).parent().parent().find('ol').removeClass('ol-selected');
				$(this).parent().parent().find('li').removeClass('selected-aie');
				//$(this).parent().find('li').removeClass('selected-aie');
				$(this).addClass('selected-aie');
				$(this).parent().addClass('ol-selected');
			}
			//alert('s');
		});
	//================================================================================================//
	//***************		modification for multiple word pool TAP-TAP - END		******************//
	//================================================================================================//
		// handle the double click for resetting a text field
		$('.qaa-rw >.option-source >li').find('span[contenteditable], .inputcontent').dblclick(function(){
			if($(this).hasClass('wrong') || $(this).hasClass('correct') || $(this).hasClass('ans-show')) {
				return false;
			}
			var re = new RegExp('\\$|\\(|\\)|\\?|\\^|\\*|\\+|\\[|\\]',"g");
			var txt = $.trim($(this).text());
			txt = txt.replace(re, "");
			var reset = true;
			$(this).parents('.qaa-rw:not(.qaa-set-rw)').find('.textmatch-answermap li').each(function(){
				var op_txt = $(this).text();
				op_txt = op_txt.replace(re, "");
				var compare = txt.match(op_txt);
				if(txt == op_txt && reset) {
					if($(this).is(':visible') == false) {
						$(this).css({'top':'0px','left':'0px'}).show();
						reset = false;
					}
				}
			});
			//$(this).removeClass('aie-dropped selected-aie').text('');
			$(this).removeClass('aie-dropped').text('');
			
			// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
			// Updated on 1st Sep 2020
			AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
		});
		
		$('.qaa-rw >.option-source >li').find('span[contenteditable]:not(.typeonly), .inputcontent:not(.typeonly)').click(function(){
			var sel_ele = $(this).parents('.qaa-rw:not(.qaa-set-rw)').find('.textmatch-answermap li.selected-aie');
			if(sel_ele.length>0 && $(this).hasClass('ui-droppable-disabled') == false) {
				var anstxt = $(sel_ele).text();
				if($(this).hasClass('aie-dropped')) {
					var re = new RegExp('\\$|\\(|\\)|\\?|\\^|\\*|\\+|\\[|\\]',"g");
					var txt = $.trim($(this).text());
					txt = txt.replace(re, "");
					var reset = true;
					$(this).parents('.qaa-rw:not(.qaa-set-rw)').find('.textmatch-answermap li').each(function(){
						var op_txt = $(this).text();
						op_txt = op_txt.replace(re, "");
						var compare = txt.match(op_txt);
						if(txt == op_txt && reset) {
							if($(this).is(':visible') == false) {
								$(this).css({'top':'0px','left':'0px'}).show();
								reset = false;
							}
						}
					});
				}
				if($(this).hasClass('inputcontent')) {
					$(this).val(anstxt);
				} else {
					$(this).text(anstxt);
				}
				$(this).addClass('aie-dropped');
				//$(this).addClass('selected-aie');
				if (!$(sel_ele).parents('.textmatch-answermap').hasClass('multi-answer')) {
					$(sel_ele).removeClass('selected-aie').hide();
				}
				// stop mobile device keypad launch
				$(this).blur();
				
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
				
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.qaa-rw').hasClass("auto-check-rw")) {
					$(this).parents('.qaa-rw').find('.buttons-rw > .check').trigger('click');
				}
			}
		});
	}
};

AIE.Qaa.LocalStorage = {
	save: function(key, content) {
		window.localStorage.setItem(key, content);
	},

	load: function(key) {
		return  localStorage.getItem(key);
	},
	
	remove: function(key) {
		window.localStorage.removeItem(key);
	}	
};


AIE.Qaa.UserResultStorage = {
	init: function() {
		//AIE.Qaa.userSelectionMap = {};
		//AIE.Qaa.UserResultStorage.saveUserResult();
		AIE.Qaa.UserResultStorage.loadUserResult();
	},
	
	getUniqueName: function() {
		// we have local storage saving problem on the AZARDI IOS Reader from ACF
		var acf_bookid = '';
		try {
			acf_bookid = key; // key variable is not defined on this js, this defined on iOS reader of ACF and it mean to give Book ID and Account ID
		} catch(e) {
			acf_bookid = 'aie';
		}
		var path = window.location.pathname;
		var currpageid = $(".aco-presentation ").attr("id");
		var solitnames = path.split('/');
		var pagename = solitnames[solitnames.length-1];
		var uniquename = pagename + "::" + acf_bookid;
		return uniquename;
	},
	
	// Function to store the result of the user in local storage
	 saveUserResult: function() {
		var user_data = AIE.Qaa.UserResultStorage.evaluateMode(JSON.stringify(AIE.Qaa.userSelectionMap));
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(user_data));
		return;
	 },
	 evaluateMode:function(obj){
		var user_data = JSON.parse(obj);
		for (qa_obj in user_data) {
			var mode = $('#' + qa_obj).find('.evaluation').text();
			mode = mode.toLowerCase();
			mode = $.trim(mode);
			if(mode == 'test') {
				delete user_data[qa_obj];
			}
		}
		return user_data;
	},
	 // Function to load the result of the user from local storage 
	 loadUserResult: function() {
		//AIE.Qaa.userSelectionMap = {};
		//AIE.Qaa.UserResultStorage.saveUserResult();
		var uname = this.getUniqueName();
		var retrievedObject = localStorage.getItem(uname);
		AIE.Qaa.userSelectionMap = JSON.parse(retrievedObject);
		if (AIE.Qaa.userSelectionMap) {
			
		} else {
			AIE.Qaa.userSelectionMap = {};
		}
		AIE.Qaa.LocalStorageDataLoader.init();
		return;
	},
	// Function to load the result of the user from local storage 
	 loadSpecificUserResult: function(qaaid) {
		var uname = this.getUniqueName();
		var retrievedObject = localStorage.getItem(uname);
		var specific_qaadata = JSON.parse(retrievedObject);
		var qaadata = specific_qaadata[qaaid];
		AIE.Qaa.userSelectionMap = {};
		AIE.Qaa.userSelectionMap[qaaid] = qaadata;
		if (AIE.Qaa.userSelectionMap) {
			
		} else {
			AIE.Qaa.userSelectionMap = {};
		}
		AIE.Qaa.LocalStorageDataLoader.init();
		return;
	},
	resetSortWordMultiObject: function(parentobj) {
		var qaaid = $(parentobj).attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 1, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 1, "targetdata": {}};
		} else {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
			AIE.Qaa.userSelectionMap[qaaid]["targetdata"] = {};
			AIE.Qaa.userSelectionMap[qaaid]["reset-count"] = AIE.Qaa.userSelectionMap[qaaid]["reset-count"] + 1;
		}
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(AIE.Qaa.userSelectionMap));
	},
	
	saveSortWordMultiObject: function(parentobj, result){
		var useractions = {};
		var targetdata = {};
		var qaaid = $(parentobj).attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 1, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0, "targetdata": {}};
		} else {
			useractions = AIE.Qaa.userSelectionMap[qaaid]["userselection"];
			AIE.Qaa.userSelectionMap[qaaid]["attempts"] = AIE.Qaa.userSelectionMap[qaaid]["attempts"] + 1;
		}
		//First we store the state of span into the useractions
		//If a span is hidden, it means that user has dragged and dropped it into the target
		$('.qaa-item > .option-source > li > span', $(parentobj)).each(function(){
			if (($(this).is(":visible")) == false) {
				useractions[$(this).attr("id")] = false;
			}
		});
		
		$('.qaa-item > .option-target > li', $(parentobj)).each(function(){
			var li_data = $(this).html();
			targetdata[$(this).attr("id")] = li_data;
		});
		
		AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useractions;
		AIE.Qaa.userSelectionMap[qaaid]["targetdata"] = targetdata;
		
		//Increment the correct count for the qaa if the user got it right
		if (result) {
			AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
		}
		// Check if the QAA exercise is in TEST mode
		var user_data = AIE.Qaa.UserResultStorage.evaluateMode(JSON.stringify(AIE.Qaa.userSelectionMap));
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(user_data));
	},
	saveGroupingObject: function(parentobj, result){
		var useractions = {};
		var qaaid = $(parentobj).attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 1, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0};
		} else {
			useractions = AIE.Qaa.userSelectionMap[qaaid]["userselection"];
			AIE.Qaa.userSelectionMap[qaaid]["attempts"] = AIE.Qaa.userSelectionMap[qaaid]["attempts"] + 1;
		}
		
		//First we store the state of span into the useractions
		//If a lis are hidden, it means that user has dragged and dropped it into the target
		$(parentobj).find('.option-source li').each(function(){
			if (($(this).is(":visible")) == false) {
				var c = $(this).attr('class');
				var spc = c.split('__')[1];
				useractions[$(this).attr("id")] = spc;
				//console.log(spc);
			} 
		});
		
		AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useractions;
		//Increment the correct count for the qaa if the user got it right
		if (result) {
			AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
		}
		// Check if the QAA exercise is in TEST mode
		var user_data = AIE.Qaa.UserResultStorage.evaluateMode(JSON.stringify(AIE.Qaa.userSelectionMap));
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(user_data));
	},
	resetGroupingObject: function(parentobj){
		var qaaid = $(parentobj).attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 1, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 1};
		} else {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
			AIE.Qaa.userSelectionMap[qaaid]["reset-count"] = AIE.Qaa.userSelectionMap[qaaid]["reset-count"] + 1;
		}
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(AIE.Qaa.userSelectionMap));
	}
};

AIE.Qaa.LocalStorageDataLoader = {
	getQAAType: function(qaobj) {
		if ($(qaobj).hasClass("truefalse-rw") || $(qaobj).hasClass("multi-truefalse-rw") || $(qaobj).hasClass("multi-truefalse-inline-rw")) {
			return "TRUEFALSE";
		}
		
		if ($(qaobj).hasClass("multichoice-rw") || $(qaobj).hasClass("multiresponse-rw")) {
			return "MULTICHOICE_RESPONSE";
		}
		
		if ($(qaobj).hasClass("textmatch-rw") || $(qaobj).hasClass("multi-textmatch-rw")) {
			return "TEXTMATCH";
		}
		
		if ($(qaobj).hasClass("association-rw") || $(qaobj).hasClass("sequence-rw")) {
			return "ASSOCIATION-SEQUENCE";
		}
		
		if ($(qaobj).hasClass("sortword-multi-rw")) {
			return "SORTWORD-MULTI";
		}
		
		if ($(qaobj).hasClass("grouping-rw")) {
			return "GROUPING";
		}
		
		return "";
	},

	init:function(){
		var self = this;
		for (qaaid in AIE.Qaa.userSelectionMap) {
			var qaobj = $("#" + qaaid);
			var storageobject = AIE.Qaa.userSelectionMap[qaaid];
			var qaclass = self.getQAAType(qaobj);
			switch(qaclass){
				case "TRUEFALSE":
					self.loadQAAObject(qaobj, storageobject);
					break;
				case "MULTICHOICE_RESPONSE":
					self.loadQAAObject(qaobj, storageobject);
					break;
				case "TEXTMATCH":
					self.loadQAATextObject(qaobj, storageobject);
					break;
				case "ASSOCIATION-SEQUENCE":
					self.loadDaDObject(qaobj, storageobject);
					break;
				case "SORTWORD-MULTI":
					self.loadSortWordMulti(qaobj, storageobject);
					break;
				case "GROUPING":
					self.loadGrouping(qaobj, storageobject);
					break;
				default:
					break
			}
		}
		//Now call the check answer for any set on the page.
		var sets = $('.qaa-set-rw');
		if (sets.length > 0) {
			for (var i = 0; i < sets.length; i++) {
				var setobj = sets[i];
				//if(AIE.Qaa.qaaSetLoader.qaacount == AIE.Qaa.qaaSetLoader.qaaloaded) {
					if($(setobj).hasClass('qaa-set-saveonly') == false) {
						AIE.Qaa.qaaSetLoader.qaaset = false;
						AIE.Qaa.qaaSetLoader.qaaloaded = 0;
						//$(setobj).find('.qaa-set-buttons-rw .qaa-set-check').trigger('click');
						self.qaaSetCheckAnswerOnLoad(setobj);
						//$(setobj).find('.qaa-rw').find('.check').trigger('click');
						$(setobj).find('.qaa-set-buttons-rw .qaa-set-save-answers').removeAttr('disabled');
						$(setobj).find('.qaa-set-buttons-rw .qaa-set-show-answers').attr('disabled', 'disabled');
					}
				//}
				AIE.Qaa.qaaSetLoader.qaaloaded = AIE.Qaa.qaaSetLoader.qaaloaded+1;
			}
		}
	},
	
	qaaSetCheckAnswerOnLoad:function(qaaset){
			var $parentobj = $(qaaset);
			var score = [];
			var eval_status = true;
			var not_attempted = true;
			var this_item_na = true; // na = not attempted
			AIE.Qaa.Decryption.init();
			$(".qaa-rw", $parentobj).each( function() {
				var classname = $(this).attr("class");
				AIE.Qaa.recordCheckAction($(this));
				if ($(this).hasClass("multichoice-rw")) { //Multichoice item in set
					eval_status = AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("multiresponse-rw")) { //Multiresponse item in set
					eval_status = AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("truefalse-rw")) { //True false item in set
					eval_status = AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("multi-truefalse-rw")) { //Multi True false item in set
					eval_status = AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("textmatch-rw")) { //Text Match item in set
					eval_status = AIE.Qaa.checkTextMatchAnswers($(this));
				} else if ($(this).hasClass("multi-textmatch-rw")) { //Multi Text match item in set
					eval_status = AIE.Qaa.checkTextMatchAnswers($(this));
				} else if ($(this).hasClass("sequence-rw")) { //Sequence  in set
					eval_status = AIE.Qaa.checkDADMatch($(this));
				} else if ($(this).hasClass("association-rw")) { //Association  in set
					eval_status = AIE.Qaa.checkDADMatch($(this));
				} else if ($(this).hasClass("sortword-multi-rw")) { //Association  in set
					eval_status = AIE.Qaa.SortWords.checkMultiSort($(this));
				} else if ($(this).hasClass("grouping-rw")) { // Grouping in set
					eval_status = AIE.Qaa.Grouping.checkGroupingAnswer($(this));
				} else if ($(this).hasClass("multi-truefalse-inline-rw")) { // Grouping in set
					eval_status = AIE.Qaa.checkTFIAnswers($(this));
				}
				if($(this).find('.correct:not(.feedback-messages .correct)').length > 0 || $(this).find('.wrong:not(.feedback-messages .wrong)').length > 0) {
					not_attempted = false;
					this_item_na = false;
				} else {
					this_item_na = true;
				}
				if(this_item_na) {
					$(this).addClass('not-attempted');
					this_item_na = true;
					AIE.Qaa.Grouping.answerChecked = false;
				} else {
					$(this).removeClass('not-attempted');
				}
			});
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-save-answers').attr('disabled', 'disabled');
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-show-answers').removeAttr('disabled');
			//Now Call the function to evaluate and display the result
			AIE.Qaa.QASet.checkSetAnswers($parentobj, eval_status);
			AIE.Qaa.Decryption.encrypt();
	},
	
	loadQAAObject: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		var inline_truefalse = false;
		$(qaobj).find('.selected-aie').removeClass('selected-aie');
		for (li_id in userselection) {
			var state = userselection[li_id];
			if (state == true) {
				$("#" + li_id).addClass("selected-aie");
				if(li_id == 'saveonly') {
					call_checkanswer = false;
					$(qaobj).parents('.qaa-set-rw').addClass('qaa-set-saveonly');
				} else {
					call_checkanswer = true;
				}
				if($("#" + li_id).parents('.qaa-rw').hasClass('multi-truefalse-inline-rw')) {
					inline_truefalse = true;
				}
			}
		}
		if (call_checkanswer) {
			//We pass false as second param to make sure that correct count
			//does not increase when loading from local storage
			if(inline_truefalse) {
				AIE.Qaa.checkTFIAnswers($(qaobj), false);
				
			} else {
				AIE.Qaa.checkAnswers($(qaobj), false);
			}
			
		}
	},
	
	loadQAATextObject: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		$(qaobj).find('.option-source').find('span[contenteditable]').text('');
		$(qaobj).find('.option-source').find('input').val('');
		for (in_id in userselection) {
			var user_answer = userselection[in_id];
			if (user_answer) {
				var nodename = (in_id != 'saveonly') ? $("#" + in_id)[0].nodeName: 'none';
				var re = new RegExp('\\$|\\(|\\)|\\?|\\^|\\*|\\+|\\[|\\]',"g");
				var txt = '';
				if (nodename.toLowerCase() == "span") {
					$("#" + in_id).text(user_answer).addClass('aie-dropped');
					txt = $.trim($("#" + in_id).text());
				} else if (nodename.toLowerCase() == "input") {
					$("#" + in_id).val(user_answer).addClass('aie-dropped');
					txt = $.trim($("#" + in_id).val());
				}
				if($("#" + in_id).hasClass('aie-dropped')) {
					txt = txt.replace(re, "");
					$("#" + in_id).parents('.qaa-rw:not(.qaa-set-rw)').find('.textmatch-answermap li').each(function(){
						if($(this).parent().hasClass('multi-answer')) {
							// do nothing...
						} else {
							var op_txt = $(this).text();
							op_txt = op_txt.replace(re, "");
							var compare = txt.match(op_txt);
							if(compare) {
								$(this).css({'top':'0px','left':'0px'}).hide();
							}
						}
					});
				}
				
				if(in_id == 'saveonly') {
					call_checkanswer = false;
					$(qaobj).parents('.qaa-set-rw').addClass('qaa-set-saveonly');
				} else {
					call_checkanswer = true;
				}
			}
		}
		if (call_checkanswer) {
			AIE.Qaa.checkTextMatchAnswers($(qaobj), false);
		}
	},
	
	loadDaDObject: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		$(qaobj).find('.option-source').find('.selected-aie').css({'top':'0px','left':'0px'});
		$(qaobj).find('.option-source, .option-target').find('.selected-aie').removeClass('selected-aie');
		for (target_id in userselection) {
			var src_id = userselection[target_id];
			if (src_id) {
				var targetoffset = $("#"+target_id).offset();
				$("#" + src_id).offset(targetoffset);
				$("#" + target_id).addClass("selected-aie");
				AIE.Qaa.dadMap[target_id] = src_id;
				if(target_id == 'saveonly') {
					call_checkanswer = false;
					$(qaobj).parents('.qaa-set-rw').addClass('qaa-set-saveonly');
				} else {
					call_checkanswer = true;
				}
				// if source element is dropped to the target, 
				// disable the draggable event
				$("#" + src_id).addClass('selected-aie');
				$("#" + src_id).draggable({
					disabled:true,
				});
			}
		}
		if (call_checkanswer) {
			AIE.Qaa.checkDADMatch($(qaobj), false);
		}
	},
	
	loadSortWordMulti: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		for (span_id in userselection) {
			
			var span_state = userselection[span_id];
			if (span_state == false) {
				$("#" + span_id).hide();
				call_checkanswer = true;
			}
			if(span_id == 'saveonly') {
				call_checkanswer = false;
				$(qaobj).parents('.qaa-set-rw').addClass('qaa-set-saveonly');
			}
		}
		
		var targetdata = storageobject["targetdata"];
		for (li_id in targetdata) {
			var li_data = targetdata[li_id];
			if (li_data) {
				$("#" + li_id).html(li_data);
				//call_checkanswer = true;
			}
		}
		
		if (call_checkanswer) {
			AIE.Qaa.SortWords.checkMultiSort(qaobj);
		}
	},
	
	loadGrouping: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		$(qaobj).find('.option-target[data-t]').html('');
		$(qaobj).find('.option-source').find('li').show();
		for (list in userselection) {
			
			var span_state = userselection[list];
			if (span_state == false) {
				$("#" + list).show();
				call_checkanswer = true;
			} else {
				//alert($('#'+list).get(0).nodeName +' :: ' +list+ ': '+$("#" + list).html());
				$(qaobj).find('.option-source #'+list).addClass('dropped__'+span_state);
				var t = $("#" + list).clone();
				$(t).show();
				//alert(span_state);
				//$('.group-target1').append(t);
				$(qaobj).find('.option-target[data-t="'+span_state+'"]').prepend(t);
				$("#" + list).hide();
				call_checkanswer = true;
			}
			if(list == 'saveonly') {
				call_checkanswer = false;
				$(qaobj).parents('.qaa-set-rw').addClass('qaa-set-saveonly');
			}
		}
		if (call_checkanswer) {
			AIE.Qaa.Grouping.checkGroupingAnswer(qaobj);
		}
	},
}

AIE.Qaa.MultiTextMatch = {
	init:function(){
	
		//Setup event handler for evaluation
		$('.multi-textmatch-rw > .option-source >li span[contenteditable]').blur(function(){
			$(this).addClass('selected-aie');
		});
		
		
		/*===============================================================================*/
		/**********						TYPING PER-LETTER START					**********/
		/*===============================================================================*/
		jQuery.fn.selectText = function(){
			var doc = document
				, element = this[0]
				, range, selection
			;
			if (doc.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(element);
				range.select();
			} else if (window.getSelection) {
				selection = window.getSelection();
				range = document.createRange();
				range.selectNodeContents(element);
				selection.removeAllRanges();
				selection.addRange(range);
			}
			if(selection == null || selection == 'undefined' || selection.anchorNode == null || selection.anchorNode == 'undefined' || selection.anchorNode.lastChild == null || selection.anchorNode.lastChild == 'undefined') {
				return 0
			}
			else {
				return selection.anchorNode.lastChild.length	
			}
		};
		
		var isMobile = /iPhone|iPod|iPad|Windows Phone|Mobi|Android/i.test(navigator.userAgent.toLowerCase());
		
		//typing per-letter ui
		$('.multi-textmatch-rw.per-letter > .option-source > li span[contenteditable], .multi-textmatch-rw .option-source .per-letter span[contenteditable]').each(function() {
			$(this).on("focus", function() {
				$(this).selectText();
			});
			
			var timeout;
			if(isMobile) {
				var span_text;
				$(this).keydown(function(e) {
					span_text = $(this).text().trim().replace(/[^A-Za-z0-9]/, '');
				});
				$(this).keyup(function(e) {
					var $this = $(this);
					if($(this).text().trim().match(/[^A-Za-z0-9]/) || $(this).text().match(/[^A-Za-z0-9]/)) {
						$(this).text(span_text);
					}
					
					if($(this).text().trim().length == 1) {
						$(this).selectText();
						$this.next().focus();
						
						var previous_elem = $(this).next();
						if(timeout || timeout == 'undefined') {
							clearTimeout(timeout);
						}
						timeout = setTimeout(function() {
							counter = 10;
							next_elem = $this.next().focus();
							if($this.next('.s5').length == 0) {
								if($this.parent('p')) {
									parent_elem = $this.parent();
									parent_elem.next().children('.s5').first().focus();
								}
							}
							while(counter != 0) {
								if(!$(next_elem).hasClass('s5')) {
									next_elem = next_elem.next().focus();
									counter = counter - 1;
								}
								else {
									break;
								}
								if(counter == 0) {
									break;
								}
							}
						}, 5);
					}
					else if ($(this).text().trim().length == 2) {
						$(this).text($(this).text().trim().substring(1,2) + "");
						var previous_elem = $(this).next();
						if(timeout || timeout == 'undefined') {
							clearTimeout(timeout);
						}
						timeout = setTimeout(function() {
							counter = 10;
							next_elem = $this.next().focus();
							if($this.next('.s5').length == 0) {
								if($this.parent('p')) {
									parent_elem = $this.parent();
									parent_elem.next().children('.s5').first().focus();
								}
							}
							while(counter != 0) {
								if(!$(next_elem).hasClass('s5')) {
									next_elem = next_elem.next().focus();
									counter = counter - 1;
								}
								else {
									break;
								}
								if(counter == 0) {
									break;
								}
							}
						}, 5);
						$(this).selectText();
					}
					else {
						$(this).text('');
					}
				});
			}
			else {
				$(this).keypress(function(e) {
					var $this = $(this);
					if(!((e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122))) {
						e.preventDefault();
					}
					else {
						$(this).selectText();
						var previous_elem = $(this).next();
						if(timeout || timeout == 'undefined') {
							clearTimeout(timeout);
						}
						timeout = setTimeout(function() {
							counter = 10;
							next_elem = $this.next().focus();
							if($this.next('.s5').length == 0) {
								if($this.parent('p')) {
									parent_elem = $this.parent();
									parent_elem.next().children('.s5').first().focus();
								}
							}
							while(counter != 0) {
								if(!$(next_elem).hasClass('s5')) {
									next_elem = next_elem.next().focus();
									counter = counter - 1;
								}
								else {
									break;
								}
								if(counter == 0) {
									break;
								}
							}
						}, 5);
					}
				});
			}
			
			$(this).on("cut copy paste", function(e) {
				e.preventDefault();
			});
			
		});


		//'intermediate' class functions for crossword ui
		rowIntermediate = function(span_obj){
			if($(span_obj).parent().parent().parent().find('.intermediate').length >= 1) {
				$(span_obj).parent().parent().parent().find('.intermediate').removeClass('cross_across cross_down');
				$(span_obj).parent().parent().parent().find('.intermediate').addClass('cross_across');
			}
			return $(span_obj).parent().parent().attr('class').match(/cross_a\d+/);
		};
		
		colIntermediate = function(span_obj, elem_col){
			$(span_obj).parent().parent().parent().parent().find('.intermediate').each(function() {
				if($(this).parent().children().index($(this)) == elem_col) {
					$(this).removeClass('cross_across cross_down');
					$(this).addClass('cross_down');
				}
			});
			return $(span_obj).parent().parent().attr('class').match(/cross_d\d+/);
		};
		
		numberWords = function(elem, direction) {
			var numberRegex = new RegExp('cross_' + direction + '(\\d+)');
			var numberMatch = numberRegex.exec($(elem).parent().parent().attr("class"));
			if(numberMatch !== null) {
				$(elem).attr('number_data',numberMatch[1]);
			}
			else {
				$(elem).attr('number_data','0');
			}
		};
		
		crosswordMove = function(tbl_elem){
			var timeout;
			if(timeout || timeout == 'undefined') {
				clearTimeout(timeout);
			}
			timeout = setTimeout(function() {
				//move cursor for a down word
				if(tbl_elem.parent().parent().hasClass('cross_down')) {
					var elem = tbl_elem.parent().parent().parent().next();
					if(elem.children("td.cross_active_sel").length >= 1) {
						elem.children("td.cross_active_sel").find("span.s5").focus();
					}
					else if(elem.children("td.cross_example").length >= 1 || elem.children("td.cross_inactive").length >= 1) {
						elem = elem.next();
						elem.children("td.cross_active_sel").find("span.s5").focus();
					}
				}
				//move cursor for an across word
				else {
					var elem = tbl_elem.parent().parent().next();
					if(elem.hasClass("cross_active_sel")) {
						elem.find("span.s5").focus();
					}
					else if(elem.hasClass("cross_example") || elem.hasClass("cross_inactive")) {
						elem.next().find("span.s5").focus();
					}
				}
			}, 5);
		};
		
		$('.multi-textmatch-rw > .option-source > li .crossword .cross_td_active span').each(function() {
			if($(this).parent().parent()[0].hasAttribute('class')) {
				if($(this).parent().parent().attr('class').match(/across_word_start/)) {
					numberWords($(this), 'a');
				}
				else if ($(this).parent().parent().attr('class').match(/down_word_start/)) {
					numberWords($(this), 'd');
				}
				if($(this).parent().parent().attr('class').match(/example_word_start/)) {
					numberWords($(this),'e');
				}
			}
		});
		
		
		//typing crossword word selection ui
		$('.multi-textmatch-rw > .option-source > li .crossword .cross_td_active span[contenteditable]').each(function() {
			
			$(this).on("focus", function() {
				$(this).selectText();
			});
			
			var count_elem_click = 0;
			$(this).on("click", function() {
				$(this).selectText();
				
				//across/down selection ui
				var tableObj = $(this).parent().parent().parent().parent();
				var elem_row = $(this).parent().parent().parent().parent().children().index($(this).parent().parent().parent());
				var elem_col = $(this).parent().parent().parent().children().index($(this).parent().parent());
				
				tableObj.find('.cross_active_sel').removeClass('cross_active_sel');
				
				var elem_class;
				if($(this).parent().parent()[0].hasAttribute('class')) {
					if($(this).parent().parent().hasClass("intermediate")) {
						count_elem_click = count_elem_click + 1;
						//console.log(count_elem_click)
						if(count_elem_click == 1) {
							elem_class = rowIntermediate($(this));
						}
						else if(count_elem_click == 2) {
							elem_class = colIntermediate($(this), elem_col);
							count_elem_click = 0;
						}
					}
					else if($(this).parent().parent().attr('class').match(/cross_a\d+/)) {
						elem_class = rowIntermediate($(this));
					}
					else {
						elem_class = colIntermediate($(this), elem_col);
					}
					tableObj.find('.'+elem_class).addClass("cross_active_sel");
				}
			});			
			
			//move cursor
			if(isMobile) {
				var span_text;
				$(this).keydown(function(e) {
					span_text = $(this).text().trim().replace(/[^A-Za-z0-9]/, '');
				});
				$(this).keyup(function(e) {
					var $this = $(this);
					if($(this).text().trim().match(/[^A-Za-z0-9]/) || $(this).text().match(/[^A-Za-z0-9]/)) {
						$(this).text(span_text);
					}
					
					if($(this).text().trim().length == 1) {
						//$(this).selectText();
						$this.next().focus();
						
						var previous_elem = $(this).next();
						crosswordMove($this);
					}
					else if ($(this).text().trim().length == 2) {
						$(this).text($(this).text().trim().substring(1,2) + "");
						var previous_elem = $(this).next();
						crosswordMove($this);
						$(this).selectText();
					}
					else {
						$(this).text('');
					}
				});
			}
			else {
				$(this).keypress(function(e) {
					var $this = $(this);				
					
					if(!((e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122))) {
						e.preventDefault();
					}
					else {
						$(this).selectText();
						//var previous_elem = $(this).next();
						crosswordMove($this);
					}
				});
			}
			
			$(this).on("cut copy paste", function(e) {
				e.preventDefault();
			});
			
		});
		
		
		
		/*===============================================================================*/
		/**********						TYPING PER-LETTER END					**********/
		/*===============================================================================*/
		
		
		$('.multi-textmatch-rw > .option-source >li span[contenteditable]').keyup(function(){
			var txt = $.trim($(this).text());
			// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
			// Updated on 1st Sep 2020
			if(txt != '') {
				if($(this).hasClass('selected-aie') == false) {
					$(this).addClass('selected-aie');
					AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
				}
			} else {
				$(this).removeClass('selected-aie');
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
			}
			
			/*
			if($(this).parent().hasClass('mark-word') && txt != '') {
				//$(this).next().focus();
			}*/
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.multi-textmatch-rw').hasClass("auto-check-rw")) {
				$(this).parents('.multi-textmatch-rw').find('.buttons-rw > .check').trigger('click');
			}
		});
		
		// Firefox browser creates a duplicate editable span element when pressing Enter key
		// We are preventing the default enter key behavior and stoping it (issue reported by Express Publishing). 
		// Updated on 1st March 2018
		/*$('.qaa-rw span[contenteditable]').keydown(function(e){
			if(e.which == 13) {
				e.preventDefault();
				return false;
			}
		});*/
		
		//Setup event handler for CHECK button
		$('.multi-textmatch-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkTextMatchAnswers($parentobj);
			//AIE.Qaa.CheckScore.setScore($parentobj); // commented on 2706025
			AIE.Qaa.UserResultStorage.saveUserResult();
		});
		
		//TRY AGAIN EVENT HANDLER
		$('.multi-textmatch-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryTextMatch($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.multi-textmatch-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetTextMatch($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};



/*AIE.Qaa.Association_tap = {
	init: function() {
		$('.association-rw .option-source .ui-draggable').each( function(index) {
			var association_id= $(this).attr("id")
			AIE.Qaa.Association_tap.save_tap_results(this);
		});
	},
	
	save_tap_results: function(elem) {
		var Source_target_string='';
		var association_id= $(elem).parents('.qaa-rw').attr("id")
		
		$(elem).dblclick(function(){
			var qaaobj = $(this).parents('.qaa-rw');
			if($(qaaobj).hasClass('lock-exercise')) {
				return false;
			}
			if($(this).hasClass('ui-draggable-disabled')) {
				$(this).css({'left':0,'top':0});
				// enable draggable again for try again items
				$(this).draggable({
					disabled: false,
				});
				$(this).removeClass('non-draggable selected-aie');
				$(this).addClass('ui-draggable');
				$(this).parents('.qaa-rw').find('#'+$(this).attr('data-tid')).removeClass('non-droppable selected-aie').addClass('ui-droppable');
			}
		})
		
		$(elem).click( function() {
			$('.association-rw .option-source .ui-draggable').removeClass("selected-aie")
			
			// return if this element is already been dropped to the target source
			if($(this).hasClass('non-draggable') || $(this).hasClass('ui-state-disabled')) return;
			
			var select_this = $(this).attr("class").split(' ')[1];
			//Remove the selected class from other items before selecting current
			//Clicked element
			if($('.'+select_this).hasClass("selected-aie")) {
				//$('.'+select_this).removeClass("selected-aie")
				$(elem).addClass("selected-aie");
			} else {
				$(elem).addClass("selected-aie");
			}
		
			$(".option-target li").removeClass("undefined");
			
			var source_target = true;

			var source = elem;
			var src_id =  $(elem).attr('id');
		
			$(elem).parents('.qaa-rw').find('.option-target> *').unbind();
			$(elem).parents('.qaa-rw').find('.option-target> *').bind( "click", function(e) {
				if((source_target)) {
					$(source).addClass("selected-aie");

					$(this).addClass("selected-aie");

					var target_id = $(this).attr('id');

					var tag = $(e.target).get(0).tagName.toUpperCase();

					if($(source).hasClass('ui-draggable') && $(source).hasClass('selected-aie') && !$(e.target).hasClass('inline-target') && $(e.target).hasClass('ui-droppable') && tag=='LI') {
						$(source).offset($(e.target).offset());    
						$(source).removeClass("ui-draggable").addClass("non-draggable");
						$(source).attr('data-tid', $(e.target).attr('id'));
					}
					if($(source).hasClass('ui-draggable') && $(source).hasClass('selected-aie')  && $(e.target).parent().hasClass('ui-droppable') && tag=="SPAN") {
						$(source).offset($(e.target).parents("li").offset());
						$(source).removeClass("ui-draggable").addClass("non-draggable");
						$(source).attr('data-tid', $(e.target).parents("li").attr('id'));
					}

					if($(source).hasClass('ui-draggable') && $(source).hasClass('selected-aie')  && $(e.target).parents("li").hasClass('ui-droppable') && tag== "IMG") {		 
						$(source).offset($(e.target).parents("li").offset());
						$(source).removeClass("ui-draggable").addClass("non-draggable");
						$(source).attr('data-tid', $(e.target).parents("li").attr('id'));
					}

					if($(this).hasClass('selected-aie')) {
						$(this).removeClass("ui-droppable").addClass("non-droppable");
					}

					AIE.Qaa.dadMap[target_id] = src_id;

					var $parentobj = $(this).parents('.qaa-rw');
					var finished = AIE.Qaa.hasUserFinishedDrop($parentobj);
					if (finished) {
						var parentid = $parentobj.attr('id');
						var result = AIE.Qaa.checkDADMatchLive($parentobj);
						if (result) {
							$.publish("qaaAssociationCorrect", [parentid, result]);
						} else {
							$.publish("qaaAssociationWrong", [parentid, result]);
						}
					}
					source_target = false;

					var sClass = $(source).attr('class').split(' ')[0];
					//extract the src class index
					var sClassIndex = sClass.replace(/\D/g,'');

					//now use the target id to get the class
					var tClass = $(this).attr('class').split(' ')[0];
					var tClassIndex = tClass.replace(/\D/g,'');
					
					// enable draggable again for try again items
					$(source).draggable({
						disabled: true,
					});
				}
				
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020 by Milan
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
				
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.association-rw').hasClass('auto-check-rw')) {
					$(this).parents('.association-rw').find('.buttons-rw > .check').trigger('click');
				}
			});
		});
	}
};
		


AIE.Qaa.Association = {
	init:function(){
		//Setup event handler for evaluation
		$('.association-rw > .option-source').each(function(){
			//Make sure you shuffle only if the author wants it
			if ($(this).hasClass('shuffle')) {
				$(this).shuffle();
			}
		});
		
		//Setup draggable
		$('.association-rw >.shuffle >li').draggable({
			revert:'invalid'		
		});	
		
		//Setup dropable	
		$('.association-rw >.option-target >li').droppable({
			drop:function(event,ui){
				var target_id = $(this).attr('id');
				//Is there something already there on the target
				if ($(this).hasClass('selected-aie') || $(this).hasClass('correct') || $(this).hasClass('wrong')) {
					//We dont want to stack another object on top of that
					$(ui.draggable).css({top:'0px',left:'0px'});
					return false;
				}
				
				var src_id =  $(ui.draggable).attr('id');
				//Snap the element to the top of target
				$(ui.draggable).offset($(this).offset());
				$(this).addClass('selected-aie');
				//Map the src id to element on which it is mapped
				AIE.Qaa.dadMap[target_id] = src_id;
				var $parentobj = $(this).parents('.qaa-rw');
				var finished = AIE.Qaa.hasUserFinishedDrop($parentobj);
				if (finished) {
					var parentid = $parentobj.attr('id');
					var result = AIE.Qaa.checkDADMatchLive($parentobj);
					if (result) {
						$.publish("qaaAssociationCorrect", [parentid, result]);
					} else {
						$.publish("qaaAssociationWrong", [parentid, result]);
					}
				}
				$(ui.draggable).attr('data-tid', $(this).attr('id'));
				// when item is dragged, make it disable so users cant drag it again
				$(ui.draggable).draggable({
					disabled: true,
				});
				
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020 by Milan
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
				
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.association-rw').hasClass('auto-check-rw')) {
					$(this).parents('.association-rw').find('.buttons-rw > .check').trigger('click');
				}
			}
		});	
			
		
		//Setup event handler for CHECK button
		$('.association-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkDADMatch($parentobj);
			//AIE.Qaa.CheckScore.setScore($parentobj); // commented on 2706025
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.association-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryDAD($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.association-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetDAD($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};*/

AIE.Qaa.Sequence = {
	init:function(){
		//Setup event handler for evaluation
		$('.sequence-rw > .option-source').each(function(){
			//Make sure you shuffle only if the author wants it
			if ($(this).hasClass('shuffle')) {
				$(this).shuffle();
			}
		});
		
		//Setup draggable
		$('.sequence-rw >.shuffle >li').draggable({
			revert:'invalid'				
		});	
		
		//Setup dropable	
		$('.sequence-rw >.option-target >li').droppable({
			drop:function(event,ui){
				var target_id = $(this).attr('id');
				//Is there something already there on the target
				if ($(this).hasClass('selected-aie') || $(this).hasClass('correct') || $(this).hasClass('wrong')) {
					//We dont want to stack another object on top of that
					$(ui.draggable).css({top:'0px',left:'0px'});
					return false;
				}
				
				var src_id =  $(ui.draggable).attr('id');
				//Snap the element to the top of target
				$(ui.draggable).offset($(this).offset());
				$(this).addClass('selected-aie');
				$(ui.draggable).attr('data-tid', $(this).attr('id'));
				// if source element is dropped to the target, 
				// disable the draggable event
				$(ui.draggable).addClass('selected-aie');
				$(ui.draggable).draggable({
					disabled:true,
				});
				//Map the src id to element on which it is mapped
				AIE.Qaa.dadMap[target_id] = src_id;
				
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020 by Milan
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
				
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.sequence-rw').hasClass('auto-check-rw')) {
					$(this).parents('.sequence-rw').find('.buttons-rw > .check').trigger('click');
				}
			}
		});	
			
		
		//Setup event handler for CHECK button
		$('.sequence-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkDADMatch($parentobj);
			//AIE.Qaa.CheckScore.setScore($parentobj); // commented on 2706025
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.sequence-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryDAD($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.sequence-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetDAD($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	},
};

AIE.Qaa.Sequence_tap = {
	selected_src_id: "",
	init: function() {		
		$('.sequence-rw .option-source .ui-draggable').each( function(index) {
			var el_id= $(this).attr("id")
			AIE.Qaa.Sequence_tap.setupSourceEventHandler(this);
			AIE.Qaa.Sequence_tap.setupTargetEventHandler();
		});  
	},
	setupSourceEventHandler: function(seqelem) {
		$(seqelem).dblclick( function() {
			var qaaobj = $(this).parents('.qaa-rw');
			if($(qaaobj).hasClass('lock-exercise')) {
				return false;
			}
			if($(this).hasClass('ui-draggable-disabled')) {
				$(this).css({'left':0,'top':0});
				// enable draggable again for try again items
				$(this).draggable({
					disabled: false,
				});
				$(this).removeClass('non-draggable selected-aie');
				$(this).addClass('ui-draggable');
				$(this).parents('.qaa-rw').find('#'+$(this).attr('data-tid')).removeClass('selected-aie');
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020 by Milan
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
			}
		});
		$(seqelem).click( function() {
			$(this).parents('.sequence-rw').find('.option-source .ui-draggable').removeClass("selected-aie");
			var select_this = $(this).attr("class").split(' ')[1];
			if(	$('.'+select_this).hasClass("selected-aie")) {
				//$('.'+select_this).removeClass("selected-aie")
				$(seqelem).addClass("selected-aie");
			} else {
				$(seqelem).addClass("selected-aie");
			}
		
			$(".option-target li").removeClass("undefined");
			
			AIE.Qaa.Sequence_tap.selected_src_id = $(seqelem).attr("id");
		});
	},
	
	setupTargetEventHandler: function() {
		//Setup dropable	
		$('.sequence-rw >.option-target >li').click(function(){
			//if no source selected, then do nothing
			if (AIE.Qaa.Sequence_tap.selected_src_id == "")return false;
			
			//Is there something already there on the target
			if ($(this).hasClass('selected-aie')) {
				//We dont want to stack another object on top of that
				return false;
			}
			
			var target_id = $(this).attr('id');
			
			var src_id =  AIE.Qaa.Sequence_tap.selected_src_id;
			//Snap the element to the top of target
			$("#" + src_id).offset($(this).offset());
			$(this).addClass('selected-aie');
			$('#'+src_id).attr('data-tid', $(this).attr('id'));
			// if source element is dropped to the target, 
			// disable the draggable event
			$("#" + src_id).addClass('selected-aie');
			$("#" + src_id).draggable({
				disabled:true,
			});
			//Map the src id to element on which it is mapped
			AIE.Qaa.dadMap[target_id] = src_id;
			AIE.Qaa.Sequence_tap.selected_src_id = "";
			
			// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
			// Updated on 1st Sep 2020 by Milan
			AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
			
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.sequence-rw').hasClass('auto-check-rw')) {
				$(this).parents('.sequence-rw').find('.buttons-rw > .check').trigger('click');
			}
		});	
	}
};
	

AIE.Qaa.QASet = {
	init:function(){	
		
		var self = this;
		$('.qaa-set-rw').each(function(){
			$(this).find('.qaa-set-buttons-rw').find('.qaa-set-show-answers').attr('disabled', 'disabled');
		});
		//Setup event handler for CHECK button
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-submit').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-check').click(function(){
			var $parentobj = $(this).parents('.qaa-set-rw');
			var score = [];
			var eval_status = true;
			var not_attempted = true;
			var this_item_na = true; // na = not attempted
			var mark_items = 0;
			var eval_mode = $.trim($($parentobj).children('.question-control').find('.evaluation').text().toLowerCase());
			if(eval_mode == 'test') {
				$($parentobj).find('.qaa-rw').find('.evaluation').text('test');
			}
			$(".qaa-rw", $parentobj).each( function() {
				var classname = $(this).attr("class");
				AIE.Qaa.recordCheckAction($(this));
				if ($(this).hasClass("multichoice-rw")) { //Multichoice item in set
					eval_status = AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("multiresponse-rw")) { //Multiresponse item in set
					eval_status = AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("truefalse-rw")) { //True false item in set
					eval_status = AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("multi-truefalse-rw")) { //Multi True false item in set
					eval_status = AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("textmatch-rw")) { //Text Match item in set
					eval_status = AIE.Qaa.checkTextMatchAnswers($(this));
				} else if ($(this).hasClass("multi-textmatch-rw")) { //Multi Text match item in set
					eval_status = AIE.Qaa.checkTextMatchAnswers($(this));
				} else if ($(this).hasClass("sequence-rw")) { //Sequence  in set
					eval_status = AIE.Qaa.checkDADMatch($(this));
				} else if ($(this).hasClass("association-rw")) { //Association  in set
					eval_status = AIE.Qaa.checkDADMatch($(this));
				} else if ($(this).hasClass("sortword-multi-rw")) { //Association  in set
					eval_status = AIE.Qaa.SortWords.checkMultiSort($(this));
				} else if ($(this).hasClass("grouping-rw")) { // Grouping in set
					eval_status = AIE.Qaa.Grouping.checkGroupingAnswer($(this));
				} else if ($(this).hasClass("multi-truefalse-inline-rw")) { // Grouping in set
					eval_status = AIE.Qaa.checkTFIAnswers($(this));
				} else if ($(this).hasClass("colouring-rw")) { // Colouring in set
					$('.option-target svg > path').each(function() {
						if($(this).attr('class') !== undefined && $(this).attr('class') !== false) {
							if($(this).attr('class').indexOf('colorset') >= 0) {
								AIE.Colouring_tap.QASetColouringAttempted = true;
								//eval_status = true;
								if($(this).attr('class').indexOf('correct') >= 0) {
									AIE.Colouring_tap.QASetColouringCorrectClassFound = true;
								}
							}
							/*else {
								eval_status = false;
							}*/
						}
					});
					AIE.Qaa.CheckScore.setScore($(this));
				}
				if($(this).parents('.qaa-set-rw').find('.qaa-rw').find('.correct:not(.feedback-messages .correct)').length > 0 || $(this).parents('.qaa-set-rw').find('.qaa-rw').find('.wrong:not(.feedback-messages .wrong)').length > 0) {
					not_attempted = false;
					this_item_na = false;
				}
				else if($(this).hasClass('colouring-rw') && AIE.Colouring_tap.QASetColouringAttempted) {
					not_attempted = false;
					this_item_na = false;
				}
				else {
					this_item_na = true;
				}
				if(this_item_na) {
					$(this).addClass('not-attempted');
					this_item_na = true;
				} else {
					$(this).removeClass('not-attempted');
				}
			});
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-save-answers').attr('disabled', 'disabled');
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-show-answers').removeAttr('disabled');
			//Now Call the function to evaluate and display the result
			self.checkSetAnswers($parentobj, eval_status);
			//Save results to the local storage
			AIE.Qaa.UserResultStorage.saveUserResult();
			if(this_item_na) {
				$($parentobj).find(".qaa-set-results-rw").show();
				$($parentobj).find(".qaa-set-feedback-messages").show();
				$($parentobj).find(".qaa-set-feedback-messages").find('.correct, .show-answer-feedback').hide();
				if($($parentobj).hasClass('mark-by-items')) {
					$($parentobj).find('.qaa-rw').each(function(){
						var items = $(this).attr('data-answer-mark').split(',')[2];
						mark_items = parseInt(mark_items)+parseInt(items);
					});
					$($parentobj).find(".qaa-set-results-rw").find('.qaa-set-correct-wrong-score .score').text('0/'+mark_items);
				} else {
					$($parentobj).find(".qaa-set-results-rw").find('.qaa-set-correct-wrong-score .score').text('0/'+$($parentobj).children('.qaa-rw').length);
				}
				$($parentobj).find(".qaa-set-results-rw").find('.correct-score').text('0');
				$($parentobj).find(".qaa-set-results-rw").find('.wrong-score').text('0');
			}
			// multi-respnose try again selection handle
			AIE.Qaa.MultiResponse.reTry = false;
		});	
		
		//RESET  EVENT HANDLER
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-reset').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			$(".qaa-rw", $parentobj).each( function() {
				AIE.Qaa.recordResetAction($(this));
				var classname = $(this).attr("class");
				if ($(this).hasClass("multichoice-rw")) { //Multichoice item in set
					AIE.Qaa.resetOptions($(this));
				} else if ($(this).hasClass("multiresponse-rw")) { //Multiresponse item in set
					AIE.Qaa.resetOptions($(this));
				} else if ($(this).hasClass("truefalse-rw")) { //True false item in set
					AIE.Qaa.resetOptions($(this));
				} else if ($(this).hasClass("multi-truefalse-rw")) { //Multi True false item in set
					AIE.Qaa.resetOptions($(this));
				} else if ($(this).hasClass("textmatch-rw")) { //Text Match item in set
					AIE.Qaa.resetTextMatch($(this));
				} else if ($(this).hasClass("multi-textmatch-rw")) { //Multi Text match item in set
					AIE.Qaa.resetTextMatch($(this));
				} else if ($(this).hasClass("sequence-rw")) { //Sequence  in set
					AIE.Qaa.resetDAD($(this));
				} else if ($(this).hasClass("association-rw")) { //Association  in set
					AIE.Qaa.resetDAD($(this));
				} else if ($(this).hasClass("association-rw")) { //Association  in set
					AIE.Qaa.SortWords.resetSortMulti($(this));
				} else if ($(this).hasClass("grouping-rw")) { //Association  in set
					AIE.Qaa.Grouping.reset($(this));
				}  else if ($(this).hasClass("multi-truefalse-inline-rw")) { //Association  in set
					AIE.Qaa.resetOptions($(this));
				}
			});
			//Set the score to empty
			$($parentobj).find('.qaa-set-results-rw').hide();
			$($parentobj).find('.qaa-set-feedback-messages').hide();
			$($parentobj).find(".qaa-set-results-rw").hide();
			$($parentobj).find(".qaa-set-feedback-messages").hide();
			$($parentobj).find(".qaa-score-rw").hide();
			$($parentobj).find(".qaa-set-results-rw > .correct-score", $parentobj).text("0");
			$($parentobj).find(".qaa-set-results-rw > .wrong-score", $parentobj).text("0");
			
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-save-answers').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			$(".qaa-rw", $parentobj).each( function() {
				//AIE.Qaa.CustomFeature.saveAnswers($(this));
				$(this).find('.save-answers').trigger('click');
			});
			if($($parentobj).find('.qaa-set-notification-rw').length<1) {
				alert('Your answers have been saved');
			}
		});
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-show-answers').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			$(".qaa-rw", $parentobj).each( function() {
				//AIE.Qaa.CustomFeature.saveAnswers($(this));
				$(this).find('.show-answers').trigger('click');
			});
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-check, .qaa-set-try-again, .qaa-set-reset, .qaa-set-save-answers').attr('disabled', 'disabled');
		});
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-clear-answers').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			$(".qaa-rw", $parentobj).each( function() {
				//AIE.Qaa.CustomFeature.saveAnswers($(this));
				$(this).find('.clear-answers').trigger('click');
			});
			$($parentobj).find('.qaa-set-results-rw').hide();
			$($parentobj).find('.qaa-set-feedback-messages').hide();
			$($parentobj).find('.qaa-set-correct-score').find('.score').text('0%');
			$($parentobj).find('.qaa-set-correct-wrong-score').find('.score').text('0/0');
			$($parentobj).find('.correct-score').find('.score').text('0');
			$($parentobj).find('.wrong-score').find('.score').text('0');
			$($parentobj).find('.correct-score').text('0');
			$($parentobj).find('.wrong-score').text('0');
			var qaa_audio = $($parentobj).find('.qaa-set-check').attr('data-qaa-audio') ? true:false;
			if(!qaa_audio) {
				$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-check').removeAttr('disabled');
			}
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-try-again, .qaa-set-reset, .qaa-set-save-answers').removeAttr('disabled');
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-show-answers').attr('disabled', 'disabled');
			
			AIE.Qaa.CustomFeature.disableCheckButtons($(this));
		});
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-load-answers').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			AIE.Qaa.qaaSetLoader.qaaset = true;
			AIE.Qaa.qaaSetLoader.qaacount = $($parentobj).find('.qaa-rw').length;
			$(".qaa-rw", $parentobj).each( function() {
				//AIE.Qaa.CustomFeature.saveAnswers($(this));
				$(this).find('.load-answers').trigger('click');
			});
			$($parentobj).find('.qaa-set-buttons-rw').find('.qaa-set-save-answers').attr('disabled', 'disabled');
		});
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-try-again').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			$(".qaa-rw", $parentobj).each( function() {
				//AIE.Qaa.CustomFeature.saveAnswers($(this));
				$(this).find('.try-again').trigger('click');
			});
			$($parentobj).find(".qaa-set-results-rw").hide();
		});
	},
	
	checkSetAnswers: function(setobj, eval_status) {
		
		var self = this;
		$parentobj = $(setobj);
		var score = [];
		var qaa_count = 0;
		var qaa_eval = false;
		$(".qaa-rw", $parentobj).each( function() {
			
			qaa_count = qaa_count+1;
			if($(this).find('.option-source .correct, .option-source .wrong, .option-target .correct, .option-target .wrong, .option-source-inline .correct, .option-source-inline .wrong').length > 0) {
				qaa_eval = true;
			}
			else if($(this).hasClass('colouring-rw')) {
				if(AIE.Colouring_tap.QASetColouringAttempted) {
					qaa_eval = true;
				}
			}
			var wrong_feedback = $(".feedback-messages > .wrong", $(this));
			var correct_feedback = $(".feedback-messages > .correct", $(this));
			var correct_score = $(this).find(".question-control > .correct-score").text();
			var wrong_score = $(this).find(".question-control > .wrong-score").text();
			var qaa_res =  {"id": "", "status": "", "score": 0};
			//custom class for checking answers in a set without mark-by-items
			//fixing moving content in tap-tap exerices (like scrabbled sentences)
			//bypassing something.show() or something.hide() with display:none in CSS
			//if ($(wrong_feedback).is(":visible"))
			if ($(wrong_feedback).hasClass("alt_feed")) {
				qaa_res["id"] = $(this).attr("id");
				qaa_res["status"] = "wrong";
				qaa_res["score"] = parseInt(wrong_score);
				eval_status = false;
			}
				//custom class for checking answers in a set without mark-by-items
				//fixing moving content in tap-tap exerices (like scrabbled sentences)
				//bypassing something.show() or something.hide() with display:none in CSS
				//else if ($(correct_feedback).is(":visible")) {
				else if ($(correct_feedback).hasClass("alt_feed")) {
				qaa_res["id"] = $(this).attr("id");
				qaa_res["status"] = "correct";
				qaa_res["score"] = parseInt(correct_score);
			}
			//Push the info regarding this qaa item into array for later eval
			score.push(qaa_res);
			if($(this).hasClass('not-attempted')) {
				$(this).find('.feedback-messages').hide();
				$(this).find('.qaa-score-rw').hide();
			}
		});
		if(qaa_eval) {
			if(eval_status) {
				$parentobj.find('.qaa-set-feedback-messages').show();
				$parentobj.find('.qaa-set-feedback-messages').find('.correct').show();
				$parentobj.find('.qaa-set-feedback-messages').find('.wrong').hide();
				// show show feedback message when user has checked the answer
				$parentobj.find(".show-answer-feedback").show();
			} else {
				$parentobj.find('.qaa-set-feedback-messages').show();
				$parentobj.find('.qaa-set-feedback-messages').find('.correct').hide();
				$parentobj.find('.qaa-set-feedback-messages').find('.wrong').show();
				// hide show feedback message when user has checked the answer
				$parentobj.find(".show-answer-feedback").hide();
			}
			//Now pass the eval array to function for final processing
			if($parentobj.hasClass('mark-by-items')) {
				self.setScoreByItems($parentobj, score);
			} else {
				self.scoreSet($parentobj, score);
			}
		} 
	},
	scoreSet: function(setobj, scoredata) {
		$(".qaa-rw", $(setobj)).each( function() {
			total_correct = 0;
			total_wrong = 0;
			var correct_count = 0;
			var wrong_count = 0;
			for (var i =0; i < scoredata.length; i++) {
				var t_score = scoredata[i];
				if (t_score["status"] == "correct") {
					total_correct = total_correct + t_score["score"];
					correct_count = correct_count+ 1;
				} else {
					total_wrong = total_wrong + t_score["score"];
					wrong_count = wrong_count+1;
				}
			}
			$(setobj).find(".qaa-set-results-rw").show();
			$(setobj).find(".qaa-set-results-rw .correct-score", setobj).text(correct_count);
			$(setobj).find(".qaa-set-results-rw .wrong-score", setobj).text(wrong_count);
			var sets_percent = Math.round((correct_count/scoredata.length)*100) ? Math.round((correct_count/scoredata.length)*100): 0;
			$(setobj).find(".qaa-set-results-rw .qaa-set-correct-score", setobj).find('span.score').text(sets_percent+'%');
			$(setobj).find(".qaa-set-results-rw .qaa-set-correct-wrong-score", setobj).find('span.score').text(correct_count+'/'+scoredata.length);	
		});
	},
	setScoreByItems: function(setobj, scoredata) {
		$(setobj).each( function() {
			var tot_items = 0;
			var cor_items = 0;
			var wro_items = 0;
			var multi_response_wro = 0;
			$(this).find('.qaa-rw').each(function(){
				var mark_data = $(this).attr('data-answer-mark').split(',');
				tot_items = tot_items+eval(mark_data[2]);
				cor_items = cor_items+eval(mark_data[0]);
				wro_items = wro_items+eval(mark_data[1]);
				if($(this).hasClass('multiresponse-rw')) {
					if($(this).find('.option-source').find('.wrong').length>0) {
						multi_response_wro = multi_response_wro + $(this).find('.option-source').find('.wrong').length;
					}
				}
			});
			$(setobj).find(".qaa-set-results-rw").show();
			$(setobj).find(".qaa-set-results-rw .correct-score", setobj).text(cor_items);
			$(setobj).find(".qaa-set-results-rw .wrong-score", setobj).text(wro_items);
			var sets_percent = Math.round((cor_items/tot_items)*100) ? Math.round((cor_items/tot_items)*100): 0;
			var mr_neg_ans = multi_response_wro*10;
			sets_percent = sets_percent - mr_neg_ans;
			if(sets_percent<0) {
				sets_percent = 0;
			}
			
			$(setobj).find(".qaa-set-results-rw .qaa-set-correct-score", setobj).find('span.score').text(sets_percent+'%');
			$(setobj).find(".qaa-set-results-rw .qaa-set-correct-wrong-score", setobj).find('span.score').text(cor_items+'/'+tot_items);	
			
		});
	}	
};

AIE.Qaa.SortWords = {
	init:function(){
		var self = this;
		//Setup event handler for evaluation
		$('.sortword-multi-rw > .qaa-item > .option-source').each(function(){
			//Make sure you shuffle only if the author wants it
			if ($(this).hasClass('shuffle')) {
				
				// Updated on 12-11-2013 (Milan)
				// this is to handle the automatic processing of spans for word so the editors don't have to apply 
				// spans tag to each and every word. But editors might not always want spans to be processed automatically 
				// as sometime they might want only some parts of words and/or multiple words to have span tag
				// for that reason we're only doing auto span processing if editors explicitly requests it by giving 'sortword-auto-rw' class
				var autospan = $(this).parents('.sortword-multi-rw').hasClass('sortword-auto-rw');
				if(autospan) {
					
					var txt = $.trim($(this).find('li').text());
					var words  = txt.split(' ');
					var parobj = $(this);
					$(parobj).find('li').text('');
					$.each(words, function(k, v){
						var span = '<span class="qaa-word-rw">'+v+'</span> ';
						$(parobj).find('li').append(span);
					});
					AIE.Qaa.generateID($(this).parents('.sortword-multi-rw').attr('id'));
				}
				
				var spans = $(this).find("li");
				spans.shuffle();
				//Append a blank to make sure that li does not collapse
				//after all spans inside it are hidden
				spans.append("&#160;");
			}
		});
		
		//Setup draggable
		$('.sortword-multi-rw > .qaa-item > .option-source > li > span').draggable({
			revert:'invalid'				
		});	
		
		//Setup dropable	
		$('.sortword-multi-rw > .qaa-item >.option-target >li').droppable({
			drop:function(event,ui){
				var target_id = $(this).attr('id');
				var src_id =  $(ui.draggable).attr('id');
				var topy = $(this).parent().css("top");
				var offset = $(this).parent().position();
				$(this).addClass('selected-aie');
				$(ui.draggable).addClass('aieapp-dropped');
				var text = $(ui.draggable).text();
				$(this).append("<span>" + text + "</span>");
				$(ui.draggable).css({top:'0px',left:'0px'});
				$(ui.draggable).hide();
				if($(this).parents('.qaa-item').find('.option-source > li > span:visible').length < 1) {
					//$(this).parents('.sequence-rw').find('.buttons-rw > .check').trigger('click');
				}
				
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020 by Milan
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
			}
		});	
			
		
		//Setup event handler for CHECK button
		$('.sortword-multi-rw > .buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			var result = self.checkMultiSort($parentobj);
			//AIE.Qaa.CheckScore.setScore($parentobj); // commented on 2706025
			AIE.Qaa.UserResultStorage.saveSortWordMultiObject($parentobj, result);
			return;
		});
		
		//TRY AGAIN EVENT HANDLER
		$('.sortword-multi-rw  > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			self.resetSortMulti($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.resetSortWordMultiObject($parentobj);
		});	
		
		$('.sortword-multi-rw .option-source .ui-draggable').each( function(index) {
			//var association_id= $(this).attr("id")
			AIE.Qaa.SortWords.save_tap_results(this);
		});
	},
	
	checkMultiSort: function(parentobj) {
		AIE.Qaa.Decryption.init();
		$parentobj = $(parentobj);
		var eval_status = true;
		var not_attempted = false;
		$(".qaa-item > .option-target > li ", $parentobj).each(function(index){
			var res = {};
			var user_answer = "";
			$("span", $(this)).each(function(){
				user_answer = user_answer + $(this).text() + " ";
			});
			var questioncontrol = $parentobj.find(".question-control > .answer-map");
			var curr_answer_map_ol = questioncontrol[index];
			var answer_text = $(curr_answer_map_ol).find("li").text();
			answer_text = jQuery.trim(answer_text);
			user_answer = jQuery.trim(user_answer);
			if(user_answer !='') {
				if (answer_text != user_answer) {
					eval_status = false;
					$(this).addClass("wrong");
				} else {
					$(this).addClass("correct");
				}
			} 
			if($($parentobj).find('.option-target').find('.correct, .wrong').length<1) {
				eval_status = false;
			}
		});	
		AIE.Qaa.showFeedback($parentobj, eval_status);
		AIE.Qaa.CheckScore.setScore($parentobj);
		AIE.Qaa.Decryption.encrypt();
		return eval_status;
	},
	
	resetSortMulti: function(parentobj) {
		$parentobj = $(parentobj);
		$(".qaa-item > .option-target > li", $parentobj).each(function(index){
			$(this).html("&#160;");
			$(this).removeClass("correct");
			$(this).removeClass("wrong");
			$(this).removeClass("selected-aie");
		});
		
		/* AIE.Qaa.resetDAD($parentobj); 
		$(".qaa-item > .option-target > li", $parentobj).html("&#160;");
		$(".qaa-item > .option-target > li", $parentobj).removeClass("correct");
		$(".qaa-item > .option-target > li", $parentobj).removeClass("wrong");
		$(".qaa-item > .option-target > li", $parentobj).removeClass("selected-aie"); */
		
		$parentobj.find(".feedback-messages").hide();
		$(".qaa-item > .option-source > li ", $parentobj).each(function(index){
			$("span", $(this)).each(function(){
				$(this).removeClass("aieapp-dropped");
				$(this).css({top:'0px',left:'0px'});
				$(this).show();
				
			});
		});
	},
	
	save_tap_results: function(elem) {
		$(elem).click( function() {
			$('.sortword-multi-rw .option-source .ui-draggable').removeClass("selected-aie")
			$(elem).addClass("selected-aie");
		 	var flag = 1;
			var source_target= true;
			var source = elem;
			var src_id =  $(elem);
			 
			$(elem).parents('.qaa-item').find('.option-target .ui-droppable').unbind();
			$(elem).parents('.qaa-item').find('.option-target .ui-droppable').bind( "click", function(e) { 
				var target_id = $(e.target).attr('id');
				var topy = $(e.target).parent().css("top");
				var offset = $(e.target).parent().position();
				$(e.target).addClass('selected-aie');
			    src_id.addClass('aieapp-dropped');
			    if(flag==1){
				var text = src_id.text();
				$(this).append("<span>" + text + "</span>");
				src_id.css({top:'0px',left:'0px'});
				src_id.hide();
				flag=0
				}
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020 by Milan
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
			});
		});
	}
};

AIE.Qaa.Grouping = {
	tapSelected: false,
	answerChecked: false,
	init:function() {
		var self = this;
		// initialize tap-tap event
		self.groupingTap();
		// generate index numbers for source LI items and asign into the data-i attribute
		$('.grouping-rw .option-source li').each(function(index){
			var index = index+1;
			var indclass = 'i'+index;
			$(this).attr('data-i',indclass);
		});
		// generate index numbers for target LI items and asign into the data-i attribute
		$('.grouping-rw .option-target').each(function(index){
			var index = index + 1;
			$(this).attr('data-t', 't'+index);
		});
		
		// shuffle the source element when author wants it
		$('.grouping-rw .option-source').each(function(){
			if($(this).hasClass('shuffle')) {
				$(this).shuffle();
			}
		});
		
		// draggable event handler
		/*$('.grouping-rw .option-source li').draggable({
			revert:'invalid'
		});*/
		
		/*=================================================================================*/
		/*	draggable setup fix - both DnD and destructors								   */
		/*=================================================================================*/
		$('.grouping-rw .option-source li').each(function() {
			$(this).draggable({
				//revert:'invalid',
				containment: $(this).parent().parent().parent(),
				revert: function() {
					$(this).removeClass('selected-aie');
					return true;
				}
			});
		});
		/*=================================================================================*/
		/*																				   */
		/*=================================================================================*/
		
		// we have an placeholder LI with class x inserted into the target OL as to make valid xhtml for epub
		// so we want to remove that x li before user drops the source items to the target
		$('.grouping-rw .option-target').find('li.x, li.x-rw, li.variable-rw, li.guide-rw').remove();
		// dropable event handler
		$('.grouping-rw .option-target').droppable({
			drop:function(event,ui){
				/*=================================================================================*/
				/*	extra check for selected-aie class - changig ui for DnD - destructors		   */
				/*=================================================================================*/
				if(AIE.Qaa.Grouping.answerChecked || !$('.grouping-rw .option-source li').hasClass('selected-aie')) {
					$(ui.draggable).css({'top':'0px', 'left':'0px'});
					return false;
				}
				/*=================================================================================*/
				/*																				   */	
				/*=================================================================================*/
				if($(ui.draggable).hasClass('multi')) {
					var sel_txt = $.trim($(ui.draggable).text());
					var tar_clas = $(this).attr('class').split(' ')[1];
					var tar_id = tar_clas[tar_clas.length-1];
					var exists = false;
					$(this).find('li.multi.g'+tar_id).each(function(){
						var val = $(this).text();
						if(sel_txt == val) {
							exists = true;
						}
					});
					//if($(this).find('li.multi.g'+tar_id).length>0 && sel_txt == tar_txt) {
					if(exists) {
						$(ui.draggable).css({'top':'0px', 'left':'0px'});
						$(this).addClass('notallowed-aie');
						var target = $(this);
						setTimeout(function(){
							$(target).removeClass('notallowed-aie');
						}, 2000);
						return false;
					}
				}
				$(ui.draggable).removeClass('dropped__t1 dropped__t2 dropped__t3 dropped__t4 dropped__t5');
				var item = $(ui.draggable).clone();
				var t = $(this).attr('data-t');
				$(ui.draggable).css({'top':'0px', 'left':'0px'}).hide().addClass('dropped__'+t).removeClass('selected-aie');
				$(item).removeAttr('style').removeClass('ui-draggable selected-aie');
				$(this).prepend(item);
				
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020 by Milan
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
			}
		});
		// check answer event handler
		$('.grouping-rw .check').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			//var result = self.checkGroupingAnswer($parentobj);
			self.checkGroupingAnswer($parentobj);
			return;
		});
		// try again event handler
		$('.grouping-rw .try-again').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			self.tryAgain($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
		});
		// reset event handler
		$('.grouping-rw .reset').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			self.reset($parentobj);
			AIE.Qaa.CheckScore.resetScore($parentobj);
			AIE.Qaa.UserResultStorage.resetGroupingObject($parentobj);
		});
	},
	checkGroupingAnswer:function(parentobj) {
		$parentobj = $(parentobj);
		
		var eval_status = true;
		
		// check total number of cource items
		var sourceitem = $parentobj.find('.option-source li').length;
		
		
		/*=================================================================================*/
		/*	UI for destructors															   */
		/*	Count destructors and assign new value for correct answers (sourceitem) to	   */
		/*	show correct score															   */
		/*=================================================================================*/
		var destructors = $parentobj.find('.option-source li.g0').length;
		if(destructors > 0) {
			sourceitem -= destructors;
		}
		/*=================================================================================*/
		/*																				   */
		/*=================================================================================*/
		
		
		var wrong = 0;
		var correct = 0;
		// variable for checking total number of target items being dropped into target block
		var targetitem = 0;
		
		// answer is checked with the following:
		// 1. all the source items most be dropped to the target box
		// 2. if the source item count and correct items count is equal
		// 3. and then checks if correct length is equal to source and target items
		// then answer is returned true
		var answer = false;
		
		//var eval_status = true;
		
		// checking and handling number of grouping target boxes
		$parentobj.find('.option-target').each(function(index){
			var index = index + 1;
			// update target items counts from each group target block
			targetitem = parseInt(targetitem + $(this).find('li').length);
			// first add wrong class to all the items inside the group target block
			$(this).find('li').addClass('wrong');
			// now add correct class to the items which are dropped into the right target block
			// and remove the wrong class if they're correct
			$(this).find('.g'+(index)).addClass('correct').removeClass('wrong');
			// check the lenghth of the wrong items
			var wronglength = $(this).find('.wrong').length;
			wrong = wrong+wronglength;
			var correctlength = $(this).find('.correct').length;
			correct = correct+correctlength;
			// now check and return the answer flag
			if(wrong>0) {
				answer = false;
			} else {
				answer = true;
			}
		});
		AIE.Qaa.Grouping.answerChecked = true;
		// checks the actual answer and shows the feedback message
		// if answer flag is true and source and target item is equal
		// then answer is correct and correct feedback message is displayed
		if (answer && sourceitem == targetitem) {
			eval_status = true;
		} else {
			eval_status = false;
		}
		AIE.Qaa.showFeedback($parentobj, eval_status);
		AIE.Qaa.CheckScore.setScore($parentobj);
		// save answer
		AIE.Qaa.UserResultStorage.saveGroupingObject($parentobj, eval_status);
		return eval_status;
	},
	tryAgain:function($parentobj) {
		var qaaid = $($parentobj).attr('id');
		// grouping try again event handler
		$('.grouping-rw .option-target .wrong').each(function(){
			var item = $(this).attr('data-i');
			// removes the wrong items from the group target box
			$('.grouping-rw .option-target [data-i="'+item+'"]').remove();
			// and shows the appropriate items in the group source box
			$('.grouping-rw .option-source [data-i='+item+']').show();
			var id = $(this).attr('id');
			delete AIE.Qaa.userSelectionMap[qaaid]["userselection"][id];
		});
		AIE.Qaa.Grouping.answerChecked = false;
		$parentobj.find(".feedback-messages").hide();
		AIE.Qaa.UserResultStorage.saveGroupingObject($parentobj, false);
	},
	reset:function($parentobj) {
		// grouping reset event handler
		// empty all the group target blocks
		$('.grouping-rw .option-target').empty();
		// and show all the items in the group source blocks
		$('.grouping-rw .option-source li').show().removeClass('selected-aie');
		$parentobj.find(".feedback-messages").hide();
		AIE.Qaa.UserResultStorage.resetGroupingObject($parentobj);
		AIE.Qaa.Grouping.answerChecked = false;
	},
	groupingTap:function() {
		
		/*=================================================================================*/
		/*	Check if there are destructors in word pool									   */
		/*	This check must be done every time user selects a choice in order to allow	   */
		/*	an option to be selected													   */
		/*	In case groups (option-target) have the maximum allowed options, then we do	   */
		/*	not allow user to select or drop another option into a group				   */
		/*	Code is based on Association-rw ui											   */
		/*=================================================================================*/
		
		var isDragging = false;
		var wasDragging = false;
		var wasDragging_revert = false;
		
		var sourceitem = 0;
		var destructors = 0;
		var targetitem = 0;
		
		$('.grouping-rw').each(function() {
			sourceitem = $(this).find('.option-source li').length;
			destructors = $(this).find('.option-source li.g0').length;
			targetitem = sourceitem - destructors;
			$(this).data("sourceitem", sourceitem)
			$(this).data("destructors", destructors)
			$(this).data("targetitem", targetitem)
		});
		
		
		$('.grouping-rw .option-source li').each(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			$(this).mousedown(function() {
				//console.log($parentobj);
				//console.log("sourceitem: " + $parentobj.data("sourceitem"));
				//console.log("destructors: " + $parentobj.data("destructors"));
				//console.log("targetitem: " + $parentobj.data("targetitem"));
				if(($(this).css("left") === "0px" || $(this).css("left") === "auto") && ($(this).css("top") === "0px" || $(this).css("top") === "auto")) {
					if($parentobj.data("destructors") > 0) {
						var check_targetitem = 0;
						check_targetitem += parseInt(check_targetitem + $parentobj.find('.option-target li').length);
						if(check_targetitem < $parentobj.data("targetitem")) {
							$parentobj.find('.option-source li').removeClass('selected-aie');
							$(this).addClass('selected-aie');
							isDragging = true;
							wasDragging_revert = false;
						}
						else {
							return false;
						}
					}
					else {
						$parentobj.find('.option-source li').removeClass('selected-aie');
						$(this).addClass('selected-aie');
						isDragging = true;
						wasDragging_revert = false;
					}
				}
				else {
					return false;
				}
			}).mousemove(function() {
				if($(this).hasClass('ui-draggable-dragging') && isDragging) {
					wasDragging = true;
					wasDragging_revert = true;
				}
			}).mouseup(function() {
				isDragging = false;
			});
			
		});
		
		/*=================================================================================*/
		/*																				   */
		/*=================================================================================*/
		
		// grouping tap-tap event handler
		// select a source item each time
		$('.grouping-rw .option-source li').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
		/*=================================================================================*/
		/****		Create a check in case there are destructors in the word pool		****/
		/*=================================================================================*/
			if($parentobj.data("destructors") > 0) {
				var check_targetitem = 0;
				check_targetitem += parseInt(check_targetitem + $parentobj.find('.option-target li').length);
				if((check_targetitem < $parentobj.data("targetitem")) && !wasDragging_revert) {
					$parentobj.find('.option-source li').removeClass('selected-aie');
					$(this).addClass('selected-aie');
				}
				//else {
				//	$parentobj.find('.option-source li').removeClass('selected-aie');
				//}
			}
			else {
				if(!wasDragging_revert) {
					$parentobj.find('.option-source li').removeClass('selected-aie');
					$(this).addClass('selected-aie');
				}
			}
		});
		/*=================================================================================*/
		/*																				   */
		/*=================================================================================*/
		// drop the selected source item into the group target block
		$('.grouping-rw .option-target').click(function(e){
			if(AIE.Qaa.Grouping.answerChecked) {
				return false;
			}
			var $parentobj = $(this).parents('.qaa-rw');
			var selected = $($parentobj).find('.option-source li.selected-aie');
			var sel_txt = $.trim($(selected).text());
			if($(selected).length>0) {
				if($(selected).hasClass('multi')) {
					var tar_clas = $(this).attr('class').split(' ')[1];
					var tar_id = tar_clas[tar_clas.length-1];
					var exists = false;
					$(this).find('li.multi.g'+tar_id).each(function(){
						var val = $(this).text();
						if(sel_txt == val) {
							exists = true;
						}
					});
					//if($(this).find('li.multi.g'+tar_id).length>0 && sel_txt == tar_txt) {
					if(exists) {
						$(this).addClass('notallowed-aie');
						var target = $(this);
						setTimeout(function(){
							$(target).removeClass('notallowed-aie');
						}, 2000);
						return false;
					}
				}
				$(selected).removeClass('dropped__t1 dropped__t2 dropped__t3 dropped__t4 dropped__t5');
				var item = $(selected).clone();
				var t = $(this).attr('data-t');
				$parentobj.find('.option-source .selected-aie').hide().addClass('dropped__'+t);
				$(this).prepend(item);
				$parentobj.find('.option-source li, .option-target li').removeClass('selected-aie');
				
				// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
				// Updated on 1st Sep 2020 by Milan
				AIE.Qaa.CustomFeature.checkUserEvaluation($(this));
			} else {
				AIE.Qaa.Grouping.tapSelected = true;
			}
		});
		$(document).on('click', '.grouping-rw .option-target li', function(e){
			var parobj = $(this).parents('.grouping-rw');
			var qaaobj = $(this).parents('.qaa-rw');
			/*==================================================================================================*/
			/**********		GROUPING-RW Fixing problem when user presses the "Try-Again" button		*************/
			/*==================================================================================================*/
			
			//if($(qaaobj).hasClass('lock-exercise')) {
			//	return false;
			//}
			
			if($(qaaobj).hasClass('lock-exercise') || $(this).hasClass('correct')) {
				return false;
			}
			
			/*==================================================================================================*/
			/*																									*/
			/*==================================================================================================*/
			var el = $(this).parent();
			if(AIE.Qaa.Grouping.tapSelected && !AIE.Qaa.Grouping.answerChecked) {
				var id = $(this).attr('id');
				$(parobj).find('.option-source').find('#'+id).show().removeClass('dropped__t1 dropped__t2 dropped__t3 dropped__t4 dropped__t5');
				$(this).remove();
				AIE.Qaa.Grouping.tapSelected = false;
			} 
			// MIA CUSTOMIZATION UPDATE DONE FOR DISABLING CHECK BUTTON UNTIL USER GIVES ANSWERS TO ALL THE QUESTIONS.
			// Updated on 1st Sep 2020 by Milan
			AIE.Qaa.CustomFeature.checkUserEvaluation(el);
		});
	}
};

AIE.Qaa.UserEventNotifications = {
	showNotification:function(msg, obj){
		var temp = '<div class="notification-message"><span class="close-nm">X</span><p>'+msg+'</p></div>';
		$(obj).append(temp);
		setTimeout(function(){
			$(obj).find('.notification-message').remove();
		}, 5000);
	},
	notificationsEvents:function(){
		$('.buttons-rw, .qaa-set-buttons-rw').find('button').click(function(){
			var qaa = $(this).parents('.qaa-rw');
			var set = $(this).parents('div').hasClass('qaa-set-rw')?true:false;
			var qaaset = $(this).parents('.qaa-set-buttons-rw').parents('.qaa-set-rw');
			if(set) {
				var set_fb = $(qaaset).find('.qaa-set-notification-rw');
				if(set_fb.length>0) {
					var  btn = $(this).attr('class');
					if($(set_fb).find('.'+btn+'-message').length>0) {
						var msg = $(set_fb).find('.'+btn+'-message').html();
						AIE.Qaa.UserEventNotifications.showNotification(msg, qaaset);
					}
				}
			} else {
				var  btn = $(this).attr('class');
				if($(qaa).find('.'+btn+'-message').length>0) {
					var msg = $(qaa).find('.'+btn+'-message').html();
					AIE.Qaa.UserEventNotifications.showNotification(msg, qaa);
				}
			}
		});
		$(document).on('click', '.close-nm', function(){
			$(this).parents('.notification-message').remove();
		});
	}
};

AIE.Qaa.Decryption = {
	init:function(){
		if($(".qaa-rw[data-qaa-key]").length>0) {
			$(".qaa-rw .answer-map li").each(function(){
				var stat = $(this).attr('data-encrypted') ? $(this).attr('data-encrypted'):'true';
				if(stat == 'true') {
					var qaa = $(this).parents('.qaa-rw');
					var ev = $(this).text();
					$(this).attr("data-ev", ev);
					var key = $(qaa).attr('data-qaa-key');
					var dv = AIE.Qaa.Decryption.decrypt(ev, key);
					$(this).text(dv);
					$(this).attr('data-encrypted', 'false');
					console.log(ev, ">>>>>", dv);
				}
			});
		}
	},
	decrypt:function(inciph, key){
		var ciphertext = CryptoJS.enc.Base64.parse(inciph);
		// split iv and ciphertext
		var iv = ciphertext.clone();
		iv.sigBytes = 16;
		iv.clamp();
		ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
		ciphertext.sigBytes -= 16;
		
		var key = CryptoJS.enc.Utf8.parse(key);
		
		// decryption
		var decrypted = CryptoJS.AES.decrypt({ciphertext: ciphertext}, key, {
		  iv: iv,
		  mode: CryptoJS.mode.CFB
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	},
	encrypt:function(){
		if($(".qaa-rw[data-qaa-key]").length>0) {
			$(".qaa-rw .answer-map li").each(function(){
				var ev = $(this).attr("data-ev");
				var stat = $(this).attr('data-encrypted') ? $(this).attr('data-encrypted'):'true';
				if(stat == 'false') {
					$(this).text(ev);
					$(this).attr('data-encrypted', 'true');
				}
			});
		}
	}
};

$(document).ready(function() {
	try{
		if($('.qaa-rw').length>0) {
			AIE.Qaa.TextMatch.dragItems();
			AIE.Qaa.init();
		}
	}catch(e){
		console.log(e);
	}
});