import AccessibilityInterface from "./accessibilityInterface.js";

export default interface SliderInterface {
    accessibility: AccessibilityInterface;
    node: HTMLElement | null | undefined;
    thumb: HTMLElement | null | undefined;
    rail: HTMLElement | null | undefined;
    basicIncrement: number;
    biggerIncrement: number;
    value: number | undefined;
    valueMax: number;
    valueMin: number;

    handleMouseMove(e: MouseEvent):void;
    computeValueFromMouse(e: MouseEvent):void;
    computeValueFromKeyboard(e: KeyboardEvent):void;
    handleSliderThumbPosition():void;
    handleProgressionLength(thumbPosition: number):void;
    applyEffect():void;
    setAriaValues():void;
    setAriaValueText():void;
}