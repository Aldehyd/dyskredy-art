
import AccessibilityInterface from './models/accessibilityInterface';
import setActiveStyleSheet from './setActiveStyleSheet';

export default class Accessibility implements AccessibilityInterface {
    initialize: boolean;
    accessibilityList: HTMLUListElement | null;
    accessibilityListScrollTop: number | undefined;
    style: string;
    styleSwitch: HTMLButtonElement | null;
    styleSwitchMobile: HTMLButtonElement | null;
    isAnimations: boolean;
    siteAnimations: string;
    systemAnimations: boolean;
    animationsSwitch: HTMLButtonElement | null;
    initialFontSize: number;
    fontSize: number;
    fontSizeMax: number;
    slider: { 
                container: HTMLDivElement | null;
                rail: HTMLDivElement | null | undefined ;
                thumb: HTMLDivElement | null;
            };
    sliderOffsetTop: number | undefined;
    isMouseDown: boolean;
    police: string;
    policeOptions: NodeListOf<HTMLInputElement>;
    policeRoboto: HTMLElement | null | undefined;
    policeOpenDyslexic: HTMLElement | null | undefined;
    pMarginBottom: string;
    pMarginBottomSwitch: HTMLButtonElement | null;
    styledElements: NodeList;
    lineHeight: string;
    lineHeightSwitch: HTMLButtonElement | null;
    wordSpacing: string;
    wordSpacingSwitch: HTMLButtonElement | null;
    letterSpacing: string;
    letterSpacingSwitch: HTMLButtonElement | null;
    
    constructor(style:string,siteAnimations:string,fontSize:number,police:string,pMarginBottom:string,lineHeight:string,wordSpacing:string,letterSpacing:string) {
        this.initialize = false;

        this.accessibilityList = document.querySelector('.modal-access_liste');
        this.accessibilityListScrollTop = this.accessibilityList?.scrollTop;

        this.style = style;
        this.styleSwitch = document.querySelector(".switch-contrast");
        this.styleSwitchMobile = document.querySelector(".switch-contrast.mobile");

        this.isAnimations = true;
        this.siteAnimations = siteAnimations;
        this.systemAnimations = true;
        this.animationsSwitch = document.querySelector(".switch-animations");

        this.initialFontSize = 12;
        this.fontSize = fontSize;
        this.fontSizeMax = 300;
        this.slider = {
            'container' : document.querySelector(".slider"),
            'rail' : document.querySelector(".slider_rail") as HTMLDivElement,
            'thumb' : document.querySelector(".slider_thumb")
        };
        this.sliderOffsetTop = this.slider?.container?.offsetTop;
        this.isMouseDown = false;
        
        this.police = police;
        this.policeOptions = document.querySelectorAll('.fieldset-police_choice input');
        this.policeRoboto = document.querySelector('input[value="Roboto"]')?.parentElement;
        this.policeOpenDyslexic = document.querySelector('input[value="openDyslexic"]')?.parentElement;

        this.pMarginBottom = pMarginBottom;
        this.pMarginBottomSwitch = document.querySelector(".switch-p-margin-bottom");

        this.styledElements = document.querySelectorAll('span, a, p, h1, h2, h3, h4, h5, h6, label, li');

        this.lineHeight = lineHeight;
        this.lineHeightSwitch = document.querySelector(".switch-line-height");

        this.wordSpacing = wordSpacing;
        this.wordSpacingSwitch = document.querySelector(".switch-word-spacing");

        this.letterSpacing = letterSpacing;
        this.letterSpacingSwitch = document.querySelector(".switch-letter-spacing");

        this.switchStyle = this.switchStyle.bind(this);
        this.switchAnimations = this.switchAnimations.bind(this);
        this.computeFontSizeFromMouse = this.computeFontSizeFromMouse.bind(this);
        this.computeFontSizeFromKeyboard = this.computeFontSizeFromKeyboard.bind(this);
        this.setFontSize = this.setFontSize.bind(this);
        this.handleSliderThumbPosition = this.handleSliderThumbPosition.bind(this);
        this.keepSliderPositionFixed = this.keepSliderPositionFixed.bind(this);
        this.setPolice = this.setPolice.bind(this);
        this.switchPMarginBottom = this.switchPMarginBottom.bind(this);
        this.switchLineHeight = this.switchLineHeight.bind(this);
        this.switchWordSpacing = this.switchWordSpacing.bind(this);
        this.switchLetterSpacing = this.switchLetterSpacing.bind(this);
        this.handleFooter = this.handleFooter.bind(this);
        this.handleCharacters = this.handleCharacters.bind(this);
    }

