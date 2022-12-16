/*
Prject: Phonetic Training Programme (PTP)
Modules: English, Hindi, Marathi, Telugu, Gujarati
Created by: Deepak Chandran
Modified by: Milan Bishwakarma
Version: 1.1
(c) Copyright 2013 Infogrid Pacific. All rights reserved.
*/

var context = null;
var hitrecdim = 14;

var PATHLOADER = function () {
	var charMap = {}; 
	
	var init = function (){
		loadPaths();
	}
	
	var getCasteljauPath = function (inpoints) {
		var finalpoints = [];
		for (var t = 0; t <= 1; t += 0.01) { 
			var tmp = getCasteljauPoint(inpoints, inpoints.length-1, 0, t);
			finalpoints.push(tmp);
		}
		return finalpoints;
	}

	var getCasteljauPoint = function (inpoints, r, i, t) { 
		if(r == 0) return inpoints[i];

		var p1 = getCasteljauPoint(inpoints, r - 1, i, t);
		var p2 = getCasteljauPoint(inpoints, r - 1, i + 1, t);
		
		var tx = ((1 - t) * p1.x + t * p2.x);
		var ty = ((1 - t) * p1.y + t * p2.y);
		return {x:tx, y:ty};
	}

	var loadSingleInstruction = function (inst_def) {
		inst_def = inst_def.replace(/  /g, " ");
		var l_items = inst_def.split(" ");
		if (l_items.length < 0) return [];
		var totalcoords = parseInt(l_items[0]);
		path = [];
		for (var i=0; i < totalcoords*2; i = i+2 ) {
			var x1 = l_items[i+1];
			var y1 = l_items[i+2];
			path.push({x:x1, y:y1})
		}
		return path;
	}

	var getCharFromEl = function (parentobj) {
		var text = $(parentobj)
		.clone()    //clone the element
		.children() //select all the children
		.remove()   //remove all the children
		.end()  //again go back to selected element
		.text();
		text = $.trim(text);
		return text;
	}

	var loadCharacter = function (parentobj) {
		var s_defs = $("pre.ptp-char", parentobj).text();
		var cl_defs = s_defs.split("\n");
		var totalinst = parseInt(cl_defs[3]);
		var loadedPaths = [];
		for (var i=0; i < totalinst; i++) {
			line_def = cl_defs[i+4].trim();
			var cpath = loadSingleInstruction(line_def);
			if (cpath.length > 0) loadedPaths.push(cpath);
		}
		
		return loadedPaths;
	}

	
	var loadPaths = function (){
		$(".ptp-options > ul > li").each(function(){
			var charmap = $(this).find('.ptp-char').text()? true: false;
			if(charmap);{
				var loadedPaths = loadCharacter($(this));
				var c = getCharFromEl($(this));
				charMap[c] = loadedPaths;
			}
		});
	}
	
	var getCharPaths = function (c){
		if (charMap.hasOwnProperty(c)){
			return charMap[c];
		}
		
		return;
	}
	
	return {
		init: init,
		getCasteljauPath: getCasteljauPath,
		getCharPaths: getCharPaths
	}
}();

