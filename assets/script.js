var playerVasco, view, intervalTimer;

var btnPlay;

var seekBg, seekFill, timeDrag, tooltip;

var volBtn, slider, sliderVol, volDrag, lastVol;

var curTime, durTime;

var fullscreen;

function meuPlayer(Vasco) {
    if (playerVasco !== Vasco) {
        playerVasco = Vasco;
        //Set object References
        view = playerVasco.querySelector('.video-view');
        btnPlay = playerVasco.querySelector('#playBtn');
        seekBg = playerVasco.querySelector(".prog-bar");
        seekFill = playerVasco.querySelector(".prog-loaded");
        curTime = playerVasco.querySelector(".curTime");
        durTime = playerVasco.querySelector(".totalTime");
        tooltip = playerVasco.querySelector(".prog-tooltip");
        volBtn = playerVasco.querySelector('#muteBtn');
        slider = playerVasco.querySelector('.volume-window');
        sliderVol = playerVasco.querySelector('.volumeTrack');
        fullscreen = playerVasco.querySelector('#fullscreen');
        
        btnPlay.addEventListener('click', playVideo);
        seekBg.addEventListener('mousedown', barControlOne);
        seekBg.addEventListener('mouseup', barControlTwo);
        seekBg.addEventListener('mousemove', barControlThree);
        seekBg.addEventListener('mousemove', progToti);
        volBtn.addEventListener('click', mute);
        
        slider.addEventListener('mousedown', knobClick);
        slider.addEventListener('mousemove', knobMove);
        slider.addEventListener('mouseup', knobRelease);
        
        
        fullscreen.addEventListener('click', expandPlayer);
        
        playerVasco.addEventListener('mouseup', knobRelease);
        playerVasco.addEventListener('mouseup', barControlTwo);
        
        lastVol = 100;
        volDrag = false;
        intervalTimer = setInterval(seekTime, 100);
        
        view.addEventListener('ended', resetVideo);
        timeDrag = false;
    }
}

function playVideo() {
    if (view.paused) {
        view.play();
        btnPlay.innerHTML = "pause";
    }else{
        view.pause();
        btnPlay.innerHTML = "play_arrow";
  }  
}

function resetVideo(){
    
    btnPlay.innerHTML = "play_arrow";
    view.currentTime = 0;

}

function barControlOne(e) {
    timeDrag = true;
    updateBar(e.pageX);
}

function barControlTwo(e) {
    if(timeDrag){
    timeDrag = false;
    updateBar(e.pageX);
    }
}

function barControlThree(e){
    if(timeDrag){
    timeDrag = true;
    updateBar(e.pageX);
    }
}

