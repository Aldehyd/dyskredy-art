import SlideInterface from "./models/slideInterface";

export default class Slide implements SlideInterface{
    language: string | null;
    topFocusTrapping: HTMLDivElement | null;
    bottomFocusTrapping: HTMLDivElement | null;
    node: HTMLElement | null;
    section: HTMLElement;
    pictures: NodeListOf<HTMLElement>;
    closeButton: HTMLElement | null | undefined;
    rightButton: HTMLElement | null | undefined;
    leftButton: HTMLElement | null | undefined;
    individualButtons: HTMLElement[] | undefined;
    slideContainer: HTMLElement | null | undefined;
    individualButtonsContainer: HTMLElement | null | undefined;
    picturesViews: HTMLElement[];
    currentPicture: HTMLElement | undefined;
    indexCurrentPicture: number | undefined;

    constructor(section: HTMLElement) {
        this.language = document.documentElement.getAttribute('lang');
        this.topFocusTrapping = document.querySelector(".top-modal");
        this.bottomFocusTrapping = document.querySelector(".bottom-modal");

        this.node = null;
        this.section = section;
        
        // this.closeButton = this.node?.querySelector('.slide_close');
        // this.leftButton = this.node?.querySelector('.slide_left-button');
        // this.rightButton = this.node?.querySelector('.slide_right-button');
        this.individualButtons = [];
        // this.slideContainer = this.node?.querySelector('.slide_view');
        // this.individualButtonsContainer = this.node?.querySelector('.slide_individual-buttons-container');

        this.pictures = this.section.querySelectorAll('.portfolios-pictures');
        this.picturesViews = [];
        this.currentPicture = this.pictures[0];
        this.indexCurrentPicture = 0;

        this.setCurrentPicture = this.setCurrentPicture.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleLeftButton = this.handleLeftButton.bind(this);
        this.handleRightButton = this.handleRightButton.bind(this);
        this.handleIndividualButtons = this.handleIndividualButtons.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.setCurrentIndividualButton = this.setCurrentIndividualButton.bind(this);
        this.setAriaLabel = this.setAriaLabel.bind(this);
        this.handleTopFocusTrapping = this.handleTopFocusTrapping.bind(this);
        this.handleBottomFocusTrapping = this.handleBottomFocusTrapping.bind(this);
        
        this.topFocusTrapping?.addEventListener('focus',this.handleTopFocusTrapping);
        this.bottomFocusTrapping?.addEventListener('focus',this.handleBottomFocusTrapping);
    }

