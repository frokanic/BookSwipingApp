function isiPhone() {
    try {
        return (
            //Detect iPhone
            (navigator.platform.indexOf("iPhone") != -1) ||
            //Detect iPod
            (navigator.platform.indexOf("iPad") != -1)
        );
    } catch (err) {
        return false;
    }
}

var audios = {};

//Register the event handler for audio play and pause
$(document).ready(function() {
    var content_orignal = $("#rw-block-general_47748-113481101").html();
    $('.audio-inline-rw img').addClass('play');
    $('.audio-block-rw img').addClass('play');
    disableAssociatedQAA();

    if (isiPhone() == false) {
        $('.audio-inline-rw').bind("click", function(e) {
            var audio_parobj = $(this);
            var par_id = $(this).attr('id');
            var $target = $(this).find('img');

            // first pause all the playing audios in the page 
            $('.audio-inline-rw').each(function() {
                if ($target.hasClass('stop')) {

                } else {
                    // do not pause if an audio object has property for "multi"
                    var multi = $(this).attr('data-audio');
                    if (multi != 'multi') {
                        var a = $(this).find('audio').get(0);
                        a.pause();
                        $(this).find('img').removeClass('stop').addClass('play');
                    }
                }
            });

            var audio_obj = $(this).find('audio').get(0);
            $(audio_obj).bind('timeupdate', function(event) {
                // $('.audio-inline-rw').find('img').removeClass("stop").addClass("play"); // updated by Mahendra
                var curr_time = $(this).get(0).currentTime;
                var duration = $(this).get(0).duration;
                if (curr_time >= duration) {
                    //audio finished playing. set the class
                    $(this).parent('.audio-inline-rw').find('img').removeClass("stop").addClass("play");
                    if (audios.hasOwnProperty(par_id) == false) {
                        enableAssociatedQAA(audio_parobj);
                        audios[par_id] = true;
                        saveAudioState();
                    }
                    $(audio_obj).unbind('timeupdate');
                } else {
                    //$(this).parent('.audio-inline-rw').find('img').removeClass("play").addClass("stop");
                }
            });

            if (audio_obj.play) {
                if ($target.hasClass('play')) {
                    //if(audio_obj.currentTime) audio_obj.currentTime=0;
                    audio_obj.play();
                    $target.removeClass("play").addClass("stop");
                } else {
                    $(audio_obj).unbind('timeupdate');
                    audio_obj.pause();
                    $target.removeClass("stop").addClass("play");
                }
            }
        });

    }



    if (isiPhone()) {

        $('.audio-inline-rw').live("touchend  ", function(e) {
            var audio_parobj = $(this);
            var par_id = $(this).attr('id');
            var $target = $(this).find('img');

            // first pause all the playing audios in the page 
            $('.audio-inline-rw').each(function() {
                if ($target.hasClass('stop')) {

                } else {
                    // do not pause if an audio object has property for "multi"
                    var multi = $(this).attr('data-audio');
                    if (multi != 'multi') {
                        var a = $(this).find('audio').get(0);
                        a.pause();
                        $(this).find('img').removeClass('stop').addClass('play');
                    }
                }
            });

            var audio_obj = $(this).find('audio').get(0);
            $(audio_obj).bind('timeupdate', function(event) {
                var curr_time = $(this).get(0).currentTime;
                var duration = $(this).get(0).duration;
                if (curr_time >= duration) {
                    //audio finished playing. set the class
                    $(this).parent('.audio-inline-rw').find('img').removeClass("stop").addClass("play");
                    if (audios.hasOwnProperty(par_id) == false) {
                        enableAssociatedQAA(audio_parobj);
                        audios[par_id] = true;
                        saveAudioState();
                    }
                    $(audio_obj).unbind('timeupdate');
                } else {
                    //$(this).parent('.audio-inline-rw').find('img').removeClass("play").addClass("stop");
                }
            });

            if (audio_obj.play) {
                if ($target.hasClass('play')) {
                    if (audio_obj.currentTime) audio_obj.currentTime = 0;
                    audio_obj.play();
                    $target.removeClass("play").addClass("stop");
                } else {
                    $(audio_obj).unbind('timeupdate');
                    audio_obj.pause();
                    $target.removeClass("stop").addClass("play");
                }
            }
        });

        $('.audio-block-rw').live("touchend  ", function(e) {
            var audio_parobj = $(this);
            var par_id = $(this).attr('id');
            var $target = $(this).find('img');

            // first pause all the playing audios in the page 
            $('.audio-block-rw').each(function() {
                if ($target.hasClass('stop')) {

                } else {
                    // do not pause if an audio object has property for "multi"
                    var multi = $(this).attr('data-audio');
                    if (multi != 'multi') {
                        var a = $(this).find('audio').get(0);
                        a.pause();
                        $(this).find('img').removeClass('stop').addClass('play');
                    }
                }
            });

            var audio_obj = $(this).find('audio').get(0);

            $(audio_obj).bind('timeupdate', function(event) {
                var curr_time = $(this).get(0).currentTime;
                var duration = $(this).get(0).duration;
                if (curr_time >= duration) {
                    //audio finished playing. set the class
                    $(this).parent('.audio-block-rw').find('img').removeClass("stop").addClass("play");
                    if (audios.hasOwnProperty(par_id) == false) {
                        enableAssociatedQAA(audio_parobj);
                        audios[par_id] = true;
                        saveAudioState();
                    }
                    $(audio_obj).unbind('timeupdate');
                } else {
                    //$(this).parent('.audio-block-rw').find('img').removeClass("play").addClass("stop");
                }
            });

            if (audio_obj.play) {
                if ($target.hasClass('play')) {
                    if (audio_obj.currentTime) audio_obj.currentTime = 0;
                    audio_obj.play();
                    $target.removeClass("play").addClass("stop");
                } else {
                    $(audio_obj).unbind('timeupdate');
                    audio_obj.pause();
                    $target.removeClass("stop").addClass("play");
                }
            }
        });

    }

    if (isiPhone() == false) {
        $('.audio-block-rw').bind("click", function(e) {
            var $target = $(this).find('img');
            var audio_parobj = $(this);
            var par_id = $(this).attr('id');
            // first pause all the playing audios in the page 
            $('.audio-block-rw').each(function() {
                if ($target.hasClass('stop')) {

                } else {
                    // do not pause if an audio object has property for "multi"
                    var multi = $(this).attr('data-audio');
                    if (multi != 'multi') {
                        var a = $(this).find('audio').get(0);
                        a.pause();
                        $(this).find('img').removeClass('stop').addClass('play');
                    }
                }
            });
            if (!$(this).hasClass('track')) {
                if ($('.audio-block-rw').hasClass('track')) {
                    $('.track').each(function(index) {
                        var audio_track = $(this).find('audio').get(0);
                        $(audio_track).unbind('timeupdate');
                        audio_track.pause();
                        $(this).removeClass('track').addClass("play");
                        $(this).find('img').removeClass('stop').addClass("play");

                    });
                }
            }
            var audio_obj = $(this).find('audio').get(0);

            $(audio_obj).bind('timeupdate', function(event) {
                var curr_time = $(this).get(0).currentTime;
                var duration = $(this).get(0).duration;

                if (curr_time >= duration) {
                    //audio finished playing. set the class
                    $(this).parent('.audio-block-rw').find('img').removeClass("stop").addClass("play");
                    if (audios.hasOwnProperty(par_id) == false) {
                        enableAssociatedQAA(audio_parobj);
                        audios[par_id] = true;
                        saveAudioState();
                    }
                    $(audio_obj).unbind('timeupdate');
                } else {
                    //$(this).parent('.audio-block-rw').find('img').removeClass("play").addClass("stop");
                }
            });


            if (audio_obj.play) {
                if ($target.hasClass('play')) {
                    if (audio_obj.currentTime) audio_obj.currentTime = 0;
                    audio_obj.play();
                    $target.removeClass("play").addClass("stop");
                    $target.parent(".audio-block-rw").addClass("track");
                } else {
                    $(audio_obj).unbind('timeupdate');
                    audio_obj.pause();
                    $target.removeClass("stop").addClass("play");
                    $target.parent(".audio-block-rw").removeClass("track");
                }
            }
        });
    }




    if (isiPhone()) {
        //Click event stops working on ipad once iscroll takes over
        //So implementing a touchend to handle this
        //$('.audio-block-rw').unbind("touchend");
        $('.audio-block-rw').live("touchend  ", function(e) {
            var audio_obj = $(this).find('audio').get(0);
            var $target = $(this).find('img');
            if (!$target.parent(".audio-block-rw").hasClass('track')) {
                playNewTrack($(this), audio_obj, $target);
            } else {
                playNewTrack($(this), audio_obj, $target);
            }
        }, false);
    }

    $('.reset-audio').click(function() {
        resetAudioState();
    });

    // added below function by Mahendra 
    $("audio").on("play", function() {
        $('.audio-inline-rw').find('img').removeClass("stop").addClass("play");
        $(this).parent('.audio-inline-rw').find('img').removeClass("play").addClass("stop");
        $("audio").not(this).each(function(index, audio) {
                if (audio.readyState != 0) {
                    audio.pause();
                    //audio.currentTime = 0;
                }
            //audio.bind('timeupdate');
            var currAudioId = audio.id;
            $('#' + currAudioId).parent('.audio-inline-rw').find('img').removeClass("stop").addClass("play");
        });
    });
});

