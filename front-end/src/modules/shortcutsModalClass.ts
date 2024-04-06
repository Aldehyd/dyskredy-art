import Modal from "./modalClass";
import ShortcutsModalInterface from "./models/shortcutsModalInterface";

export default class ShortcutsModal extends Modal implements ShortcutsModalInterface {
    elementToFocusOnClose: HTMLElement | null;

    constructor(modal: string,controlButton: HTMLElement | null,focusOnDisplay: string | HTMLElement | null = 'firstElement', activeElement: HTMLElement | null) {
        super(modal, controlButton, focusOnDisplay);

        this.elementToFocusOnClose = activeElement;
        this.topFocusTrapping = document.querySelector('.top-modal-shortcuts');
        this.bottomFocusTrapping = document.querySelector('.bottom-modal-shortcuts');

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
            bodyBis?.classList.remove('has-modal');
            this.topFocusTrapping?.classList.remove('display');
            this.bottomFocusTrapping?.classList.remove('display');

            this.elementToFocusOnClose?.focus();
        };
    }
}