function CharObjConstructor(c, lw, sst, pathcolor){
	let character = c;
	
	let lineWidth = lw;
	let strokeStyle = sst;
	
	
	var allPaths = [];
	var currPathIndex = 0;
	var pathIndex = 0;
	var pathdetected = false;
	var mousedown = false;
	var currPathCount = 0
	var startHitPt = [];
	var endHitPt = [];
	var endpointreached = 0;
	var pathcolor = pathcolor;	
	var cp_start_col = "green";
	var cp_end_col = "red";
	
	var init = function (xpos){
		var self = this; 
		var loadedPaths = PATHLOADER.getCharPaths(character);
		for (var i=0; i< loadedPaths.length; i++) {
			var path = PATHLOADER.getCasteljauPath(loadedPaths[i]);
			var pathxmod = []
			for (var k=0; k< path.length; k++){
				var pt = path[k];
				pt.x = pt.x + xpos;
				pathxmod.push(pt);
			}
			
			allPaths.push(pathxmod);
		}
		pathdetected = false;
		mousedown = false;
		endpointreached = false;
		currPathCount = 0
		startHitPt = [];
		endHitPt = [];

		setupControlDots(context,0)
	}
	
	var drawPathNormal = function (context, inPath, lineWidth, strokeStyle) {
		currPath = inPath;
		if (typeof currPath !== "undefined") {
			var lto = currPath[0];
			context.beginPath();
			context.moveTo(lto.x, lto.y);
			
			context.lineWidth = lineWidth;
			context.lineCap = "round";
			context.strokeStyle = strokeStyle;
			currPathIndex = 1;
			for (var i = 0; i <= currPath.length; i++)  {
				drawSegWithoutAnimation(context, lineWidth, strokeStyle);
			}
		}
	}
	
	var drawSegWithoutAnimation = function(context, lineWidth, strokeStyle) {
		var p = currPath[currPathIndex];
		if (typeof p == "undefined") {
			return;
		}
		context.lineTo(p.x, p.y);
		context.stroke();
		currPathIndex = currPathIndex + 1;
		if (currPathIndex >= currPath.length) {
			context.closePath();
			pathIndex = pathIndex + 1;
			if (pathIndex >= allPaths.length) {
				return;
			}
			drawPathNormal(context, allPaths[pathIndex], lineWidth, strokeStyle);
		} 	
	}
	
	var getCharWidth = function (stokesize){
		var lpos = 0;
		var rpos = 0;
		for (var i=0; i<allPaths.length; i++ ){
			var currPath = allPaths[i];
			for (var k=0; k<currPath.length; k++){	
				var cp = currPath[k];
				if (lpos == 0){
					lpos = cp.x;
				}
				if (cp.x >= rpos){
					rpos = cp.x;
				}
				if (cp.x <= lpos){
					lpos = cp.x;
				}
			}
		}
		return (rpos-lpos)+(parseInt(stokesize)*1.5);
	}
	
	//Function to setup start and end point of the current path and also draw the start point
	var setupControlDots = function (context, currpos){
		var pathlen = allPaths[currpos].length;
		//set two variables which we can check if user has clicked on first point and last point
		startHitPt = [allPaths[currpos][0].x, allPaths[currpos][0].y];
		endHitPt = [allPaths[currpos][pathlen-1].x, allPaths[currpos][pathlen-1].y];
		//Draw the first 
		drawDot(context, startHitPt[0], startHitPt[1], cp_start_col);
	}

	var drawDot = function (context, x, y, color){
		context.beginPath();
		context.strokeStyle = color;
		context.lineWidth = lineWidth;
		context.moveTo(x, y);
		context.lineTo(parseInt(x)+1, parseInt(y));
		context.stroke();
		context.closePath();
	}
	
	//Check if the given point is inside a hit area
	var pointinRect = function (mouseX, mouseY, hitPT){
		//Create a rect of size hitrecdim + hitrecdim around the hitPt 
		var rect = [hitPT[0]-hitrecdim, hitPT[0]+hitrecdim, hitPT[1]-hitrecdim, hitPT[1]+hitrecdim]
		if ((mouseX>rect[0]) && (mouseX<rect[1])){
			if ((mouseY>rect[2]) && (mouseY<rect[3])){ 
				return true;
			}
		}
		
		return false;
	}
	
	//Function to draw the path upto the point where the mouse is pointing	
	var drawSegToHitPoint = function (currPath, lineWidth, endpos, strokeStyle) {
		var lto = currPath[0];
		context.beginPath();
		context.moveTo(lto.x, lto.y);
		context.lineWidth = lineWidth;
		context.lineCap = "round";
		context.strokeStyle = strokeStyle;
		
		for (var i = 0; i <= endpos; i++)  {
			var p = currPath[i];
			context.lineTo(p.x, p.y);
			context.stroke();
		}
		context.closePath();
	}


	var handleMouseDown = function (e){
		try {
			var touch = e.originalEvent.touches[0];
		} catch(e) {
			var touch = null;
		}
		
		var clientX = e.clientX;
		var clientY = e.clientY;
		if (touch && !e.clientX) {
			clientX = touch.pageX; 
		}
		if (touch && !e.clientY) {
			clientY = touch.pageY; 
		}
		
		mouseX=parseInt(clientX-offsetX);
		mouseY=parseInt(clientY-offsetY);
		
		//Check if you have clicked on the start point
		var startptHit = pointinRect(mouseX, mouseY, startHitPt);
		if(startptHit){
			pathdetected = true;
			//Draw the end point for the current path after the first point is clicked
			drawDot(context, endHitPt[0], endHitPt[1], cp_end_col);
		}
		mousedown = true;
	}
	
	var handleMouseMove = function(e) {
		try {
			var touch = e.originalEvent.touches[0];
		} catch(e) {
			var touch = null;
		}
		var clientX = e.clientX;
		var clientY = e.clientY;
		if (touch && !e.clientX) {
			clientX = touch.pageX; 
		}
		if (touch && !e.clientY) {
			clientY = touch.pageY; 
		}
		
		if (pathdetected && mousedown) {
			//If a path 
			mouseX=parseInt(clientX-offsetX);
			mouseY=parseInt(clientY-offsetY);
			currPath = allPaths[currPathCount];
			for (var i = 0; i < currPath.length; i++)  {
				var px1 = currPath[i].x - hitrecdim;
				var px2 = currPath[i].x + hitrecdim;
				var py1 = currPath[i].y - hitrecdim;
				var py2 = currPath[i].y + hitrecdim;
				//Check if user mouse is over the end point
				var endptHit = pointinRect(mouseX, mouseY, endHitPt);
				// Put your mousedown stuff here
				if(endptHit){
					//Now draw till the end of path again
					drawSegToHitPoint(currPath, lineWidth, currPath.length-1, pathcolor);
					pathdetected = false;
					mousedown = false;
					endpointreached = true;
					
					currPathCount = currPathCount + 1;
					if (currPathCount >= allPaths.length) {
						//Set the variable to 0 again as we have reached the last path of character
						currPathCount = 0;
						return "PATHEND";
					}
					//Now setup the variable for the next path 
					setTimeout(function() {endpointreached = false; setupControlDots(context, currPathCount);}, 1000);
					break;
				}
				//Check if we are still on a point inside the path
				if ((mouseX>px1) && (mouseX<px2)){
					if ((mouseY>py1) && (mouseY<py2)){
						drawSegToHitPoint(currPath, lineWidth, i, pathcolor);				
						break;
					}
				}
			}
		}
		return "";
	}

	var handleMouseUp = function (e) {
		if (mousedown) {
			mousedown = false;
			if (pathdetected && !endpointreached){
				//user is still drawing and end point is not reached
				//so we need to reset the path and draw the control points
				drawPathNormal(context, allPaths[currPathCount], lineWidth, strokeStyle);
				drawPathNormal(context, allPaths[currPathCount], lineWidth-2, "white");
				for (i = 0; i < currPathCount; i++) {
					drawPathNormal(context, allPaths[i], lineWidth, pathcolor);
				}
				setupControlDots(context, currPathCount);
				pathdetected = false;
			}
		}
	}
		
	var draw = function(context){
		drawPathNormal(context, allPaths[0], lineWidth, strokeStyle);
		pathIndex = 0;
		drawPathNormal(context, allPaths[0], lineWidth-2, "white");
	}
	
	return {
		init:init,
		draw:draw,
		getCharWidth:getCharWidth,
		setupControlDots:setupControlDots,
		handleMouseDown:handleMouseDown,
		handleMouseMove:handleMouseMove,
		handleMouseUp:handleMouseUp,
	}
}