    initialize() {
        //create sliders frames
        const sections = document.querySelectorAll('.section-pictures');
        const modalSlide = document.querySelector('.modal-slide');
        const index = Array.from(sections).indexOf(this.section);
            const slide = document.createElement('div');
            slide.classList.add('slide');
            slide.classList.add(`slide-${index}`);
            slide.setAttribute('role','group');
            slide.setAttribute('aria-roledescription','carousel');
            const windowLocation = window.location.href;
            if(windowLocation.includes('technopolice')) {
                slide.setAttribute('aria-label','technopolice');
            } else if(windowLocation.includes('reves')) {
                slide.setAttribute('aria-label','reves');
            } else if(windowLocation.includes('dreams')) {
                slide.setAttribute('aria-label','dreams');
            } else if(windowLocation.includes('peintures')) {
                slide.setAttribute('aria-label','peintures');
            } else if(windowLocation.includes('paintings')) {
                slide.setAttribute('aria-label','paintings');
            } else if(windowLocation.includes('photos')) {
                slide.setAttribute('aria-label','photos');
            };
            modalSlide?.appendChild(slide);
            this.node = slide;
            const closeButton = document.createElement('button');
            closeButton.classList.add('slide_close');
            closeButton.innerHTML = '&#10761;';
            if(this.language === 'fr') {
                closeButton.setAttribute('aria-label',"Fermer le caroussel");
            } else {
                closeButton.setAttribute('aria-label',"Close the caroussel dialog");
            };
            this.node.appendChild(closeButton);
            this.closeButton = closeButton;
            const leftButton = document.createElement('button');
            leftButton.classList.add('slide_arrow-button','slide_left-button');
            leftButton.innerHTML = '&#9664;';
            this.node.appendChild(leftButton);
            this.leftButton = leftButton;
            const slideView = document.createElement('div');
            slideView.classList.add('slide_view');
            slideView.setAttribute('id','slide-container');
            slideView.setAttribute('role','group');
            slideView.setAttribute('aria-roledescription','slide');
            slideView.setAttribute('aria-atomic','false');
            slideView.setAttribute('aria-live','polite');
            this.node.appendChild(slideView);
            this.slideContainer = slideView;
            const rightButton = document.createElement('button');
            rightButton.classList.add('slide_arrow-button','slide_right-button');
            rightButton.innerHTML = '&#9654;';
            this.node.appendChild(rightButton);
            this.rightButton = rightButton;
            const individualButtonsContainer = document.createElement('div');
            individualButtonsContainer.classList.add('slide_individual-buttons-container');
            individualButtonsContainer.setAttribute('role','group');
            if(this.language === 'fr') {
                individualButtonsContainer.setAttribute('aria-label',"Choisir l'image à afficher");
            } else {
                individualButtonsContainer.setAttribute('aria-label',"Chose which picture to show");
            };
            this.node.appendChild(individualButtonsContainer);
            this.individualButtonsContainer = individualButtonsContainer;
        //display left and right buttons or not
        if(this.pictures.length === 1) {
            this.leftButton?.setAttribute('disabled','');
            this.rightButton?.setAttribute('disabled','');
        };
        this.pictures.forEach(picture => {
            //create picture views
            const src: string | null = picture.getAttribute('src');
            const alt: string | null = picture.getAttribute('alt');
            let newPicture = document.createElement('img');
            newPicture.setAttribute("tabindex","0");
            if(src)
                newPicture.setAttribute('src',src.replace('small','full'));
            if(alt)
                newPicture.setAttribute('alt',alt);
            newPicture.classList.add('slide_view_picture');
            slideView?.appendChild(newPicture);
            this.picturesViews.push(newPicture);
            //create individual buttons
            let newIndividualButton = document.createElement('button');
            newIndividualButton.classList.add('slide_individual-button');
            newIndividualButton.setAttribute('aria-labelledby','slide-container');
            newIndividualButton.setAttribute('tabindex','-1');
            this.individualButtonsContainer?.appendChild(newIndividualButton);
            this.individualButtons?.push(newIndividualButton);
        });
        this.node?.addEventListener('keydown',(e)=> this.handleKeyDown(e));
        this.pictures.forEach(picture => picture.parentElement?.addEventListener('click',()=> this.open(picture)));
        this.closeButton?.addEventListener('click', this.close);
        this.leftButton?.addEventListener('click',this.handleLeftButton);
        this.rightButton?.addEventListener('click',this.handleRightButton);
        this.individualButtons?.forEach(button => button.addEventListener('click',()=> this.handleIndividualButtons(button)));
        this.picturesViews?.forEach(picture => picture.addEventListener('contextmenu', (e)=> e.preventDefault()));
    }

    handleLeftButton() {
        if(this.indexCurrentPicture === 0) {
            this.indexCurrentPicture = this.picturesViews.length-1;
        } else {
            if(this.indexCurrentPicture !== undefined)
                this.indexCurrentPicture--;
        };
        this.setCurrentPicture();
        this.setAriaLabel();
        this.setCurrentIndividualButton();
    }

    handleRightButton() {
        if(this.indexCurrentPicture === this.picturesViews.length-1) {
            this.indexCurrentPicture = 0;
        } else {
            if(this.indexCurrentPicture !== undefined)
                this.indexCurrentPicture++;
        };
        this.setCurrentPicture();
        this.setAriaLabel();
        this.setCurrentIndividualButton();
    }

