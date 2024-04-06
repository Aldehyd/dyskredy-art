import SliderInterface from "./sliderInterface";


export default interface TimeSliderInterface extends SliderInterface{
    language: string | null;
    video: HTMLVideoElement | null;
    playButton: HTMLElement | null | undefined;

    setPlayButtonToPlay(): void;
    checkVideoEnd():void;
}