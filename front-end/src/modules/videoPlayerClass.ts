import AccessibilityInterface from './models/accessibilityInterface';
import VolumeSlider from './volumeSliderClass';
import VolumeSliderInterface from './models/volumeSliderInterface';
import TimeSliderInterface from './models/timeSliderInterface';
import TimeSlider from './timeSliderClass';
import VideoPlayerInterface from './models/videoPlayerInterface';

export default class VideoPlayer implements VideoPlayerInterface {
    accessibility: AccessibilityInterface;
    node: HTMLElement;
    language: string | null;
    background: HTMLElement | null;
    fullScreenAlert: HTMLElement | null;
    mainPlayButton: HTMLElement | null;
    video: HTMLVideoElement | null;
    controlBar: HTMLElement | null;
    playButton: HTMLElement | null | undefined;
    timeSliderContainer: HTMLElement | null | undefined;
    timeSliderThumb: HTMLElement | null | undefined;
    timeSlider: TimeSliderInterface | null | undefined;
    currentTimeElement: HTMLElement | null;
    maxTimeElement: HTMLElement | null;
    volumeContainer: HTMLElement | null | undefined;
    volumeButton: HTMLElement | null | undefined;
    volumeSliderContainer: HTMLElement | null | undefined;
    volumeSliderThumb: HTMLElement | null | undefined;
    volumeSlider: VolumeSliderInterface |null | undefined;
    fullScreenButton: HTMLElement | null;
    fullScreenIcon: HTMLElement | null | undefined;
    fullScreenExitIcon: HTMLElement | null | undefined;
    videoFocusElement: HTMLElement | null;
    isFullScreenActive: boolean;
    controlBarHide: any;

    constructor(videoPlayer:HTMLElement, accessibility:AccessibilityInterface) {
        this.accessibility = accessibility;
        this.node = videoPlayer;
        this.language = document.documentElement.getAttribute('lang');
        this.background = document.querySelector('.portfolios-video-player_background');
        this.fullScreenAlert = this.node.querySelector('.portfolios-video-player_full-screen-alert');
        this.mainPlayButton = this.node.querySelector('.portfolios-video-player_initial-play');
        this.video = this.node.querySelector('video');
        this.controlBar = this.node.querySelector('.portfolios-video-player_control-bar');
        this.playButton = this.controlBar?.querySelector('.video-play');
        this.timeSliderContainer = this.controlBar?.querySelector('.video-time-line');
        this.timeSliderThumb = this.timeSliderContainer?.querySelector('.slider_thumb');
        this.currentTimeElement = this.node.querySelector('.video-controls_control-bar_current-time');
        this.maxTimeElement = this.node.querySelector('.video-controls_control-bar_max-time');
        this.volumeContainer = this.controlBar?.querySelector('.portfolios-video-player_control-bar_volume-container');
        this.volumeButton = this.controlBar?.querySelector('.video-volume-button');
        this.volumeSliderContainer = this.controlBar?.querySelector('.video-volume');
        this.volumeSliderThumb = this.volumeSliderContainer?.querySelector('.slider_thumb');
        this.fullScreenButton = this.node.querySelector('.portfolios-video-player_control-bar_full-screen');
        this.fullScreenIcon = this.fullScreenButton?.querySelector('.full-screen-svg');
        this.fullScreenExitIcon = this.fullScreenButton?.querySelector('.full-screen-exit-svg');
        this.videoFocusElement = this.node.parentElement;

        this.isFullScreenActive = false;
        this.controlBarHide = undefined;

        this.initialize = this.initialize.bind(this);
        this.playVideo = this.playVideo.bind(this);
        this.stopVideo = this.stopVideo.bind(this);
        this.handleClickOnMainPlayButton = this.handleClickOnMainPlayButton.bind(this);
        this.handleClickOnPlayButton = this.handleClickOnPlayButton.bind(this);
        this.handleClickOnVolumeButton = this.handleClickOnVolumeButton.bind(this);
        this.handleClickOnFullScreenButton = this.handleClickOnFullScreenButton.bind(this);
        this.handleFullScreenChange = this.handleFullScreenChange.bind(this);
        this.setFullScreen = this.setFullScreen.bind(this);
        this.leaveFullScreen = this.leaveFullScreen.bind(this);
        this.handleTimeSlider = this.handleTimeSlider.bind(this);
        this.handleControlBar = this.handleControlBar.bind(this);
        this.hideControlBarOnMouseLeave = this.hideControlBarOnMouseLeave.bind(this);
        this.handleMouseOverControlBar = this.handleMouseOverControlBar.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.displayFocusOnVideo = this.displayFocusOnVideo.bind(this);
        this.removeFocusOnVideo = this.removeFocusOnVideo.bind(this);

        this.mainPlayButton?.addEventListener('click',()=> this.handleClickOnMainPlayButton());
        this.playButton?.addEventListener('click',()=> this.handleClickOnPlayButton());
        this.video?.addEventListener('mousemove',()=> this.handleControlBar());
        this.video?.addEventListener('focus',()=> this.displayFocusOnVideo());
        this.video?.addEventListener('blur',()=> this.removeFocusOnVideo());
        this.node.addEventListener('mouseleave',()=> this.hideControlBarOnMouseLeave());
        this.controlBar?.addEventListener('mouseover',()=> this.handleMouseOverControlBar());
        this.controlBar?.addEventListener('focusin',()=> this.handleControlBar());
        this.controlBar?.addEventListener('focusout',()=> this.hideControlBarOnMouseLeave());
        this.video?.addEventListener('click',()=> {
            this.handleClickOnPlayButton();
            this.handleControlBar();
        });
        this.video?.addEventListener('keydown',(e)=> this.handleKeyboard(e));
        this.video?.addEventListener('timeupdate',()=> {
            this.handleTimeSlider();
            this.handleCurrentTimeElement();
        });
        this.volumeButton?.addEventListener('click',()=> this.handleClickOnVolumeButton());
        this.fullScreenButton?.addEventListener('click',()=> this.handleClickOnFullScreenButton());
        document.addEventListener("fullscreenchange",()=> this.handleFullScreenChange());
    }

