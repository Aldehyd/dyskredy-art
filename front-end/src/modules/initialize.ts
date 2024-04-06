import Accessibility from "./accessibilityClass";
import AccessibilityModal from "./accessibilityModal";
import ShortcutsModal from "./shortcutsModalClass";
import LanguageModal from "./languageModal";
import MobileMenuModal from "./mobileMenuModal";
import LanguageSelect from "./languageSelectClass";
import MainMenu from "./mainMenuClass";
import VerticalMainMenu from "./verticalMainMenuClass";
import ContactForm from "./contactFormClass";
import  Previews  from "./previewsClass";
import Copyright from "./copyrightClass";
import Slide from "./slideClass";
import VideoPlayer from "./videoPlayerClass";

export default function initialize() {
   
    const style = localStorage.getItem("style") || 'default';
    const currentLanguage = localStorage.getItem('language') || 'french';
    const siteAnimations = localStorage.getItem("animations") || 'true';
    
    let fontSize = localStorage.getItem("fontSize") || 100;
    if(typeof fontSize === 'string') {
        fontSize = parseInt(fontSize);
    };

    const police = localStorage.getItem("police") || 'roboto';
    const pMarginBottom = localStorage.getItem("pMarginBottom") || 'false';
    const lineHeight = localStorage.getItem("lineHeight") || 'false';
    const wordSpacing = localStorage.getItem("wordSpacing") || 'false';
    const letterSpacing = localStorage.getItem("letterSpacing") || 'false';
   
    const accessibility = new Accessibility(style,siteAnimations,fontSize,police,pMarginBottom,lineHeight,wordSpacing,letterSpacing);
    
    const accessibilityButton: HTMLButtonElement | null = document.querySelector('.accessibility');
    const accessibilityModal = new AccessibilityModal('modal-access',accessibilityButton,'firstElement',accessibility);
    const shortcutsButton: HTMLButtonElement | null = document.querySelector('.shortcuts-button');
    const shortcutsModal = new ShortcutsModal('modal-shortcuts',shortcutsButton,'firstElement',null);
    
    const languageButton: HTMLElement | null = document.querySelector('.language');
    const languageNoButton: HTMLElement | null = document.querySelector('.modal-lang_no');
    const languageModal = new LanguageModal('modal-lang',languageButton,languageNoButton);
    const languageSelect = new LanguageSelect('language',languageModal);
    if(currentLanguage === 'french') {
        if(languageSelect.options)
            languageSelect.activeDescendantElement = languageSelect.options[0];
    } else {
        if(languageSelect.options)
            languageSelect.activeDescendantElement = languageSelect.options[1];
    };
    languageSelect.setActiveItem();

    const burgerMenuButton: HTMLButtonElement | null = document.querySelector('.menu-container_menu-mobile');
    const mobileMenuModal = new MobileMenuModal('modal-mobile',burgerMenuButton,'firstElement'); 
    
    const mainMenu = new MainMenu('main-menu');
    const mobileMainMenu = new VerticalMainMenu('mobile-menu');

    const contactFormElement: HTMLElement | null = document.querySelector('.contact-form');
    const contactForm = new ContactForm(contactFormElement);

    const previews = new Previews(accessibility);
    const sections = document.querySelectorAll('.section-pictures');
    (sections as NodeListOf<HTMLElement>).forEach(section => {
        const slide = new Slide(section);
        slide.initialize();
    });
    const videoPlayers = document.querySelectorAll('.portfolios-video-player');
    (videoPlayers as NodeListOf<HTMLElement>).forEach(video => {
        const videoPlayer = new VideoPlayer(video,accessibility);
        videoPlayer.initialize();
    });
    const copyright = new Copyright();

    accessibility.initialize = true;
    accessibility.switchStyle();
    accessibility.switchAnimations();
    accessibility.setFontSize();
    accessibility.setPolice();
    accessibility.switchPMarginBottom();
    accessibility.switchLineHeight();
    accessibility.switchWordSpacing();
    accessibility.switchLetterSpacing();
    accessibility.initialize = false;

    const languageChange = localStorage.getItem('languageChange');
    if(languageChange === 'true') {
        languageSelect.node?.focus();
        localStorage.setItem('languageChange','false');
    };
    
    return {
        'accessibility' : accessibility,
        'accessibilityModal' : accessibilityModal,
        'shortcutsModal': shortcutsModal,
        'languageModal' : languageModal,
        'languageSelect' : languageSelect,
        'mainMenu' : mainMenu,
        'mobileMainMenu': mobileMainMenu,
        'mobileMenuModal' : mobileMenuModal,
        'contactForm' : contactForm,
        'previews': previews,
        'copyright': copyright
    }
    
}