    switchStyle() {
        if(!this.initialize) {
            if(this.style === 'default') {
                this.style = 'contrast';
            } else {
                this.style = 'default';
            };
            localStorage.setItem('style',this.style);
        };

        if(this.style === 'default') {
            setActiveStyleSheet("mainStyle");
            this.styleSwitch?.setAttribute('aria-checked','false');
            this.styleSwitchMobile?.setAttribute('aria-checked','false');
            localStorage.setItem('style',this.style);
        } else {
            setActiveStyleSheet("mainStyleContrast");
            this.styleSwitch?.setAttribute('aria-checked','true');
            this.styleSwitchMobile?.setAttribute('aria-checked','true');
            localStorage.setItem('style',this.style);
        };
    }

    switchAnimations() {
        if(!this.initialize) {
            if(this.siteAnimations === 'true') {
                this.siteAnimations = 'false';
            } else {
                this.siteAnimations = 'true';
            };
            localStorage.setItem('animations',this.siteAnimations);
        };
        
        if(this.siteAnimations === 'true') {
            this.animationsSwitch?.setAttribute("aria-checked","true");
        } else {
            this.animationsSwitch?.setAttribute("aria-checked","false");
        };

        if(globalThis.matchMedia("(prefers-reduced-motion:reduce)").matches) {
            this.systemAnimations = false;
        } else {
            this.systemAnimations = true;
        };
       
        if(!this.systemAnimations || this.siteAnimations === 'false') {
            this.isAnimations = false;
            document.body.classList.remove('animate');
        } else {
            this.isAnimations = true;
            document.body.classList.add('animate');
        };
    }

