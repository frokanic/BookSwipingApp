var AIE = AIE || {};

AIE.StickyBar = {

	settings: {},
	
	init:function() {

		this.settings.lessonWrapper = $('.Lesson-rw');
		this.settings.toolbarOuterWrapper = $('.cs_toolbar_outer_wrapper');
		this.settings.toolbarInnerWrapper = $('.cs_toolbar_wrapper');
		this.settings.toolbarPopup = this.settings.toolbarOuterWrapper.find('.cs_toolbar_tab_content');
		this.settings.notesBox = this.settings.toolbarOuterWrapper.find('.notes_textbox');
		this.settings.lessonWrapper.outerWidthMargin = this.settings.lessonWrapper.outerWidth(true);
		this.settings.lessonWrapper.outerWidth = this.settings.lessonWrapper.outerWidth();
		this.settings.lessonWrapper.innerWidth = this.settings.lessonWrapper.innerWidth();
		this.settings.lessonWrapper.offset = this.settings.lessonWrapper.offset();
		this.settings.lessonWrapper.border = (this.settings.lessonWrapper.outerWidth - this.settings.lessonWrapper.innerWidth) / 2;
		this.settings.animationIsRunning = false;

		let toolbarLeftOffset = this.settings.lessonWrapper.offset.left + this.settings.lessonWrapper.border;

		// Set left offset and max width for toolbar since fixed will be relative to viewport
		this.settings.toolbarInnerWrapper.css('left',toolbarLeftOffset);
		this.settings.toolbarInnerWrapper.css('maxWidth',this.settings.lessonWrapper.innerWidth);

		// Set height on outer wrapper so when inner wrapper is fixed its space is still reserved
		let toolbarHeight = this.settings.toolbarInnerWrapper.outerHeight();
		this.settings.toolbarOuterWrapper.outerHeight(toolbarHeight);

		// Replace &nbsp; (which IGP adds on empty div) so that we can use the :empty pseudoclass
		// to display the placeholder inside the notes textbox
		this.settings.notesBox.text(this.settings.notesBox.text().replace(/\u00A0/g, ''));

		this.calculateLeftOffset();
		
		this.eventHandler();
		
	},

	eventHandler: function() {

		var self = this;

		/*	
		 *  When user clicks the toolbar arrow fire this event
		 */
		$('.cs_toolbar_toggle_btn').on('click', function() {

			// If an animation is in progress ignore extra clicks
			if(self.settings.animationIsRunning) return;

			// Toggle the glow effect
			$(this).toggleClass('cs_glow');

			// If toolbar was hidden expand it
			if($('.cs_toolbar_tabs_wrapper').hasClass('no_display')) {
				$('.cs_toolbar_tabs_wrapper').removeClass('no_display');
			} else { // If it was already expanded
				// If there was an active popup close it first using the zoom out effect then close toolbar
				// and make the tab inactive
				if($('.cs_active_tab').length === 1) {
					self.settings.animationIsRunning = true;
					$('.cs_active_tab').find('.cs_toolbar_tab_content').addClass('cs_zoomOut cs_hideBar');
					$('.cs_active_tab').removeClass('cs_active_tab');
				} else { // If no active tab just close the toolbar
					$('.cs_toolbar_tabs_wrapper').addClass('no_display');
				}
			}

		});

		/*	
		 *  When user clicks a toolbar tab fire this event
		 *
		 *	When user clicks an active tab it becomes inactive.
		 *	When user clicks a new tab the previously active tab becomes inactive
		 *
		 */
		$('.cs_toolbar_tab_header').on('click', function() {

			if(self.settings.animationIsRunning) return;

			let tab_parent = $(this).parent();
			let current_tab_content = tab_parent.children('.cs_toolbar_tab_content');

			// If current tab has a content popup (video redirect does not have a popup)
			if(tab_parent.children('.cs_toolbar_tab_content').length == 1) { 

				// Reset all media
				self.resetMediaPlayers($('.cs_active_tab'));

				// Check if user clicked same tab
				if(tab_parent.hasClass('cs_active_tab')) {

					// Reset current tab
					tab_parent.removeClass('cs_active_tab');

					// Close the popup using the Zoom Out effect
					self.settings.animationIsRunning = true;
					current_tab_content.addClass('cs_zoomOut');

				} else { // If user clicked a new tab

					// If there is already an active popup 
					let isFirstPopup = $('.cs_active_tab').length == 1 ? false : true;

					// Hide previously opened tab if any
					self.resetActivePopup();

					// Mark active tab
					tab_parent.addClass('cs_active_tab');

					self.settings.animationIsRunning = true;

					// Display current tab content
					if(isFirstPopup) { // If its the first popup use the zoom in effect
						current_tab_content.show();
						current_tab_content.addClass('cs_zoomIn');
					} else { // If there was already an active popup alternate using Fade In / Fade Out effect
						current_tab_content.fadeIn(500, function(){
							self.settings.animationIsRunning = false;
						});
					}

					let correct_height = tab_parent.find('.cs_toolbar_tab_content_header').outerHeight();
					$('.cs_toolbar_tab_content_body').css('height','calc(100% - ' + correct_height + 'px)');

				}
			}

		});

		/*
		 *	Css Animation is used to create the Zoom In / Zoom Out effect
		 *  When the animation ends this event is fired
		 */
		$('.cs_toolbar_tab_content').on('animationend', function() {
			if($(this).hasClass('cs_zoomOut')) {
				$(this).hide();
				$(this).removeClass('cs_zoomOut');
				if($(this).hasClass('cs_hideBar')) {
					$(this).removeClass('cs_hideBar');
					$('.cs_toolbar_tabs_wrapper').addClass('no_display');
				}
			}
			if($(this).hasClass('cs_zoomIn')) {
				$(this).removeClass('cs_zoomIn');
			}
			self.settings.animationIsRunning = false;
		});

		/*	
		 *  When user clicks the X button close the tab
		 */
		$('.cs_toolbar_tab_wrapper .close_btn').on('click', function() {

			self.settings.animationIsRunning = true;

			// Reset all media
			self.resetMediaPlayers($(this).parents('.cs_toolbar_tab_wrapper'));

			// Reset active tab
			$(this).parents('.cs_toolbar_tab_wrapper').removeClass('cs_active_tab');

			// Close the popup using the Zoom Out effect
			$(this).parents('.cs_toolbar_tab_content').addClass('cs_zoomOut'); 
		});


		/*	
		 *  When user focuses out of notes box make it empty if no text
		 */
		$(".cs_toolbar_tab_wrapper .notes_textbox").focusout(function(){
	        var element = $(this);        
	        if (!element.text().replace(" ", "").length) {
	            element.empty();
	        }
	    });

		/*
		 *	When user scrolls do the following:
		 *  -Check if toolbar should stack above footer
		 *  -Check if toolbar should follow the scroll
		 *  -Update Popup top property
		 */
		$(document).on('scroll', function() {
			// Check whether the toolbar should stack above footer or keep moving with scroll
		    self.checkOffset();
		    // Update Popup top css property
			self.updatePopupTopOffset();
		});

		/*
		 *	When the viewport gets resized do the following:
		 *  -Check if toolbar should stack above footer
		 *  -Check if toolbar should follow the scroll
		 *  -Recalculate left offset to center popup correctly
		 */
		$(window).on('resize', function() {
			// Check whether the toolbar should stack above footer or keep moving with scroll
		    self.checkOffset();
		    // Center Popup - calculate left positioning
			self.calculateLeftOffset();
			// Update Popup top css property
			self.updatePopupTopOffset();
		});
		
	},

	/*
	 *	Toolbar originally has the fixed position class
	 *  When the page first loads, if there is no scroll 
	 *  on the page make toolbar static instead of fixed
	 */
	initButtonPosition: function() {
		if($(document).scrollTop() + window.innerHeight > $('.footer1').offset().top) {
	        this.settings.toolbarInnerWrapper.removeClass('fixed_pos');
	    }
	    // Toolbar has initially visibility hidden. Visibility is set to visible
	    // only after its correct position is calculated to avoid having it shown 
	    // at the wrong place for a while when page loads
	    this.settings.toolbarInnerWrapper.css('visibility','visible');
	},

	calculateLeftOffset: function() {
		// Center Popup - calculate left positioning
		let left = 0;
		let toolbarLeftOffset = this.settings.lessonWrapper.offset.left + this.settings.lessonWrapper.border;
		if (window.matchMedia('(max-width: 1024px)').matches) {
		    left = 50 + '%';
		} else {
			left = 50 * this.settings.lessonWrapper.outerWidthMargin / 100 + toolbarLeftOffset;
		}

		this.settings.toolbarPopup.css('left',left);
	},

	resetMediaPlayers: function(currentTab) {

		// Pause and reset media when popup closes 
		let media = currentTab.find('.media-rw');

		media.each(function(index) {

			if($(this).children('video').length > 0) {
				$(this).children('video').each(function(index, video) {
					video.pause();
					video.currentTime = 0
				})
			}
			
			if($(this).children('audio').length > 0) {
				$(this).children('audio').each(function(index, audio) {
					audio.pause();
					audio.currentTime = 0
				})
			}

		})
	},

	resetActivePopup: function() {
		var self = this;
		
		$('.cs_active_tab').find('.cs_toolbar_tab_content').fadeOut(500, function(){
			self.settings.animationIsRunning = false;
		});
		$('.cs_active_tab').removeClass('cs_active_tab');
	},

	/*
	 *	Toolbar has a fixed position when user scrolls
	 *  and a static position when user does not need to scroll
	 *  or has reached the end of the document and toolbar needs to
	 *  rest right above the footer which is its static position
	 */
	checkOffset: function() {

		if($('.cs_toolbar_wrapper').offset().top + $('.cs_toolbar_wrapper').height() >= $('.footer1').offset().top){//-$('.cs_toolbar_wrapper').height()) {
	        $('.cs_toolbar_wrapper').removeClass('fixed_pos');
		}

		// restore when you scroll up
	    if($(document).scrollTop() + window.innerHeight < $('.footer1').offset().top) {
	        $('.cs_toolbar_wrapper').addClass('fixed_pos'); 
	    }
    },

    updatePopupTopOffset: function() {
    	
    	let toolbarOuterWrapperOffsetFromTop = $('.cs_toolbar_outer_wrapper').offset().top;
	    let popupCssTop = $('.cs_toolbar_wrapper').offset().top - $(document).scrollTop();
	    $('.cs_toolbar_tab_content').css('top', 'calc( 0.5 * ' + popupCssTop + 'px )');

    },

};

$(document).ready(function() {
	try{
		// STICKY BAR - If sticky Bar is found Initialize it
		if($('.cs_toolbar_wrapper').length>0) {
			AIE.StickyBar.init();
		}
	}catch(e){
		console.log(e);
	}
});

$(window).load(function() {
	try{
		// STICKY BAR - If sticky Bar is found Initialize it
		// window load waits for all media which is important for some calculations
		if($('.cs_toolbar_wrapper').length>0) {
			// Check if stickybar should be fixed or static
			AIE.StickyBar.initButtonPosition();
			// Update top css property of popup
			AIE.StickyBar.updatePopupTopOffset();
		}
	}catch(e){
		console.log(e);
	}
});