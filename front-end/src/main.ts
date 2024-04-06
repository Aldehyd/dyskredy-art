"use strict";

import './mainStyle.scss';
import './mainStyleContrast.scss';

import initialize from './modules/initialize';
import handleTopPage from './modules/handleTopPage';
import AccessibilityInterface from './modules/models/accessibilityInterface';
import MainMenuInterface from './modules/models/mainMenuInterface';
import ModalInterface from './modules/models/modalInterface';
import AccessibilityModalInterface from './modules/models/accessibilityModalInterface';
import ShortcutsModalInterface from './modules/models/shortcutsModalInterface';
import LanguageModalInterface from './modules/models/languageModalInterface';
import LanguageSelectInterface from './modules/models/languageSelectInterface';
import FormInterface from './modules/models/formInterface';
import PreviewsInterface from './modules/models/previewsInterface';

// import sendMail from './modules/sendMail';

//-------------------------------------- Initialize -------------------------------------------//
type InitializedObjectsType = {
    accessibility: AccessibilityInterface;
    accessibilityModal: AccessibilityModalInterface;
    shortcutsModal: ShortcutsModalInterface;
    languageModal: LanguageModalInterface;
    languageSelect: LanguageSelectInterface;
    mainMenu: MainMenuInterface;
    mobileMainMenu: MainMenuInterface;
    mobileMenuModal: ModalInterface;
    contactForm : FormInterface;
    previews: PreviewsInterface;
}
let initializedObjects = {} as InitializedObjectsType;

window.addEventListener('DOMContentLoaded',()=> {
    initializedObjects = initialize();
    initializedObjects.previews.handleAppear();
});

//------------------- functions ---------------------------------------//

// function visibilityLanguageOption(option) {
//     const isBelow = option.getBoundingClientRect().top + option.clientHeight > window.clientHeight;
//     const isAbove = option.getBoundingClientRect().top < window.scrollY;

//     if(isBelow) {
//         scrollTo(0,option.getBoundingClientRect().top);
//     };
// };

//----------------- Handle events --------------------//
const topPage: HTMLDivElement | null = document.querySelector('.top-page');

window.addEventListener('mouseup', ()=> initializedObjects.accessibility.isMouseDown = false);

document.addEventListener('keydown', (e)=> {
    switch(e.key) {
        case 's':
            if(e.altKey && e.ctrlKey) {
                if(!initializedObjects.shortcutsModal.node?.classList.contains('display')) {
                    initializedObjects.shortcutsModal.elementToFocusOnClose = document.activeElement as HTMLElement;
                    initializedObjects.shortcutsModal.setDisplay();
                };
            }; 
            break;
        default:
            break;
    };
})

window.addEventListener('scroll',() => {
    initializedObjects.accessibility.handleCharacters();
    if(topPage) {
        handleTopPage(topPage,300);
    };
});

const switchContrastMobile = document.querySelector('.switch-contrast-mobile');
switchContrastMobile?.addEventListener('click',()=>initializedObjects.accessibility.switchStyle());

const burgerMenuButton = document.querySelector('.menu-container_menu-mobile');
burgerMenuButton?.addEventListener("click",() => {
    initializedObjects.mobileMenuModal.setDisplay();
});

const accessibilityButton: HTMLElement | null = document.querySelector('.accessibility');
topPage?.addEventListener('click',function(){
    window.scrollTo(0,0); 
    accessibilityButton?.focus();
});

//handle quick links display
const quickLinksMenu: HTMLElement | null = document.querySelector('.acces-rapide');
quickLinksMenu?.addEventListener('keydown', (e)=> {
    switch(e.key) {
        case 'Escape':
            accessibilityButton?.focus();
            break;
        default:
            break;
    };
});

//gère le scroll sur les éléments focusables pour les rendre visible à la prise de focus
// const mainMenuHeight = parseInt(getComputedStyle(mainMenu).height.replace("px",""));
// const mainMenuDebordHeight = parseInt(getComputedStyle(mainMenuDebord).height.replace("px",""));
// const positionsScrollToElements = scrollToElements.map(element => 
//     element.getBoundingClientRect().top - mainMenuHeight - mainMenuDebordHeight - 10);
// scrollToElements.forEach(element => element.addEventListener('focus',(e)=> {
//     let indexScrollToElements = scrollToElements.indexOf(e.target);
//     let positionScrollToElements = positionsScrollToElements[indexScrollToElements];
//     scrollTo(0,positionScrollToElements);
// }));