var PTP_Word_Engine = function() {
	var word = "";
	var prevcharwidth = 0;
	var charobjs = [];
	var currCharObjIndex = 0;
	var currCharObj = null;
	var linewidth = 18;
	var showdot_delay = 500;
	
	var clearCharObjects = function() {
		for (var i = 0; i<charobjs.length; i++) {
			var obj = charobjs[i];
			delete(obj);
		}
		charobjs = [];
	}
	
	var render = function (canvas, word) {
		PATHLOADER.init();
		word = word;
		prevcharwidth = 0;
		currCharObjIndex = 0;
		clearCharObjects();
		clearContext(canvas);
		linewidth = $.trim(parseFloat($('.stroke-size').text()));
		
		for (w in word){
			var c = new CharObjConstructor(word[w], linewidth, 'black', 'blue');
			c.init(prevcharwidth);
			c.draw(context);
			var r = c.getCharWidth(linewidth);	
			prevcharwidth = prevcharwidth + r;	
			charobjs.push(c);
		}
		currCharObj = charobjs[currCharObjIndex];
		currCharObj.setupControlDots(context, 0);
	}
	
	var handleMouseMove = function(e) {
		
		if (currCharObj){
			var res = currCharObj.handleMouseMove(e);
			if (res == "PATHEND"){
				currCharObjIndex = currCharObjIndex + 1;
				if (currCharObjIndex >= charobjs.length){
					return; 
				}
				setTimeout(function() {
					currCharObj = charobjs[currCharObjIndex];
					currCharObj.setupControlDots(context, 0);
				}, showdot_delay);
				
			}
		}
	}

	var handleMouseUp = function (e) {
		if (currCharObj){
			currCharObj.handleMouseUp(e);
		}
	}

	var handleMouseDown = function (e){
		if (currCharObj){
			currCharObj.handleMouseDown(e);
		}
		mousedown = true;
	}
	
	var clearContext = function (canvas) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		var w = canvas.width;
		canvas.width = 1;
		canvas.width = w;
	}

	return {
		render: render,
		handleMouseDown: handleMouseDown,
		handleMouseMove: handleMouseMove,
		handleMouseUp: handleMouseUp,
	}
}();

