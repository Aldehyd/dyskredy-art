import Modal from "./modalClass";
import LanguageModalInterface from "./models/languageModalInterface";

export default class LanguageModal extends Modal implements LanguageModalInterface {
    languageToConfirm: string;
    confirmButton: HTMLButtonElement | null | undefined;
    noButton: HTMLButtonElement | null;

    constructor(modal: string,controlButton: HTMLElement | null,focusOnDisplay: string | HTMLElement | null) {
        super(modal,controlButton,focusOnDisplay);

        this.languageToConfirm = 'english';
        this.confirmButton = document.querySelector('.modal-lang_yes') as HTMLButtonElement;
        this.noButton = document.querySelector('.modal-lang_no');

        this.confirm = this.confirm.bind(this);

        this.confirmButton?.addEventListener('click',this.confirm);
        this.noButton?.addEventListener('click',this.setDisplay);
    }

    confirm() {
        if(this.languageToConfirm === 'french') {
            localStorage.setItem('languageChange','true');
            localStorage.setItem('language','french');
            const windowLocation = window.location.href;
            if (windowLocation.includes('https://dyskredy-art.com/about')) {
                window.location.href = 'https://dyskredy-art.com/a-propos';
            } else if (windowLocation.includes('https://dyskredy-art.com/contact_en')) {
                window.location.href = 'https://dyskredy-art.com/contact';
            } else if (windowLocation.includes('https://dyskredy-art.com/accessibility')) {
                window.location.href = 'https://dyskredy-art.com/accessibilite';
            } else if (windowLocation.includes('https://dyskredy-art.com/technopolice_en')) {
                window.location.href = 'https://dyskredy-art.com/technopolice';
            } else if (windowLocation.includes('https://dyskredy-art.com/dreams')) {
                window.location.href = 'https://dyskredy-art.com/reves';
            } else if (windowLocation.includes('https://dyskredy-art.com/paintings')) {
                window.location.href = 'https://dyskredy-art.com/peintures';
            } else if (windowLocation.includes('https://dyskredy-art.com/photos_en')) {
                window.location.href = 'https://dyskredy-art.com/photos';
            } else if (windowLocation.includes('https://dyskredy-art.com/videos_en')) {
                window.location.href = 'https://dyskredy-art.com/videos';
            } else if(windowLocation.includes('https://dyskredy-art.com/en')) {
                window.location.href = 'https://dyskredy-art.com/';
            };
        } else {
            localStorage.setItem('language','english');
            localStorage.setItem('languageChange','true');
            const windowLocation = window.location.href;
            if (windowLocation.includes('https://dyskredy-art.com/a-propos')) {
                window.location.href = 'https://dyskredy-art.com/about';
            } else if (windowLocation.includes('https://dyskredy-art.com/contact') && !windowLocation.includes('https://dyskredy-art.com/contact_en')) {
                window.location.href = 'https://dyskredy-art.com/contact_en';
            } else if (windowLocation.includes('https://dyskredy-art.com/accessibilite')) {
                window.location.href = 'https://dyskredy-art.com/accessibility';
            } else if (windowLocation.includes('https://dyskredy-art.com/technopolice') && !windowLocation.includes('https://dyskredy-art.com/technopolice_en')) {
                window.location.href = 'https://dyskredy-art.com/technopolice_en';
            } else if (windowLocation.includes('https://dyskredy-art.com/reves')) {
                window.location.href = 'https://dyskredy-art.com/dreams';
            } else if (windowLocation.includes('https://dyskredy-art.com/peintures')) {
                window.location.href = 'https://dyskredy-art.com/paintings';
            } else if (windowLocation.includes('https://dyskredy-art.com/photos') && !windowLocation.includes('https://dyskredy-art.com/photos_en')) {
                window.location.href = 'https://dyskredy-art.com/photos_en';
            } else if (windowLocation.includes('https://dyskredy-art.com/videos') && !windowLocation.includes('https://dyskredy-art.com/videos_en')) {
                window.location.href = 'https://dyskredy-art.com/videos_en';
            } else if(windowLocation.includes('https://dyskredy-art.com/') && !windowLocation.includes('https://dyskredy-art.com/en')) {
                window.location.href = 'https://dyskredy-art.com/en';
            };
        };
    }
}