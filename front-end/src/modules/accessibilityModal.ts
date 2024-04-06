import Modal from "./modalClass";
import AccessibilityInterface from "./models/accessibilityInterface";
import AccessibilityModalInterface from "./models/accessibilityModalInterface";

export default class AccessibilityModal extends Modal implements AccessibilityModalInterface {
    accessibility: AccessibilityInterface;
    accessibilityList: HTMLUListElement | null | undefined;
    switchLines: NodeListOf<HTMLButtonElement> | undefined;
    switches: NodeListOf<HTMLButtonElement> | undefined;
    policeOptions: NodeListOf<HTMLInputElement> | undefined;
    slider: {
        container: HTMLDivElement | null;
        rail: HTMLDivElement | null | undefined;
        thumb: HTMLDivElement | null;
    }

    constructor(modal: string,controlButton: HTMLButtonElement | null,focusOnDisplay: string | HTMLElement,accessibility: AccessibilityInterface) {
        super(modal,controlButton,focusOnDisplay);

        this.accessibility = accessibility;
        this.accessibilityList = this.node?.querySelector('.modal-access_liste');
        this.switchLines = this.node?.querySelectorAll('.switch');
        this.switches = this.node?.querySelectorAll('.switch button');
        this.policeOptions = document.querySelectorAll('.fieldset-police_choice input');
        this.slider = {
            'container' : document.querySelector(".slider"),
            'rail' : document.querySelector(".slider_rail") as HTMLDivElement,
            'thumb' : document.querySelector(".slider_thumb")
        };

        this.handleClick = this.handleClick.bind(this);
        this.onModalOpen = this.onModalOpen.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.controlButton?.addEventListener('click',this.onModalOpen);
        this.slider.container?.addEventListener('click',(e)=> this.accessibility.computeFontSizeFromMouse(e));
        this.slider.thumb?.addEventListener('keydown',(e)=> this.accessibility.computeFontSizeFromKeyboard(e));
        this.slider.thumb?.addEventListener('mousedown', ()=> this.accessibility.isMouseDown = true);
        this.slider.container?.addEventListener('mousemove', (e)=> this.handleMouseMove(e));
        this.policeOptions.forEach(radio => radio.addEventListener('change', (e)=> this.accessibility.setPolice(e as MouseEvent)))
        this.switchLines?.forEach(line => line.addEventListener('click',(e)=> this.handleClick(e)));
    }
    onModalOpen() {
        this.accessibilityList?.scrollTo(0,0);
        setTimeout(()=> { //because can't initialize thumb position before modal opened because slider width = 0
            this.accessibility.setFontSize();
        },50);
    }
    handleMouseMove(e: MouseEvent) {
        if(this.accessibility.isMouseDown) {
            this.accessibility.computeFontSizeFromMouse(e);
        };
    }

    handleClick(e: MouseEvent | null) {
        if(this.accessibility.animationsSwitch?.parentElement?.contains(e?.target as Node)) {
            this.accessibility.switchAnimations();
        };
        if(this.accessibility.styleSwitch?.parentElement?.contains(e?.target as Node)) {
            this.accessibility.switchStyle();
        };
        if(this.accessibility.pMarginBottomSwitch?.parentElement?.contains(e?.target as Node)) {
            this.accessibility.switchPMarginBottom();
        };
        if(this.accessibility.lineHeightSwitch?.parentElement?.contains(e?.target as Node)) {
            this.accessibility.switchLineHeight();
        };
        if(this.accessibility.wordSpacingSwitch?.parentElement?.contains(e?.target as Node)) {
            this.accessibility.switchWordSpacing();
        };
        if(this.accessibility.letterSpacingSwitch?.parentElement?.contains(e?.target as Node)) {
            this.accessibility.switchLetterSpacing();
        };
    }

}