    computeFontSizeFromMouse(e: MouseEvent) {
        if(this.slider)
            if(this.slider.rail)
                this.fontSize = (e.clientX - this.slider.rail.getBoundingClientRect().left)/this.slider.rail?.offsetWidth*(200-100)+100;
        this.setFontSize();
    }
    computeFontSizeFromKeyboard(e: KeyboardEvent) {
        const basicIncrement = 5;
        const biggerIncrement = 20;
        switch(e.key) {
            case 'ArrowLeft':
                if(this.fontSize > 100 + basicIncrement) {
                    this.fontSize -= basicIncrement;
                } else {
                    this.fontSize = 100;
                };
                break;
            case 'ArrowDown':
                e.preventDefault();
                if(this.fontSize > 100 + basicIncrement) {
                    this.fontSize -= basicIncrement;
                } else {
                    this.fontSize = 100;
                };
                break;
            case 'PageDown': 
                e.preventDefault();
                if(this.fontSize > 100 + biggerIncrement) {
                    this.fontSize -= biggerIncrement;
                } else {
                     this.fontSize = 100;
                };
                break;
            case 'ArrowRight':
                if(this.fontSize < 200) {
                    this.fontSize += basicIncrement;
                } else {
                    this.fontSize = 200;
                };
                break;  
            case 'ArrowUp':
                e.preventDefault();
                if(this.fontSize < 200) {
                    this.fontSize += basicIncrement;
                } else {
                    this.fontSize = 200;
                };
                break;
            case 'PageUp': 
                e.preventDefault();
                if(this.fontSize < 200 - biggerIncrement) {
                    this.fontSize += biggerIncrement;
                } else {
                    this.fontSize = 200;
                };
                break;
            case 'Home':
                e.preventDefault();
                this.fontSize = 100;
                break;
            case 'End':
                e.preventDefault();
                this.fontSize = 200;
                break;
        };
        this.setFontSize();
    }
    setFontSize() {
        if(!this.initialize) {
            localStorage.setItem("fontSize",this.fontSize.toString());
        };

        this.accessibilityListScrollTop = this.accessibilityList?.scrollTop;
        this.sliderOffsetTop = this.slider.container?.offsetTop;
        document.documentElement.style.fontSize = this.fontSize/100*this.initialFontSize+"px";
        this.slider.thumb?.setAttribute('aria-valuenow',this.fontSize.toString());
        this.slider.thumb?.setAttribute('aria-valuetext',`${this.fontSize}%`);

        this.handleSliderThumbPosition();
        this.handleCharacters();
        this.handleFooter();
    }
    handleSliderThumbPosition() {
        const position = (this.fontSize-100)/(200-100)*(this.slider?.rail ? this.slider.rail.offsetWidth : 0);
        const rectification = position / (this.slider?.rail ? this.slider.rail.offsetWidth : 1) * (this.slider?.thumb ? this.slider.thumb.offsetWidth : 0);
        const visualPosition = position - rectification;
        if(this.slider.thumb) 
            this.slider.thumb.style.left = `${visualPosition}px`;

        this.keepSliderPositionFixed();
    }
    keepSliderPositionFixed() {
        const offset = (this.sliderOffsetTop && this.slider.container) ? (this.sliderOffsetTop - this.slider.container.offsetTop) : 0;
        if(this.accessibilityListScrollTop) {
            console.log(this.accessibilityListScrollTop)
            if(this.accessibilityListScrollTop === 0) {
                this.accessibilityList?.scrollTo(0,100 - offset ); // trouver un autre moyen car scrolltop varie en fct de la hauteur de la fenêtre
            } else {
                this.accessibilityList?.scrollTo(0,this.accessibilityListScrollTop - offset );
            }
            
        };
            
    }

    setPolice(e?: MouseEvent) {
        if(!this.initialize) {
            if(this.policeRoboto?.contains(e?.target as Node)) {
                this.police = 'roboto';
            };
            if(this.policeOpenDyslexic?.contains(e?.target as Node)) {
                this.police = 'openDyslexic';
            };
        };

        localStorage.setItem("police",this.police);
        document.documentElement.style.fontFamily = this.police;

        const particularElements: NodeListOf<HTMLElement> = document.querySelectorAll('button, select, input, textarea');
        particularElements.forEach(element => element.style.fontFamily = this.police);

        if(this.police == 'roboto') {
            this.policeOptions[0].checked = true;
        } else {
            this.policeOptions[1].checked = true;
        };

        this.handleCharacters();
    }

    switchPMarginBottom() {
        if(!this.initialize) {
            if(this.pMarginBottom === 'true') {
                this.pMarginBottom = 'false';
            } else {
                this.pMarginBottom = 'true';
            };
            localStorage.setItem('pMarginBottom',this.pMarginBottom);
        };

        if(this.pMarginBottom === 'true') {
            this.pMarginBottomSwitch?.setAttribute("aria-checked","true");
            Array.from(document.querySelectorAll('p:not(.copyright_text)') as NodeListOf<HTMLElement>).forEach(paragraph => paragraph.style.marginBottom = `${(this.fontSize/100*this.initialFontSize)*2}px`);
        } else {
            this.pMarginBottomSwitch?.setAttribute("aria-checked","false");
            Array.from(document.getElementsByTagName('p')).forEach(paragraph => paragraph.style.marginBottom = 'auto');
        };

        this.handleCharacters();
    }

    switchLineHeight() {
        if(!this.initialize) {
            if(this.lineHeight === 'true') {
                this.lineHeight = 'false';
            } else {
                this.lineHeight = 'true';
            };
            localStorage.setItem('lineHeight',this.lineHeight);
        };

        if(this.lineHeight === 'true') {
            this.lineHeightSwitch?.setAttribute("aria-checked","true");
            Array.from(this.styledElements as NodeListOf<HTMLElement>).forEach(element => element.style.lineHeight = '150%');
        } else {
            this.lineHeightSwitch?.setAttribute("aria-checked","false");
            Array.from(this.styledElements as NodeListOf<HTMLElement>).forEach(element => element.style.lineHeight = 'normal');
        };

        this.handleCharacters();
    }