    initialize() {
        let maxTime = 0;
        
        setTimeout(()=> { //sinon 'NaN' parfois comme valeur de video.duration (vidéo trop longue à charger ?)
            if(this.video) {
                this.video.volume = 0;
                maxTime = Math.round(this.video?.duration);
            }; 
            this.timeSliderThumb?.setAttribute('aria-valuemax',`${maxTime}`);
            this.setTimeIndicator(this.video?.duration,this.maxTimeElement);
            this.timeSlider = new TimeSlider(this.timeSliderContainer,this.accessibility,this.video,this.playButton);
        },200);

        this.volumeSlider = new VolumeSlider(this.volumeSliderContainer,this.accessibility,this.video,this.volumeButton);

        this.timeSlider?.thumb?.addEventListener('keydown',()=> this.handleControlBar());
        this.volumeSlider?.thumb?.addEventListener('keydown',()=> this.handleControlBar());
    }

    playVideo() {
        this.video?.play();
        if(this.language === 'fr') {
            this.playButton?.setAttribute('aria-label','Arrêter la vidéo');
        } else {
            this.playButton?.setAttribute('aria-label','Stop the video');
        };

        if(this.mainPlayButton?.classList.contains('display')) {
            this.mainPlayButton?.classList.remove('display');
            this.background?.classList.remove('display');
        };
    }
     
    stopVideo() {
        this.video?.pause();
        if(this.language === 'fr') {
            this.playButton?.setAttribute('aria-label','Lancer la vidéo');
        } else {
            this.playButton?.setAttribute('aria-label','Play the video');
        };
    }

    handleClickOnFullScreenButton() {
        if(this.isFullScreenActive) {
            this.leaveFullScreen();
        } else {
            this.setFullScreen();
        };
    }

    setFullScreen() {
        this.node.requestFullscreen();
        if(this.language === 'fr') {
            this.fullScreenButton?.setAttribute('aria-label','Quitter le mode plein écran');
        } else {
            this.fullScreenButton?.setAttribute('aria-label','Leave full screen mode');
        };
    }

    leaveFullScreen() {
        document.exitFullscreen();
        if(this.fullScreenButton)
            if(this.language === 'fr') {
                this.fullScreenButton.setAttribute('aria-label','Passer en mode plein écran');
            } else {
                this.fullScreenButton.setAttribute('aria-label','Go to full screen mode');
            };
    }

    handleFullScreenChange() {
        this.isFullScreenActive = !this.isFullScreenActive;
        this.video?.classList.toggle('full-screen');
        this.timeSlider?.handleSliderThumbPosition();
        this.fullScreenIcon?.classList.toggle('display');
        this.fullScreenExitIcon?.classList.toggle('display');
    }

    handleClickOnMainPlayButton() {
        this.playVideo();
        this.handleControlBar();
    }

    handleClickOnPlayButton() {
        if(this.video?.paused) {
            this.playVideo();
        } else {
            this.stopVideo();
        };
    }

    handleClickOnVolumeButton() {
        this.volumeSlider?.setValueFromVolumeButton();
    }

    setTimeIndicator(time:number | undefined,timeIndicator:HTMLElement | null) {
        if(time !== undefined) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            
            if(timeIndicator) {
                if(seconds < 10) {
                    timeIndicator.innerText = `${minutes}:0${seconds}`;
                } else {
                    timeIndicator.innerText = `${minutes}:${seconds}`;
                };
                
            };
        };
    }

    handleCurrentTimeElement() {
        this.setTimeIndicator(this.video?.currentTime,this.currentTimeElement);
        this.timeSlider?.setAriaValues();
    }

    handleTimeSlider() {
        if(this.timeSlider)
            this.timeSlider.value = this.video?.currentTime;
        this.timeSlider?.handleSliderThumbPosition();

        this.timeSlider?.checkVideoEnd();
    }

    handleControlBar() {
        clearTimeout(this.controlBarHide);
        if(!this.mainPlayButton?.classList.contains('display')) {
            this.controlBar?.classList.add('display');
            this.controlBarHide = setTimeout(()=> {
                       this.controlBar?.classList.remove('display');
                },4000);
        };
    }

    hideControlBarOnMouseLeave() {
        if(!this.mainPlayButton?.classList.contains('display')) {
            clearTimeout(this.controlBarHide);
            this.controlBar?.classList.remove('display');
        };
    }

    handleMouseOverControlBar() {
        clearTimeout(this.controlBarHide);
        this.controlBar?.classList.add('display');
    }

    handleKeyboard(e: KeyboardEvent) {
        switch(e.key) {
            case ' ':   
                e.preventDefault();
                this.handleClickOnPlayButton();
                this.handleControlBar();
                break;
            default:
                break;
        }
    }

    displayFocusOnVideo() {
        this.videoFocusElement?.classList.add('display');
    }

    removeFocusOnVideo() {
        this.videoFocusElement?.classList.remove('display');
    }

}