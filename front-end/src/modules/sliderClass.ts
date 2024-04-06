import AccessibilityInterface from "./models/accessibilityInterface";
import SliderInterface from "./models/sliderInterface";

export default class Slider implements SliderInterface {
    accessibility: AccessibilityInterface;
    node: HTMLElement | null | undefined;
    thumb: HTMLElement | null | undefined;
    rail: HTMLElement | null | undefined;
    progression: HTMLElement | null | undefined;
    basicIncrement: number;
    biggerIncrement: number;
    value: number | undefined;
    valueMax: number;
    valueMin: number;

    constructor(slider: HTMLElement | null | undefined, accessibility: AccessibilityInterface) {
        this.accessibility = accessibility;
        this.node = slider;
        this.thumb = this.node?.querySelector('.slider_thumb');
        this.rail = this.node?.querySelector('.slider_rail');
        this.progression = this.rail?.querySelector('.slider_progression');

        this.basicIncrement = 5;
        this.biggerIncrement = 20;
        this.value = 0;
        this.valueMax = parseInt(this.thumb?.getAttribute('aria-valuemax') as string);
        this.valueMin = parseInt(this.thumb?.getAttribute('aria-valuemin') as string);

        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.node?.addEventListener('click',(e)=> this.computeValueFromMouse(e));
        this.thumb?.addEventListener('keydown',(e)=> this.computeValueFromKeyboard(e));
        this.thumb?.addEventListener('mousedown', ()=> this.accessibility.isMouseDown = true);
        this.node?.addEventListener('mousemove', (e)=> this.handleMouseMove(e));
        }

        handleMouseMove(e: MouseEvent) {
            if(this.accessibility.isMouseDown) {
                this.computeValueFromMouse(e);
            };
        }

        computeValueFromMouse(e: MouseEvent) {
            if(this.rail)
                this.value = Math.round((e.clientX - this.rail.getBoundingClientRect().left)/this.rail?.offsetWidth*(this.valueMax - this.valueMin) + this.valueMin);

            this.setAriaValues();
            this.handleSliderThumbPosition();
            this.applyEffect();
        }

        computeValueFromKeyboard(e: KeyboardEvent) {
            switch(e.key) {
                case 'ArrowLeft':
                    if(this.value !== undefined) 
                        if(this.value > this.valueMin + this.basicIncrement) {
                            this.value -= this.basicIncrement;
                        } else {
                            this.value = this.valueMin;
                        };
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if(this.value !== undefined) 
                        if(this.value > this.valueMin + this.basicIncrement) {
                            this.value-= this.basicIncrement;
                        } else {
                            this.value = this.valueMin;
                        };
                    break;
                case 'PageDown': 
                    e.preventDefault();
                    if(this.value !== undefined) 
                        if(this.value > this.valueMin + this.biggerIncrement) {
                            this.value -= this.biggerIncrement;
                        } else {
                            this.value = this.valueMin;
                        };
                    break;
                case 'ArrowRight':
                    if(this.value !== undefined) 
                        if(this.value < this.valueMax) {
                            this.value += this.basicIncrement;
                        } else {
                            this.value = this.valueMax;
                        };
                    break;  
                case 'ArrowUp':
                    e.preventDefault();
                    if(this.value !== undefined) 
                        if(this.value < this.valueMax) {
                            this.value += this.basicIncrement;
                        } else {
                            this.value = this.valueMax;
                        };
                    break;
                case 'PageUp': 
                    e.preventDefault();
                    if(this.value !== undefined) 
                        if(this.value < this.valueMax - this.biggerIncrement) {
                            this.value += this.biggerIncrement;
                        } else {
                            this.value = this.valueMax;
                        };
                    break;
                case 'Home':
                    e.preventDefault();
                    this.value = this.valueMin;
                    break;
                case 'End':
                    e.preventDefault();
                    this.value = this.valueMax;
                    break;
            };

            this.setAriaValues();
            this.handleSliderThumbPosition();
            this.applyEffect();
        }

        setAriaValues() {
            this.thumb?.setAttribute('aria-valuenow',`${this.value}`);
            this.setAriaValueText();
        }

        setAriaValueText() {
            //depends on the slider
        }

        handleSliderThumbPosition() {
            let position = 0;
            if(this.value !== undefined)
                position = Math.round(this.value/(this.valueMax - this.valueMin) *(this.rail ? this.rail.offsetWidth : 0));
            console.log(position)
                const rectification = position / (this.rail ? this.rail.offsetWidth : 1) * (this.thumb ? this.thumb.offsetWidth : 0);
            const visualPosition = position - rectification;
            if(this.thumb) 
                this.thumb.style.left = `${visualPosition}px`;
            if(this.thumb)
            console.log(position,this.thumb?.offsetWidth/2)
            this.handleProgressionLength(visualPosition);
        }

        handleProgressionLength(thumbPosition: number) {
            if(this.progression && this.thumb)
                this.progression.style.width = `${thumbPosition + this.thumb?.offsetWidth/2}px`;
        }

        applyEffect() {
            //depends on the slider
        }
}