$(document).ready(function(){
	if($('.ptp-presentation').length > 0 ) {
		var eID = $('.ptp-presentation').find('canvas').attr('id');
		var canvas = document.getElementById(eID);
		context = canvas.getContext("2d");
		
		canvas.width = $.trim(parseFloat($('.board-width').text()));
		canvas.height = $.trim(parseFloat($('.board-height').text()));
		
		//$(".drawtextbut").on("click", function(){
		// initialize input text and draw the path
		var text = $('span.drawtext').length> 0 ? $.trim($('span.drawtext').text()) : $(".drawtext").val();
		text = text.replace(/ /g, '');
		$('.drawinput').val(text);
		PTP_Word_Engine.render(canvas, text);
		//});
		
		var canvasOffset=$("#"+eID).offset();
		offsetX=canvasOffset.left;
		offsetY=canvasOffset.top;
		
		var canvasel = $('#myCanvas').get(0);
		//Handle the mouse events to draw 
		/* $(canvasel).mousedown(function(e){
			PTP_Word_Engine.handleMouseDown(e);
		});
		
		$(canvasel).mousemove(function(e){
			PTP_Word_Engine.handleMouseMove(e);
		});
		
		$(canvasel).mouseup(function(e){
			PTP_Word_Engine.handleMouseUp(e);
		});*/
		
		$(canvasel).on('touchstart mousedown', function(e){
			PTP_Word_Engine.handleMouseDown(e);
			e.preventDefault();
		});
		
		$(canvasel).on('touchmove mousemove', function(e){
			PTP_Word_Engine.handleMouseMove(e);
			e.preventDefault();
		});
		
		$(canvasel).on('touchend mouseup', function(e){
			PTP_Word_Engine.handleMouseUp(e);
			e.preventDefault();
		});
		
		
		$(".drawtextbut").on("click", function(){
			var text = $('.drawinput').val(); //$('span.drawtext').length> 0 ? $.trim($('span.drawtext').text()) : $(".drawtext").val();
			text = text.replace(/ /g, '');
			PTP_Word_Engine.render(canvas, text);
		});
		
	}
});