function playNewTrack(trackImg, audio_obj, $target) {
    var audio_parobj = $(audio_obj).parents('.audio-block-rw');
    var par_id = $(audio_parobj).attr('id');
    $(audio_obj).bind('timeupdate', function(event) {
        var curr_time = $(this).get(0).currentTime;
        var duration = $(this).get(0).duration;
        if (curr_time >= duration) {
            //audio finished playing. set the class
            $(this).parent('.audio-block-rw').find('img').removeClass("stop").addClass("play");
            if (audios.hasOwnProperty(par_id) == false) {
                enableAssociatedQAA(audio_parobj);
                audios[par_id] = true;
                saveAudioState();
            }
            $(audio_obj).unbind('timeupdate');
        } else {
            $(this).parent('.audio-block-rw').find('img').removeClass("play").addClass("stop");
        }
    });

    if ($target.hasClass('play')) {
        audio_obj.play();
        console.log("play  ")
        $target.removeClass("play").addClass("stop");
        $target.parent(".audio-block-rw").addClass("track previous");
    } else {
        $(audio_obj).unbind('timeupdate'); //alert("iui")
        audio_obj.pause();
        console.log("stop ")
        $target.removeClass("stop").addClass("play");
        $target.parent(".audio-block-rw").removeClass("track ");
    }

    return false;
}