    switchWordSpacing() {
        if(!this.initialize) {
            if(this.wordSpacing === 'true') {
                this.wordSpacing = 'false';
            } else {
                this.wordSpacing = 'true';
            };
            localStorage.setItem('wordSpacing',this.wordSpacing);
        };

        if(this.wordSpacing === 'true') {
            this.wordSpacingSwitch?.setAttribute("aria-checked","true");
            Array.from(this.styledElements as NodeListOf<HTMLElement>).forEach(element => element.style.wordSpacing = `${(this.fontSize/100*this.initialFontSize)*0.16}px`);
        } else {
            this.wordSpacingSwitch?.setAttribute("aria-checked","false");
            Array.from(this.styledElements as NodeListOf<HTMLElement>).forEach(element => element.style.wordSpacing = 'normal');
        };

        this.handleCharacters();
    }

    switchLetterSpacing() {
        if(!this.initialize) {
            if(this.letterSpacing === 'true') {
                this.letterSpacing = 'false';
            } else {
                this.letterSpacing = 'true';
            };
            localStorage.setItem('letterSpacing',this.letterSpacing);
        };

        if(this.letterSpacing === 'true') {
            this.letterSpacingSwitch?.setAttribute("aria-checked","true");
            Array.from(this.styledElements as NodeListOf<HTMLElement>).forEach(element => element.style.letterSpacing = `${(this.fontSize/100*this.initialFontSize)*0.16}px`);
        } else {
            this.letterSpacingSwitch?.setAttribute("aria-checked","false");
            Array.from(this.styledElements as NodeListOf<HTMLElement>).forEach(element => element.style.letterSpacing = 'normal');
        };

        this.handleCharacters();
    }

    handleFooter() {
        const footer: HTMLElement | null = document.getElementById("footer");

        if(this.fontSize <= 175) {
            footer?.classList.add("footer-font-size-3");
            footer?.classList.remove("footer-font-size-2","footer-font-size-4");
            if(this.fontSize <= 140) {
                footer?.classList.add("footer-font-size-2");
                footer?.classList.remove("footer-font-size-3","footer-font-size-4");
                if(this.fontSize <= 115) {
                    footer?.classList.remove("footer-font-size-2","footer-font-size-3","footer-font-size-4");
                };
            };
        } else {
            footer?.classList.add("footer-font-size-4");
            footer?.classList.remove("footer-font-size-2","footer-font-size-3");
        };
    }

    handleCharacters() { 
        const mainMenu: HTMLUListElement | null = document.querySelector(".menu-container");
        const treeCharacter: NodeListOf<HTMLDivElement> | null = document.querySelectorAll(".header_tree");
        const dragon: NodeListOf<HTMLDivElement> | null = document.querySelectorAll(".header_dragon");
        
        if(mainMenu)
            if(document.documentElement.scrollTop > mainMenu.offsetTop) { 
                treeCharacter.forEach(e => (e.classList.remove("display")));
                dragon.forEach(e => (e.classList.remove("display")));
            } else { 
                if(this.letterSpacing === 'false' && this.police === 'roboto') {
                    if(this.fontSize <=110) {
                        treeCharacter.forEach(e => (e.classList.add("display")));
                    } else {
                        treeCharacter.forEach(e => (e.classList.remove("display")));
                    };
                } else {
                    treeCharacter.forEach(e => (e.classList.remove("display")));
                };
                if(this.fontSize <= 175) { 
                    dragon.forEach(e => (e.classList.add("display")));
                } else {
                    treeCharacter.forEach(e => (e.classList.remove("display")));
                    dragon.forEach(e => (e.classList.remove("display")));
                };
            };
    }

}