    handleIndividualButtons(button: HTMLElement) {
        this.indexCurrentPicture = this.individualButtons?.indexOf(button);
        this.setCurrentPicture();
        this.setAriaLabel();
        this.setCurrentIndividualButton();
    }

    handleKeyDown(e: KeyboardEvent) {
        switch(e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                if(this.individualButtonsContainer?.contains(document.activeElement)) {
                    this.handleLeftButton();
                    if(this.individualButtons && this.indexCurrentPicture !== undefined)
                        this.individualButtons[this.indexCurrentPicture].focus();
                } else {
                    this.picturesViews.forEach(picture => {
                        if(picture === document.activeElement) {
                            this.handleLeftButton();
                            setTimeout(()=> {
                                this.currentPicture?.focus();
                            },100);
                        };
                    });
                };
                break;
            case 'ArrowRight':
                if(this.individualButtonsContainer?.contains(document.activeElement)) {
                    this.handleRightButton();
                    if(this.individualButtons && this.indexCurrentPicture !== undefined)
                        this.individualButtons[this.indexCurrentPicture].focus();
                } else {
                    this.picturesViews.forEach(picture => {
                        if(picture === document.activeElement) {
                            this.handleRightButton();
                            setTimeout(()=> {
                                this.currentPicture?.focus();
                            },100);
                        };
                    });
                };
                break;
            default:
                break;
        }
    }

    setCurrentPicture() {
        if(this.indexCurrentPicture !== undefined)
            this.currentPicture = this.picturesViews[this.indexCurrentPicture];
        this.picturesViews.forEach(element => {
            element.classList.remove('display');
        });
        this.currentPicture?.classList.add('display');
    }

    setAriaLabel() {
        if(this.indexCurrentPicture !== undefined) {
            if(document.documentElement.getAttribute('lang') === 'en') {
                this.slideContainer?.setAttribute('aria-label',`${this.indexCurrentPicture + 1} of ${this.picturesViews.length}`);
            } else {
                this.slideContainer?.setAttribute('aria-label',`${this.indexCurrentPicture + 1} sur ${this.picturesViews.length}`);
            };
        };
    }

    setCurrentIndividualButton() {
        if(this.individualButtons) {
            this.individualButtons.forEach(button => {
                button.setAttribute('aria-disabled','false');
                button.setAttribute('tabindex','-1');
            });
            if(this.indexCurrentPicture !== undefined) {
                this.individualButtons[this.indexCurrentPicture].setAttribute('aria-disabled','true');
                this.individualButtons[this.indexCurrentPicture].setAttribute('tabindex','0');
            };
        };   
    }
        
    open(picture: HTMLElement) {
        const bodyBis = document.querySelector('.body-bis');
        this.node?.classList.add('display');

        this.currentPicture = this.picturesViews.find(element => element.getAttribute('src')?.replace('full','small') === picture.getAttribute('src'));
        if(this.currentPicture)
            this.indexCurrentPicture = this.picturesViews.indexOf(this.currentPicture);
        this.picturesViews.forEach(element => element.classList.remove('display'));
        this.currentPicture?.classList.add('display');
        this.currentPicture?.setAttribute('tabindex','0');
        this.setCurrentIndividualButton();
        this.setAriaLabel();

        bodyBis?.classList.add('has-modal');
        this.topFocusTrapping?.classList.add('display');
        this.bottomFocusTrapping?.classList.add('display');

        this.closeButton?.focus();
    }

    close() {
        const bodyBis = document.querySelector('.body-bis');
        this.node?.classList.remove('display');
        bodyBis?.classList.remove('has-modal');
        this.topFocusTrapping?.classList.remove('display');
        this.bottomFocusTrapping?.classList.remove('display');

        if(this.indexCurrentPicture !== undefined)
            this.pictures[this.indexCurrentPicture].parentElement?.focus();
    }

    handleTopFocusTrapping() {
        if(this.individualButtons && this.indexCurrentPicture !== undefined)
            this.individualButtons[this.indexCurrentPicture].focus();
    }

    handleBottomFocusTrapping() {
        this.closeButton?.focus();
    }
}