import MainMenu from "./mainMenuClass";
import MainMenuInterface from "./models/mainMenuInterface";
import { ShortcutsType } from "./models/shortcutsType";

export default class VerticalMainMenu extends MainMenu implements MainMenuInterface {
    constructor(mainMenu: string) {
        super(mainMenu);

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e: KeyboardEvent) {
        const temporaryAlphabet = 'abcdefghijiklmnopqrstuvwxyz';
        const alphabet = temporaryAlphabet.split('');
       
        switch(e.key) {
            case 'Escape':
                this.autoDisplaySubMenus = false;
                for(let submenu of this.subMenus) {
                    this.closeSubMenu(submenu);
                    if(submenu.node?.contains(document.activeElement)) {
                        submenu.controlLink?.focus();
                        if(submenu.controlLink)
                        this.handleFocusOnMainLink(submenu.controlLink);
                    };
                };
                break;
            case 'Tab':
                setTimeout(()=>{
                    for(let submenu of this.subMenus) {
                        if(submenu.isExpanded) {
                            submenu.isExpanded = false;
                            this.closeSubMenu(submenu);
                        };
                    };
                    this.autoDisplaySubMenus = false;
                },50);
                break;
            case 'ArrowDown':
                e.preventDefault();
                if(this.mainLinks) {
                    for(let mainlink of Array.from(this.mainLinks)) {
                        if(mainlink === document.activeElement) {
                            let index = Array.from(this.mainLinks).indexOf(mainlink);
                            if(index === this.mainLinks.length-1) {
                                index = 0;
                            } else {
                                index++;
                            };
                            this.mainLinks[index].focus();
                            this.handleFocusOnMainLink(this.mainLinks[index]);
                            break;
                        };
                    };
                };
                
                break;
            case 'ArrowUp':
                e.preventDefault();
                if(this.mainLinks) {
                    for(let mainlink of Array.from(this.mainLinks)) {
                        if(mainlink === document.activeElement) {
                            let index = Array.from(this.mainLinks).indexOf(mainlink);
                            if(index === 0) {
                                index = this.mainLinks.length-1;
                            } else {
                                index--;
                            };
                            this.mainLinks[index].focus();
                            this.handleFocusOnMainLink(this.mainLinks[index]);
                            break;
                        };
                    };
                };
                
                break;
            default:
                break;
        };

        if(alphabet.includes(e.key)) {
            if(this.mainLinks)
                if(Array.from(this.mainLinks).includes(document.activeElement as HTMLAnchorElement)) {
                    let mainLinkToFocus = null;
                    if(this.mainLinksShortcuts[e.key as keyof ShortcutsType]) {
                        if(this.mainLinksShortcuts[e.key as keyof ShortcutsType]?.includes(document.activeElement as HTMLAnchorElement)) {
                            let index: number | undefined = this.mainLinksShortcuts[e.key as keyof ShortcutsType]?.indexOf(document.activeElement as HTMLAnchorElement);
                            if(index === this.mainLinksShortcuts[e.key as keyof ShortcutsType]!.length-1) {
                                index = 0;
                            } else {
                                if(index)
                                    index++;
                            };
                            if(index)
                                mainLinkToFocus = this.mainLinksShortcuts[e.key as keyof ShortcutsType]![index];
                        } else {
                            mainLinkToFocus = this.mainLinksShortcuts[e.key as keyof ShortcutsType]![0];
                        };
                        mainLinkToFocus?.focus();
                        if(mainLinkToFocus)
                            this.handleFocusOnMainLink(mainLinkToFocus);
                    };
                } else {
                    let subLinkToFocus = null;
                    for(let submenu of this.subMenus) {
                        if(Array.from(submenu.links).includes(document.activeElement as HTMLAnchorElement)) {
                            if(submenu.shortcuts[e.key as keyof ShortcutsType]) {
                                if(submenu.shortcuts[e.key as keyof ShortcutsType]?.includes(document.activeElement as HTMLAnchorElement)) {
                                    let index = submenu.shortcuts[e.key as keyof ShortcutsType]?.indexOf(document.activeElement as HTMLAnchorElement);
                                    if(index === submenu.shortcuts[e.key as keyof ShortcutsType]!.length-1) {
                                        index = 0;
                                    } else {
                                        if(index)
                                            index++;
                                    };
                                    if(index)
                                        subLinkToFocus = submenu.shortcuts[e.key as keyof ShortcutsType]![index];
                                } else {
                                    subLinkToFocus = submenu.shortcuts[e.key as keyof ShortcutsType]![0];
                                };
                                subLinkToFocus?.focus();
                            };
                        };
                    };
                };
        };
    }
} 