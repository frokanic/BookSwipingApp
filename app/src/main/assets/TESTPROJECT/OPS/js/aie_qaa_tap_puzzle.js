// Tap Puzzle template by GoergeKD96 - Express Publishing 2022.

AIE.Qaa.TapPuzzle = {
	
	lock			: false,
	options			: {},
	targets			: {},
	keys			: {},
	totals			: {},
	
	drag			: { override: false, started: false, canceled: false, option: null, target: null, parent: null, x: 0, y: 0, minX: 0, minY: 0, maxX: 0, maxY: 0, mcX: 0, mcY: 0 },
	
	
	// CONVERT ONE LINE OF ANSWER KEY TO 2D ARRAY ( [TARGET][ALTERNATIVES] )
	
	getKeyArray : function( parentobj ) {
		
		
		
		var key_tx = $(parentobj).find("> .question-control > .answer-map > li:nth-of-type(1)").text();
		var key = Express.CustomTools.ReplaceAll( key_tx, " ", "" ).split(",");
		
		var i = 0;
		while( i < key.length ) {
			
			key[i] = key[i].split("-");
			i += 1;
		}
		
		return key;
	},
	
	
	// GENERATE IDS & SHUFFLE
	
	generateID : function( obj ) {

		obj = $(obj);
		var par_id = obj.attr('id');

		// OPTIONS
		$(obj).find('.options').each( function(I1) {

			var rel_id_1 = par_id + "_opt" + String(I1+1);
			$(this).attr('id', rel_id_1 );

			// LI
			$(this).find('li').each( function(I2) {
				
				var rel_id_2 = rel_id_1 + "_li" + String(I2+1);
				$(this).attr('id',rel_id_2);

				// SPAN
				$(this).find('span.symbol-inline-rw').each( function(I3) {
					
					var rel_id_3 = rel_id_2 + "_sp" + String(I3+1);
					$(this).attr('id', rel_id_3);
					
					// IMAGES
					$(this).find('img').each( function(I4) {
						
						var rel_id_4 = rel_id_3 + "_img" + String(I4+1);
						$(this).attr('id', rel_id_4);
					});
				});
				
			});
		});
		
		// TARGETS
		$(obj).find('.targets').each( function(I1) {
			
			var rel_id_1 = par_id + "_trg" + String(I1+1);
			$(this).attr('id', rel_id_1 );
			
			// LI
			$(this).find('li').each( function(I2) {
			
				var rel_id_2 = rel_id_1 + "_li" + String(I2+1);
				$(this).attr('id',rel_id_2);

				// SPAN
				$(this).find('span.target').each( function(I3) {
					
					var rel_id_3 = rel_id_2 + "_targ" + String(I3+1);
					$(this).attr('id',rel_id_3);
				});
			});
			
			
		});
		
		// BACKGROUND
		$(obj).find('.backimage').each( function(I1) {
			
			var rel_id_1 = par_id + "_bkgr" + String(I1+1);
			$(this).attr('id', rel_id_1 );
			
			// IMAGE
			$(this).find('.image-rw').each( function(I2) {
			
				var rel_id_2 = rel_id_1 + "_img" + String(I2+1);
				$(this).attr('id',rel_id_2);
				
			});
		});
		
		// ANSWERS
		$(obj).find('.question_control').each( function(I1) {
			
			var rel_id_1 = par_id + "_ans" + String(I1+1);
			$(this).attr('id', rel_id_1 );
			
			// KEY
			$(this).find('.answer-map').each( function(I2) {
			
				var rel_id_2 = rel_id_1 + "_img" + String(I2+1);
				$(this).attr('id',rel_id_2);
				
				// LI
				$(this).find('li').each( function(I3) {
				
					var rel_id_3 = rel_id_2 + "_li" + String(I3+1);
					$(this).attr('id',rel_id_3);
				});
			});
		});
	},
	
	shuffle : function( obj ) {
		
		var list, par, i, n;
		
		obj.find("div.options.shuffle").each( function() {
			
			list = $(this).find("img");
			i = list.length-1;
			if( i >= 0 ) par = $(list[0]).parent();
				
			while( i > 0 ) {
				
				n = Math.floor( Math.random() * i );
				par.append( list[n] );
				list[n] = list[i];
				
				i -= 1;
			}
		});
	},
	
	// FEEDBACK ACTIONS
	
	checkAnswers : function( parentobj, lock, incr_correct_count ) {
		
		AIE.Qaa.TapPuzzle.lock = !onload;
		if( typeof(incr_correct_count) == "undefined" ) incr_correct_count = true;
		
		var qaa_id = $(parentobj).attr("id");
		var opts   = AIE.Qaa.TapPuzzle.options[qaa_id];
		var targs  = AIE.Qaa.TapPuzzle.targets[qaa_id];
		var key    = AIE.Qaa.TapPuzzle.keys[qaa_id];
		var totals = AIE.Qaa.TapPuzzle.totals[qaa_id];
		var i,j;
		
		// check targets that have an answer key.
		
		var corrects = 0;
		var wrongs = 0;
		
		i = 0;
		while( i < totals ) {
			
			if( targs[i].getAttribute("optID") !== null ) {
				
				j = 0;
				while( j < key[i].length ) {
					
					if( targs[i].getAttribute("optID") === key[i][j] ) {
						
						$(targs[i]).addClass("correct");
						corrects += 1;
						j = -1;
						break;
					}
					j += 1;
				}
				if( j != -1 ) {
					
					$(targs[i]).addClass("wrong");
					wrongs += 1;
				}
			}
			i += 1;
		}
		
		// update attribute & user selection map
		
		$(parentobj).attr( 'data-answer-mark', corrects+','+wrongs+','+totals );
		
		if( typeof(AIE.Qaa.userSelectionMap) != 'undefined' && AIE.Qaa.userSelectionMap.hasOwnProperty(qaa_id) ) {
		
			if( wrongs==0 && incr_correct_count ) AIE.Qaa.userSelectionMap[qaa_id]['correct-count'] += 1;
			AIE.Qaa.userSelectionMap[qaa_id]['userselection'] = AIE.Qaa.TapPuzzle.save(parentobj);
		}
		
		// if not in set, show score
		
		if( Express.CustomTools.inSet == false ) {
			
			//calculate percentance
			
			var percent = 0;
			if( totals > 0 ) percent = Math.max( 0 , Math.round( (corrects / totals) * 100 ) - ( wrongs * 10 ) );
			
			// set results
			
			$(parentobj).find('.correct-score .score').text(percent+'%');
			$(parentobj).find('.correct-wrong-score .score').text(corrects+'/'+totals);
			$(parentobj).find('.correct-count .score').text(corrects);
			$(parentobj).find('.wrong-count .score').text(wrongs);
			
			// display results 
			
			$(parentobj).find('.qaa-score-rw').show();
		}
		
		return ( wrongs == 0 );
	},
	
	tryAgain : function( parentobj ) {
		
		AIE.Qaa.TapPuzzle.lock = false;
		
		var wrong = $(parentobj).find(".targets .wrong")
		var i = 0;
		var id;
		
		while( i < wrong.length ) {
			
			$(wrong[i]).removeClass("wrong");
			
			id = parseInt(   wrong[i].getAttribute("optID")   );
			if( !isNaN(id) ) {
			
				AIE.Qaa.TapPuzzle.options[ parentobj.attr("id") ][ id-1 ].style.display = "";
			}
			
			wrong[i].removeAttribute("optID");
			wrong[i].innerHTML = "";
			
			i += 1;
		}
		
		return;
	},
	
	showAnswers : function( parentobj ) {
		
		AIE.Qaa.TapPuzzle.lock = true;
		
		var qaa_id	= $(parentobj).attr("id");
		var opt		= AIE.Qaa.TapPuzzle.options[qaa_id];
		var targ	= AIE.Qaa.TapPuzzle.targets[qaa_id];
		var key		= AIE.Qaa.TapPuzzle.keys[qaa_id];
		var total   = AIE.Qaa.TapPuzzle.totals[qaa_id];
		var i,t,keyInt;
		
		// show answers
		i = 0;
		while( i < total ) {
			
			T = $(targ[i]);
			
			keyInt = parseInt( key[i][0] );
			if( !isNaN( keyInt ) ) {
				
				var copy = document.createElement("img");
				copy.src = opt[ keyInt-1 ].src;
				copy.setAttribute( "draggable", "false");
				T.html("");
				T.append(copy);
				T.attr("optID", key[i][0]);
				T.removeClass("correct");
				T.removeClass("wrong");
			}
			else console.log("Key: Invalid parameter to integer convertion.");
			i += 1;
		}
		
		// hide options
		
		parentobj.find("div.options:not(.multi-answer)").each( function() {
			
			$(this).find("img").each( function() {
	
				this.style.display = "none";
				this.style.top = "0px";
				this.style.left = "0px";
				$(this).removeClass("selected-aie");
			});
		});
		
	},
	
	clearAnswers : function( parentobj ) {
		
		AIE.Qaa.TapPuzzle.lock = false;
		
		var qaa_id	= $(parentobj).attr("id");
		var opt		= AIE.Qaa.TapPuzzle.options[qaa_id];
		var targ	= AIE.Qaa.TapPuzzle.targets[qaa_id];
		var key		= AIE.Qaa.TapPuzzle.keys[qaa_id];
		var total   = AIE.Qaa.TapPuzzle.totals[qaa_id];
		var i,T;
		
		// reset target spans
		i = 0;
		while( i < targ.length ) {
			
			T = $(targ[i]);
			
			if( targ[i].hasAttribute("optID") ) targ[i].removeAttribute("optID");
			T.html("");
			T.removeClass("correct");
			T.removeClass("wrong");
			i += 1;
		}
		
		// show options
		i = 0;
		while( i < opt.length ) {
			
			opt[i].style.display = "";
			$(opt[i]).removeClass("selected-aie");
			i += 1;
		}
	},
	
	
	// SAVE/LOAD TO LOCAL STORAGE
	
	save : function( parentobj ) {
		
		var userinput = {};
		
		var qaa_id	= $(parentobj).attr("id");
		var targ	= AIE.Qaa.TapPuzzle.targets[qaa_id];
		var i;
		
		// save target state
		
		i = 0;
		while( i < targ.length ) {
			
			if( targ[i].hasAttribute("optID") ) userinput[ targ[i].getAttribute("id") ] = targ[i].getAttribute("optID");
			i += 1;
		}
		
		return userinput;
	},
	
	load : function( parentobj, userinput ) {
		
		var get;
		var hasinput = false;
		var autolock = $(parentobj).hasClass("lock_options");
		
		var qaa_id	= $(parentobj).attr("id");
		var opt 	= AIE.Qaa.TapPuzzle.options[qaa_id];
		var targ	= AIE.Qaa.TapPuzzle.targets[qaa_id];
		var i;
		
		// load user input
		i = 0;
		while( i < targ.length ) {
			
			get = userinput[ targ[i].getAttribute("id") ];
			
			if( typeof(get) != 'undefined' ) {
				
				var getInt = parseInt(get)-1;
				
				if( !isNaN(getInt) ) {
					
					targ[i].setAttribute("optID",get);
					
					var copy = document.createElement("img");
					copy.src = opt[ getInt ].src;
					copy.setAttribute( "draggable", "false");
					targ[i].innerHTML = "";
					targ[i].appendChild(copy);
					
					if(   $( $(opt[getInt]).parents("div.options")[0] ).hasClass("multi-answer") == false   ) {
						
						if(autolock) $(opt[getInt]).addClass("hide_after_lock");
						else opt[getInt].style.display = "none";
					}
				}
				else console.log("Load: Invalid parameter to integer convertion.");
			}
			i += 1;
		}
		
		return;
	},
	
	
	// LAYOUT SETUP
	
	setupLayout : function( parentobj ) {
		
		// create containers
		var layout_cont = $(document.createElement("div"));
		var ex_cont = $(document.createElement("div"));
		
		// set classes
		layout_cont.attr("class","layout-container");
		ex_cont.attr("class","exercise-container");
		
		// get <options>
		var opt_conts = parentobj.find(".options");
		var opt_T = [];
		var opt_L = [];
		var opt_R = [];
		var opt_B = [];
		
		// assort <options>
		j = 0;
		while( j < opt_conts.length ) {
			
			var o = opt_conts[j];
			if( $(o).hasClass("opt_top") )    opt_T[opt_T.length] = $(o);
			if( $(o).hasClass("opt_left") )   opt_L[opt_L.length] = $(o);
			if( $(o).hasClass("opt_right") )  opt_R[opt_R.length] = $(o);
			if( $(o).hasClass("opt_bottom") ) opt_B[opt_B.length] = $(o);
			j += 1;
		}
		
		// layout container
		
		// place top <options> in layout container
		j = 0;
		while( j < opt_T.length ) {
		
			layout_cont.append(  $(opt_T[j])  );
			j += 1;
		}
		
		// place flex container in layout container
		layout_cont.append( ex_cont );
		
		// place bottom <options> in layout container
		j = 0;
		while( j < opt_B.length ) {
		
			layout_cont.append(  $(opt_B[j])  );
			j += 1;
		}
		
		// flex container
		
		// place left <options> in flex container
		j = 0;
		while( j < opt_L.length ) {
		
			ex_cont.append(  $(opt_L[j])  );
			j += 1;
		}
		
		// place targets and backimage to exercise container
		var img_cont = $(parentobj.find(".backimage")[0])
		ex_cont.append( img_cont );
		var temp = $(img_cont.find(".image-rw .pc-rw")[0]);
		if( temp.length == 0 ) temp = img_cont;
		temp.append(  $(parentobj.find(".targets")[0])  );
		
		// place right <options> in flex container
		j = 0;
		while( j < opt_R.length ) {
		
			ex_cont.append(  $(opt_R[j])  );
			j += 1;
		}
		
		parentobj.append( layout_cont );
		return;
	},
	
	lockOptionDivs : function( parentobj ) {
		
		if( !parentobj.hasClass("lock_options") ) return;
		
		// When document.ready loads answers from local storage, the options are hidden before this function runs, (maybe even before images are fully loaded)
		// causing option divs to lock their height to a wrong value.
		// Solution: Load Answers will not hide the options if "lock_options" class is found, but instead add a class to the options so this function can hide them after locking height.
		
		var O = $(parentobj).find("div.options");
		var i = 0;
		while( i < O.length ) {
			
			O[i].style.height = String(O[i].getBoundingClientRect().height) + "px";
			O[i].style.width = String(O[i].getBoundingClientRect().width) + "px";
			i += 1;
		}
		
		AIE.Qaa.TapPuzzle.hideAfterLock( parentobj );
		
		// If the lock function runs before the load function, we want the load function to hide the options, not to add the "hide_after_lock" class to them.
		// Changing the class from lock to locked, will show that the class was there, but the load function will not see the new class and will hide used options itself.
		parentobj.removeClass("lock_options");
		parentobj.addClass("locked_options");
		
		return;		
	},
	
	hideAfterLock : function( parentobj ) {
		
		var opts = $(parentobj).find("div.options img.hide_after_lock");
		
		i = 0;
		while( i < opts.length ) {
			
			opts[i].style.display = "none";
			$(opts[i]).removeClass("hide_after_lock");
			i += 1;
		}
	},
	
	autoTargetWidth : function( parentobj ) {
		
		if( !parentobj.hasClass("auto_target_width") ) return;
		
		var O = $(parentobj).find("div.options img");
		var T = $(parentobj).find("div.targets span.target");
		var i = 0;
		
		while( i < O.length && i < T.length ) {
			
			var oRatio = O[i].naturalWidth / O[i].naturalHeight;
			var tHeight = T[i].clientHeight;
			
			T[i].style.width = String( tHeight * oRatio ) + "px";
			
			i += 1;
		}
		
		return;
	},
	
	
	// INIT
	
	init : function() {
		
		var qaa = $(".qaa-rw.tap-puzzle-rw");
		var qid = "";
		var qobj;
		var i,j;
		
		i = 0;
		while( i < qaa.length ) {
			
			// GET OBJECT AND ID
			
			qobj = $(qaa[i]);
			qid = qobj.attr("id");
			
			// SAVE CONTENTS
			
			AIE.Qaa.TapPuzzle.options[qid] = qobj.find(".options .symbol-inline-rw img");
			AIE.Qaa.TapPuzzle.targets[qid] = qobj.find(".targets span.target");
			AIE.Qaa.TapPuzzle.keys[qid]    = AIE.Qaa.TapPuzzle.getKeyArray( qobj );
			AIE.Qaa.TapPuzzle.totals[qid]  = Math.min( AIE.Qaa.TapPuzzle.targets[qid].length, AIE.Qaa.TapPuzzle.keys[qid].length );
			
			// LAYOUT
			
			AIE.Qaa.TapPuzzle.setupLayout( qobj );
			
			// SET optID AND draggable ATTRIBUTE TO <OPTIONS>
			
			j = 0;
			while( j < AIE.Qaa.TapPuzzle.options[qid].length ) {
				
				$(AIE.Qaa.TapPuzzle.options[qid][j]).attr("optID",String(j+1));
				$(AIE.Qaa.TapPuzzle.options[qid][j]).attr("draggable","false");
				j += 1;
			}
			
			// CLICK <OPTIONS>
			
			AIE.Qaa.TapPuzzle.options[qid].click( function() {
				
				if( AIE.Qaa.TapPuzzle.lock || AIE.Qaa.TapPuzzle.drag.override == true ) return;
				
				var is = $(this).hasClass("selected-aie");
				$( $(this).parents(".layout-container")[0] ).find(".selected-aie").removeClass("selected-aie");
				if( !is ) $(this).addClass("selected-aie");
			});
			
			// DRAG <OPTIONS> ONLY FOR DESKTOP  ------------------------------------------------------------------------------------------------------------------------
			
			if( !Express.CustomTools.isMobile ) {
				
				// select option
				
				AIE.Qaa.TapPuzzle.options[qid].mousedown( function(e) {
					
					if( AIE.Qaa.TapPuzzle.lock ) return;
					
					var ptr = AIE.Qaa.TapPuzzle.drag;
					
					ptr.option = this;
					ptr.x = e.pageX;
					ptr.y = e.pageY;
					ptr.override = false;
				});
				
				// follow page scroll
				
				$(document).scroll( function(e) {
					
					var ptr = AIE.Qaa.TapPuzzle.drag;
					var temp = document.body.getBoundingClientRect();
					
					$(document).trigger( "mousemove", [ptr.mcX, ptr.mcY, ptr.mcX-temp.x, ptr.mcY-temp.y] );
				});
				
				// move option
				
				$(document).mousemove( function(e, clientX, clientY, pageX, pageY ) {
					
					if( AIE.Qaa.TapPuzzle.drag.option != null ) {
						
						if( typeof(clientX) == "undefined" ) {
							clientX = e.clientX;
							clientY = e.clientY;
							pageX = e.pageX;
							pageY = e.pageY;
						}
						
						var ptr = AIE.Qaa.TapPuzzle.drag;
						
						if( !ptr.started ) {
						
							if( Math.abs(pageX - ptr.x) > 5 || Math.abs(pageY - ptr.y) > 5 ) {
								
								ptr.parent = $(ptr.option).parents(".layout-container")[0];
								$(ptr.parent).find(".selected-aie").removeClass("selected-aie");
								$(ptr.option).addClass("selected-aie");
								ptr.option.style.zIndex = "1";
								ptr.started = true;
								ptr.override = true;
								var temp1 = document.body.getBoundingClientRect();
								var temp2 = ptr.option.getBoundingClientRect();
								var temp3 = ptr.parent.getBoundingClientRect();
								ptr.x = (temp2.x - temp1.x) + (clientX - temp2.x); 		//option pageX and clicked offset
								ptr.y = (temp2.y - temp1.y) + (clientY - temp2.y); 		//option pageY and clicked offset
								ptr.minX = (temp3.x - temp2.x);							//negative option distance from layout
								ptr.minY = (temp3.y - temp2.y);							//negative option distance from layout
								ptr.maxX = ptr.minX + ( temp3.width - temp2.width );	//minX and (layout width - option width)
								ptr.maxY = ptr.minY + ( temp3.height - temp2.height );	//minY and (layout height - option height)
							}
						}
						else {
								
							var X = pageX - ptr.x;
							if( X < ptr.minX ) X = ptr.minX;
							else if( X > ptr.maxX) X = ptr.maxX;
							
							var Y = pageY - ptr.y;
							if( Y < ptr.minY ) Y = ptr.minY;
							else if( Y > ptr.maxY) Y = ptr.maxY;
							
							ptr.option.style.left = String(X) + "px";
							ptr.option.style.top = String(Y) + "px";
							ptr.mcX = clientX;
							ptr.mcY = clientY;
						}
					}
				});
				
				// drop to target
				
				$(document).mouseup( function(e) {
					
					var ptr = AIE.Qaa.TapPuzzle.drag;
					
					if( ptr.option != null ) {
						
						var i = 0;
						var temp;
						var Targs = AIE.Qaa.TapPuzzle.targets[ $(ptr.option).parents(".qaa-rw")[0].getAttribute("id") ];
						
						while( i < Targs.length ) {
							
							temp = Targs[i].getBoundingClientRect();
							if( e.clientX > temp.x && e.clientX < (temp.x+temp.width) && e.clientY > temp.y && e.clientY < (temp.y+temp.height) ) {
								
								ptr.target = Targs[i];
								break;
							}
							
							i += 1;
						}
						
						if( ptr.target != null ) {
						
							ptr.target.click();
							ptr.target = null;
							ptr.option.style.top = "0px";
							ptr.option.style.left = "0px";
							ptr.option = null;
							ptr.x = 0;
							ptr.y = 0;
						}
						else {
							
							ptr.canceled = true;
							dragCancel( ptr.option, 20, parseFloat(ptr.option.style.top.replace("px","")) / 20, parseFloat(ptr.option.style.left.replace("px","")) / 20 );
						}
					}
					
					ptr.started = false;
					ptr.option = null;
					ptr.target = null;
				});
				
				// drag cancel animation function
				
				dragCancel = function(O,S,T,L) {
					
					var x = parseFloat(O.style.top.replace("px","")) - T;
					var y = parseFloat(O.style.left.replace("px","")) - L;
					
					O.style.top = String(x) + "px";
					O.style.left = String(y) + "px";
					
					if( S > 1 ) setTimeout( dragCancel, 10, O,S-1,T,L );
					else {
						O.style.top = "0px";
						O.style.left = "0px";
						O.style.zIndex = "";
						AIE.Qaa.TapPuzzle.drag.canceled = false;
					}
				}
			}
			
			// CLICK <TARGET>
			
			AIE.Qaa.TapPuzzle.targets[qid].click( function() {
				
				if( AIE.Qaa.TapPuzzle.lock || $(this).hasClass("correct") ) return;
				
				var qaa = $( $(this).parents(".tap-puzzle-rw")[0] );
				var oid = $(this).attr('optid');
				var opt = $( qaa.find(".options img.selected-aie")[0] );
				
				//remove item
				if( oid != undefined ) {
					
					qaa.find('.options img[optid="' + oid + '"]')[0].style.display = "";
					this.removeAttribute("optID");
					this.innerHTML = "";
				}
				
				//place selected item
				if( opt.length > 0 ) {
					
					opt.removeClass("selected-aie");
					
					var copy = document.createElement("img");
					copy.src = opt[0].src;
					copy.setAttribute( "draggable", "false");
					
					$(this).attr( "optID", opt.attr("optID") );
					
					$(this).html("");
					this.appendChild(copy);
					
					if(  $(opt.parents("div.options")[0]).hasClass("multi-answer") == false ) opt[0].style.display = "none";
				}
				
				return;
			});
			
			// CLICK CHECK
			
			qobj.find(".buttons-rw > .check").click( function() {
				
				var par = $( $(this).parents(".tap-puzzle-rw")[0] );
				
				AIE.Qaa.TapPuzzle.checkAnswers( par );
				
				AIE.Qaa.recordCheckAction( par );
				AIE.Qaa.UserResultStorage.saveUserResult();
				
				par.find(".buttons-rw > .show-answers").removeAttr("disabled");
			});
			
			// CLICK TRY AGAIN
			
			qobj.find(".buttons-rw > .try-again").click( function() {
				
				var par = $( $(this).parents(".tap-puzzle-rw")[0] );
				
				AIE.Qaa.TapPuzzle.tryAgain( par );
				
				par.find('.feedback-messages').hide();
				
				AIE.Qaa.recordTryAgainAction( par );
				AIE.Qaa.CheckScore.resetScore( par );
				AIE.Qaa.UserResultStorage.saveUserResult();				
			});
			
			// CLICK RESET
			
			qobj.find(".buttons-rw > .reset").click( function() {
				
				var qaa = $( $(this).parents(".tap-puzzle-rw")[0] );
				
				AIE.Qaa.TapPuzzle.clearAnswers( qaa );
				AIE.Qaa.recordResetAction( qaa );
				AIE.Qaa.UserResultStorage.saveUserResult();
			});
			
			// SHUFFLE & GENERATE IDS
			
			AIE.Qaa.TapPuzzle.shuffle( qobj );
			AIE.Qaa.TapPuzzle.generateID( qobj );
			
			i += 1;
		}
	}
}