import ModalInterface from "./models/modalInterface";

export default class Modal implements ModalInterface {
    node: HTMLDivElement | null;
    display: boolean;
    controlButton: HTMLElement | null;
    topFocusTrapping: HTMLDivElement | null;
    bottomFocusTrapping: HTMLDivElement | null;
    focusableElements: NodeListOf<HTMLElement> | undefined;
    firstFocusableElement: HTMLElement | null;
    lastFocusableElement: HTMLElement | null;
    focusOnDisplay: string | HTMLElement | null;

    constructor(modal: string,controlButton: HTMLElement | null,focusOnDisplay: string | HTMLElement | null = 'firstElement') {
        this.node = document.querySelector(`.${modal}`);
        this.display = false;
        this.controlButton = controlButton;

        this.topFocusTrapping = document.querySelector(".top-modal");
        this.bottomFocusTrapping = document.querySelector(".bottom-modal");
        
        this.focusableElements = this.node?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)');
        this.firstFocusableElement = this.focusableElements ? this.focusableElements[0] : null;
        this.lastFocusableElement = this.focusableElements ? this.focusableElements[this.focusableElements.length-1] : null;
        this.focusOnDisplay = focusOnDisplay;

        this.setDisplay = this.setDisplay.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTopFocusTrapping = this.handleTopFocusTrapping.bind(this);
        this.handleBottomFocusTrapping = this.handleBottomFocusTrapping.bind(this);

        this.firstFocusableElement?.addEventListener('click',()=> this.setDisplay());
        this.node?.addEventListener('keydown',(e)=>this.handleKeyDown(e));
        this.topFocusTrapping?.addEventListener('focus',this.handleTopFocusTrapping);
        this.bottomFocusTrapping?.addEventListener('focus',this.handleBottomFocusTrapping);
    }

    setDisplay() {
        this.display = !this.display;
        const bodyBis = document.querySelector('.body-bis');

        if(this.display) {
            this.node?.classList.add('display');
            if(this.focusOnDisplay === 'firstElement') {
                this.firstFocusableElement?.focus();
            } else {
                if(typeof this.focusOnDisplay !== 'string')
                    this.focusOnDisplay?.focus();
            };
            bodyBis?.classList.add('has-modal');
            this.topFocusTrapping?.classList.add('display');
            this.bottomFocusTrapping?.classList.add('display');
        } else {
            this.node?.classList.remove('display');
            this.controlButton?.focus();
            bodyBis?.classList.remove('has-modal');
            this.topFocusTrapping?.classList.remove('display');
            this.bottomFocusTrapping?.classList.remove('display');
        };
    }

    handleTopFocusTrapping() {
        this.lastFocusableElement?.focus();
    }

    handleBottomFocusTrapping() {
        this.firstFocusableElement?.focus();
    }

    handleKeyDown(e: KeyboardEvent) {
        switch(e.key) {
            case 'Escape':
                this.setDisplay();
                break;
            default:
                break;
        };
    }

}