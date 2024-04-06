import SliderInterface from "./sliderInterface.js";

export default interface VolumeSliderInterface extends SliderInterface {
    video: HTMLVideoElement | null;
    volumeButton: HTMLElement | null | undefined;
    savedValue: number |undefined;

    setValueFromVolumeButton(): void;
    handleVolumeSymbol(): void;
}