accessibilityButton?.addEventListener('click', ()=> {
    initializedObjects.accessibilityModal.setDisplay();
//     //gère scroll au focus dans la modale
//     const modalAccessListPaddingtop = parseInt(getComputedStyle(modalAccessList).paddingTop.replace("px",""));
//     const modalAccessListTop = modalAccessList.getBoundingClientRect().top - modalAccessListPaddingtop;
//     const scrollInAccessModal = document.querySelectorAll(".scroll-to");
//     scrollInAccessModal.forEach(item => item.addEventListener('focusin',(e)=> {
//         //récupérer le parent avec la classe 'scroll-to'
//         let currentElement = e.target;
//         while(!currentElement.classList.contains('scroll-to')) {
//             currentElement = currentElement.parentElement;
//         };
//         //ajuste la position du parent dans la liste 
//         const itemTop = currentElement.offsetTop-200; //pourquoi 200 fonctionne parfaitement ??
//         modalAccessList.scrollTo(0,itemTop);
});

const shortcutsButton: HTMLElement | null = document.querySelector('.shortcuts-button');
shortcutsButton?.addEventListener('click', ()=> {
    initializedObjects.shortcutsModal.elementToFocusOnClose = document.activeElement as HTMLElement;
    initializedObjects.shortcutsModal.setDisplay();
});

const picturesButton = document.querySelectorAll('.picture-button');
(picturesButton as NodeListOf<HTMLButtonElement>).forEach(picture => picture.addEventListener('contextmenu', (e)=> {
        e.preventDefault();
}));
//accordeon buttons in main
const accordeonButtons = document.querySelectorAll('main .accordeon-button');
accordeonButtons.forEach(button => button.addEventListener('click',()=> {
    if(button.getAttribute('aria-expanded') === 'true') {
        button.setAttribute('aria-expanded','false');
        button.parentElement?.parentElement?.classList.remove('display');
    } else {
        accordeonButtons.forEach(button => {
            button.setAttribute('aria-expanded','false');
            button.parentElement?.parentElement?.classList.remove('display');
        });
        button.setAttribute('aria-expanded','true');
        button.parentElement?.parentElement?.classList.add('display');
    };
}));

//accordeon buttons in shortcuts modal
const shortcutsAccordeonButtons = document.querySelectorAll('.modal-shortcuts .accordeon-button');
shortcutsAccordeonButtons.forEach(button => button.addEventListener('click',()=> {
    if(button.getAttribute('aria-expanded') === 'true') {
        button.setAttribute('aria-expanded','false');
        button.parentElement?.nextElementSibling?.classList.remove('display');
    } else {
        shortcutsAccordeonButtons.forEach(button => {
            button.setAttribute('aria-expanded','false');
            button.parentElement?.nextElementSibling?.classList.remove('display');
        });
        button.setAttribute('aria-expanded','true');
        button.parentElement?.nextElementSibling?.classList.add('display');
    };
}));

const detailledDescriptions = document.querySelectorAll('.picture-description_text');
const videoTranscriptions = document.querySelectorAll('.video-transcription_text');
window.addEventListener('click',(e)=> {
    if(!initializedObjects.languageSelect.node?.contains(e.target as Node)) {
        initializedObjects.languageSelect.reduce();
    };
    if(!initializedObjects.mainMenu.node?.contains(e.target as Node)) {
        initializedObjects.mainMenu.subMenus.forEach(submenu => {
            if(submenu.isExpanded) {
                initializedObjects.mainMenu.closeSubMenu(submenu);
                submenu.controlLink?.focus();
            };
        });
    };
    detailledDescriptions.forEach(description => {
        if(!description.parentElement?.contains(e.target as Node)) {
            description.classList.remove('display');
            description.previousElementSibling?.setAttribute('aria-expanded','false');
        };
    });
    videoTranscriptions.forEach(description => {
        if(!description.contains(e.target as Node) && !description.previousElementSibling?.contains(e.target as Node)) {
            description.classList.remove('display');
            description.previousElementSibling?.setAttribute('aria-expanded','false');
        };
    });
});

const detailledDescriptionButtons = document.querySelectorAll('.picture-description_title');
detailledDescriptionButtons.forEach(button => button.addEventListener('click',()=> {
    if(button.getAttribute('aria-expanded') === 'true') {
        button.setAttribute('aria-expanded','false');
        button.nextElementSibling?.classList.remove('display');
    } else {
        button.setAttribute('aria-expanded','true');
        button.nextElementSibling?.classList.add('display');
    };
}));

const videoTranscriptionButtons = document.querySelectorAll('.video-transcription_title');
videoTranscriptionButtons.forEach(button => button.addEventListener('click',()=> {
    if(button.getAttribute('aria-expanded') === 'true') {
        button.setAttribute('aria-expanded','false');
        button.nextElementSibling?.classList.remove('display');
    } else {
        button.setAttribute('aria-expanded','true');
        button.nextElementSibling?.classList.add('display');
    };
}));


