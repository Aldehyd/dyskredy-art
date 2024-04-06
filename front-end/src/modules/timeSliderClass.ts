import Slider from "./sliderClass";
import AccessibilityInterface from "./models/accessibilityInterface";
import TimeSliderInterface from "./models/timeSliderInterface";

export default class TimeSlider extends Slider implements TimeSliderInterface {
    language: string | null;
    video: HTMLVideoElement | null;
    playButton: HTMLElement | null | undefined;

    constructor(slider: HTMLElement | null | undefined, accessibility: AccessibilityInterface, video: HTMLVideoElement | null, playButton: HTMLElement | null | undefined) {
        super(slider,accessibility);

        this.language = document.documentElement.getAttribute('lang');
        this.video = video;
        this.playButton = playButton;

        this.applyEffect = this.applyEffect.bind(this);
        this.setPlayButtonToPlay = this.setPlayButtonToPlay.bind(this);
    }

    applyEffect() {
        if(this.video && this.value !== undefined)
            this.video.currentTime = this.value;

        this.checkVideoEnd();
    }

    checkVideoEnd() {
        if(this.video && this.value !== undefined) {
            if(Math.floor(this.value) === Math.floor(this.video?.duration)) {
                this.setPlayButtonToPlay();
            };
        };
    }

    setPlayButtonToPlay() {
        this.playButton?.setAttribute('aria-label','Lancer la vidéo');
    }

    setAriaValues() {
        if(this.video)
            this.thumb?.setAttribute('aria-valuenow',`${Math.floor(this.video?.currentTime)}`)
    }

    setAriaValueText() {
        let minutes = 0;
        let seconds = 0;
        if(this.video) {
            minutes = Math.floor(this.video?.currentTime / 60);
            seconds = Math.floor(this.video?.currentTime % 60);
        };

        let ariaValueText = "";
        if(this.language === 'fr') {
            ariaValueText = `${minutes} minutes et ${seconds} secondes`;
        } else {
            ariaValueText = `${minutes} minutes and ${seconds} seconds`;
        };
        
        this.thumb?.setAttribute('aria-valuetext',ariaValueText);
    }

    
}