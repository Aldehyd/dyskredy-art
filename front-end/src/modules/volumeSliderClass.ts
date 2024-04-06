import Slider from "./sliderClass";
import AccessibilityInterface from "./models/accessibilityInterface";
import VolumeSliderInterface from "./models/volumeSliderInterface";

export default class VolumeSlider extends Slider implements VolumeSliderInterface {
    language: string | null;
    video: HTMLVideoElement | null;
    volumeButton: HTMLElement | null | undefined;
    savedValue: number | undefined;

    constructor(slider: HTMLElement | null | undefined, accessibility: AccessibilityInterface, video: HTMLVideoElement | null, volumeButton: HTMLElement | null | undefined) {
        super(slider,accessibility);

        this.language = document.documentElement.getAttribute('lang');
        this.video = video;
        this.volumeButton = volumeButton;
        this.savedValue = 0;

        this.applyEffect = this.applyEffect.bind(this);
        this.handleVolumeSymbol = this.handleVolumeSymbol.bind(this);
    }

    applyEffect() {
        if(this.video && this.value !== undefined)
            this.video.volume = this.value/100;

        this.savedValue = this.value;

        this.handleVolumeSymbol();
    }

    setAriaValueText() {
        this.thumb?.setAttribute('aria-valuetext',`${this.value}%`);
    }

    setValueFromVolumeButton() {
        if(this.value === 0) {
            this.value = this.savedValue;
        } else {
            this.value = 0;
        };

        if(this.video && this.value !== undefined)
            this.video.volume = this.value/100;
        
        this.setAriaValues();
        this.handleSliderThumbPosition();
        this.handleVolumeSymbol();
    }

    handleVolumeSymbol() {
        const volumeSymbols = this.volumeButton?.querySelectorAll('span');
        let muteSymbol = null;
        let lowVolumeSymbol = null;
        let highVolumeSymbol = null;
        if(volumeSymbols) {
            muteSymbol = volumeSymbols[0];
            lowVolumeSymbol = volumeSymbols[1];
            highVolumeSymbol = volumeSymbols[2];
        };

        volumeSymbols?.forEach(symbol => symbol.classList.remove('display'));
        if(this.value !== undefined)
            if(Math.round(this.value) === 0) {
                muteSymbol?.classList.add('display');
                // if(this.language === 'fr') {
                //     this.volumeButton?.setAttribute('aria-label','Couper le son');
                // } else {
                //     this.volumeButton?.setAttribute('aria-label','Mute');
                // };
            } else if (this.value <=50) {
                lowVolumeSymbol?.classList.add('display');
                // if(this.language === 'fr') {
                //     this.volumeButton?.setAttribute('aria-label','Rétablir le volume précédent');
                // } else {
                //     this.volumeButton?.setAttribute('aria-label','Set previous volume level');
                // };
            } else {
                highVolumeSymbol?.classList.add('display');
                // if(this.language === 'fr') {
                //     this.volumeButton?.setAttribute('aria-label','Rétablir le volume précédent');
                // } else {
                //     this.volumeButton?.setAttribute('aria-label','Set previous volume level');
                // };
            };
    }
}