//Plays a audio specified by audioref. 
//audio ref must be the id of a existing <audio> tag
//button represent the DOM element of object that called this function
function playAudio(button, audioref) {
    var audio_obj = $('#' + audioref).get(0);
    if (audio_obj.paused) {
        audio_obj.play();
        $(button).removeClass("playsound").addClass("pausesound");
    } else {
        audio_obj.pause();
        audio_obj.currentTime = 0;
        $(button).removeClass("pausesound").addClass("playsound");
    }
}


function disableAssociatedQAA() {
    $('.audio-inline-rw, .audio-block-rw').each(function() {
        var associated = $(this).attr('data-qaa-associate');
        if (associated) {
            var qaas = associated.split(',');
            for (var i = 0; i < qaas.length; i++) {
                $('#' + $.trim(qaas[i])).find('.buttons-rw .check').attr('disabled', 'true');
            }
        }
    });
    loadAudioState();
}

function enableAssociatedQAA(obj) {
    var associated = $(obj).attr('data-qaa-associate');
    if (associated) {
        var qaas = associated.split(',');
        for (var i = 0; i < qaas.length; i++) {
            $('#' + $.trim(qaas[i])).find('.buttons-rw .check').removeAttr('disabled');
        }
    }
}

// Function to store the result of the user in local storage
function saveAudioState() {
    var uname = getUniqueName();
    if ("localStorage" in window && window["localStorage"] != null) {
        localStorage.setItem(uname, JSON.stringify(audios));
    }


    return;
}

function loadAudioState() {
    var uname = getUniqueName();
    if ("localStorage" in window && window["localStorage"] != null) {
        var retrievedStates = localStorage.getItem(uname);
	audios = JSON.parse(retrievedStates);
    }
    
    if (retrievedStates) {
        // do nothing
    } else {
        audios = {};
    }
    for (ele in audios) {
        var obj = $('#' + ele);
        enableAssociatedQAA(obj);
    }
}

function resetAudioState() {
    var uname = getUniqueName();
    if ("localStorage" in window && window["localStorage"] != null) {
        window.localStorage.removeItem(uname);
    }
    return;
}

function getUniqueName() {
    // we have local storage saving problem on the AZARDI IOS Reader from ACF
    var acf_bookid = '';
    try {
        acf_bookid = key; // key variable is not defined on this js, this defined on iOS reader of ACF and it mean to give Book ID and Account ID
    } catch (e) {
        acf_bookid = 'aie';
    }
    var path = window.location.pathname;
    var solitnames = path.split('/');
    var pagename = solitnames[solitnames.length - 1];
    var uniquename = pagename + "::" + acf_bookid + '_audio';
    return uniquename;
}

audio_state_tracker = function() {
    return {
        pauseCurrentActiveAudio: function() {},
        setActiveAudio: function() {},
        stopActiveAudio: function() {},
    }
}();


//Plays a audio specified by audioref. Does not handle button state
function playSFX(button, audioref) {
    var audio_obj = $('#' + audioref).get(0);
    if (audio_obj.currentTime) audio_obj.currentTime = 0;
    audio_obj.play();
}