function updateBar(x) {
    var maxduration = view.duration;
    var offset = seekBg.getBoundingClientRect();
    var position = (x - offset.left);

    var percentage = (100 * (position / seekBg.offsetWidth));
        if(percentage > 100) {
            percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
        seekFill.style.width = percentage + '%';
        view.currentTime = maxduration * percentage / 100;
}

function progToti(e) {
    var pbX = seekBg.offsetWidth;
    var elX = e.offsetX;
    var hoverValue = ~~((elX/pbX)*view.duration);
    var hoverHours = ~~(hoverValue / 3600);
    var hoverMins = ~~((hoverValue - (hoverHours * 3600)) / 60);
    var hoverSecs = hoverValue - (hoverHours * 3600) - (hoverMins * 60);
    
    // if (hoverHours < 10) {hoverHours = "0"+hoverHours;}
    if (hoverMins < 10) {
        hoverMins = "0"+hoverMins;
    }
    if (hoverSecs < 10) {
        hoverSecs = "0"+hoverSecs;
    }
    tooltip.innerHTML = hoverMins + ':' + hoverSecs;
    if(Math.round((1-(hoverValue/view.duration)) * (seekBg.offsetWidth)) + 3 < tooltip.offsetWidth/2) {
        tooltip.style.left = (seekFill.offsetWidth - tooltip.offsetWidth) + "-px";
    } else if (Math.round((hoverValue/view.duration) * (seekBg.offsetWidth) + 3) < tooltip.offsetWidth / 2) {
        tooltip.style.left = "px";
    } else {
        tooltip.style.left = ~~((hoverValue / view.duration) * (seekBg.offsetWidth) + 3 - tooltip.offsetWidth / 2) + "px";
    }      
}   

function seekTime() {
    var width = (view.currentTime / view.duration) * 100;
    seekFill.style.width = width + '%';
    
    var sec_num = ~~(view.currentTime); // don't forget the second param
    var hours   = ~~(sec_num / 3600);
    var minutes = ~~((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
    if (hours   < 10) {
        hours   = "0"+hours;
    }
    if (minutes < 10) {
        minutes = "0"+minutes;
    }
    if (seconds < 10) {
        seconds = "0"+seconds;  
    }
   
    // The durtime
    var sec_dur = ~~(view.duration); // don't forget the second param
    var hoursdur   = ~~(sec_dur / 3600);
    var minutesdur = ~~((sec_dur - (hoursdur * 3600)) / 60);
    var secondsdur = sec_dur - (hoursdur * 3600) - (minutesdur * 60);

    if (hoursdur   < 10) {
        hoursdur   = "0"+hoursdur;
    }
    if (minutesdur < 10) {
        minutesdur = "0"+minutesdur;
    }
    if (secondsdur < 10) {
        secondsdur = "0"+secondsdur;
    }
        durTime.innerHTML = minutesdur+':'+secondsdur; 
        curTime.innerHTML = minutes+':'+seconds;
}

function mute() {
    if(view.volume > 0) {
        lastVol = view.volume;
        view.volume = 0;
        sliderVol.style.width = 0 + "%";
        volBtn.innerHTML = 'volume_off';
        
    }else{
        view.volume = lastVol;
        volBtn.innerHTML = 'volume_up';
        sliderVol.style.width = lastVol * 100 + "%";
    }
}

function knobClick(ev) {
    volDrag = true;
    showVolume(ev.pageX);
}

function knobMove(ev) {
    if(volDrag){
    volDrag = true;
    showVolume(ev.pageX);
    }
}

function knobRelease(ev) {
    if(volDrag){
    volDrag = false;
    showVolume(ev.pageX);
    }
}

function showVolume(event){
    var volW = slider.getBoundingClientRect();
    var basePos = event - volW.left;
    var volPos = (100 * (basePos / slider.offsetWidth));
    if(volPos >100 ){
        volPos = 100
        sliderVol.style.width = 100 + "%";
    }else if(volPos <= 0 ){
        volPos = 0;
        sliderVol.style.width = 0 + "%";
        volBtn.innerHTML = 'volume_off';
    }else{
        sliderVol.style.width = volPos+ "%";
        volBtn.innerHTML = 'volume_up';
    }
    view.volume = volPos / 100;
}


function expandPlayer(){
    if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
    if (playerVasco.requestFullscreen) {
        playerVasco.requestFullscreen();
    } else if (playerVasco.msRequestFullscreen) {
        playerVasco.msRequestFullscreen();
    } else if (playerVasco.mozRequestFullScreen) {
        playerVasco.mozRequestFullScreen();
    } else if (playerVasco.webkitRequestFullscreen) {
        playerVasco.webkitRequestFullscreen();
    }   
    fullscreen.innerHTML = "fullscreen_exit";
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        fullscreen.innerHTML = "fullscreen";
    }

}

document.addEventListener('keydown',function(e){
    
	switch (e.keyCode){
        case 32:
          playVideo();
        break;
        case 77:
            mute();
        break;
        case 39:
            if (view.currentTime < view.duration) {
                view.currentTime += 5;
            }
        break;
        case 37:
            if (view.currentTime >= 0 || view.currentTime == view.duration) {
                view.currentTime -= 5;
            }
        break;
        case 48:
            view.currentTime = 0;
        break;
        case 70:
            expandPlayer();
        break;
    }
});