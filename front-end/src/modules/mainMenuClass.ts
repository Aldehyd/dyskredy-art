import SubMenuInterface from './models/subMenuInterface';
import { ShortcutsType } from './models/shortcutsType';
import MainMenuInterface from './models/mainMenuInterface';

export default class MainMenu implements MainMenuInterface {
    node: HTMLElement | null;
    mainLinks: NodeListOf<HTMLAnchorElement> | undefined;
    mainLinksShortcuts: ShortcutsType;
    subMenus: SubMenuInterface[];
    autoDisplaySubMenus: boolean;

    constructor(mainMenu: string) {
        
        this.node = document.getElementById(mainMenu);
        this.mainLinks = this.node?.querySelectorAll('.nav_link_heading');

        this.mainLinksShortcuts = {} as ShortcutsType;
        if(this.mainLinks) {
            for(let i=0; i < this.mainLinks.length; i++) {
                const firstLetter = this.mainLinks[i].innerText.substring(0,1).toLowerCase();
                if(this.mainLinksShortcuts[firstLetter as keyof ShortcutsType]) {
                    this.mainLinksShortcuts[firstLetter as keyof ShortcutsType]?.push(this.mainLinks[i]);
                } else {
                    this.mainLinksShortcuts[firstLetter as keyof ShortcutsType]=[this.mainLinks[i]];
                };
            };
        };
        
        this.subMenus = [];
        let subMenus = this.node ? Array.from(this.node.querySelectorAll('.submenu')): null;
        subMenus?.forEach(submenu => {
            class SubMenu implements SubMenuInterface{
                node: Element | null;
                controlLink: HTMLAnchorElement | null;
                links: NodeListOf<HTMLAnchorElement>;
                isExpanded: boolean;
                shortcuts: ShortcutsType;
                
                constructor(submenu: Element) {
                    this.node = submenu;
                    this.controlLink = submenu.previousElementSibling as HTMLAnchorElement;
                    this.links = submenu.querySelectorAll('a');
                    this.isExpanded = false;
                    this.shortcuts = {} as ShortcutsType;
                }
            }
            let newSubMenu = new SubMenu(submenu);
            this.subMenus.push(newSubMenu);
        });
        for(let submenu of this.subMenus) {
            for(let j=0; j < submenu.links.length; j++) {
                const firstLetter: string = submenu.links[j].innerText.substring(0,1).toLowerCase();
                if(submenu.shortcuts[firstLetter as keyof ShortcutsType]) {
                    submenu.shortcuts[firstLetter as keyof ShortcutsType]?.push(submenu.links[j]);
                } else {
                    submenu.shortcuts[firstLetter as keyof ShortcutsType]=[submenu.links[j]];
                };
            };
        };
        
        this.autoDisplaySubMenus = false;

        this.handleEscapeOnDocument = this.handleEscapeOnDocument.bind(this);
        this.handleFocusOnMainLink = this.handleFocusOnMainLink.bind(this);
        this.handleMouseOverMainLink = this.handleMouseOverMainLink.bind(this);
        this.handleMouseOutMainLink = this.handleMouseOutMainLink.bind(this);
        this.openSubMenu = this.openSubMenu.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        document.addEventListener('keydown',(e)=>this.handleEscapeOnDocument(e));
        this.node?.addEventListener('keydown',(e)=>this.handleKeyDown(e));
        this.mainLinks?.forEach(link => link.parentElement?.addEventListener('mouseover',()=> this.handleMouseOverMainLink(link.parentElement)));
        this.mainLinks?.forEach(link => link.parentElement?.addEventListener('mouseout',()=> this.handleMouseOutMainLink(link.parentElement)));
    }

    handleFocusOnMainLink(link: HTMLAnchorElement | null) {
        this.mainLinks?.forEach(link => link.setAttribute('tabindex','-1'));
        link?.setAttribute('tabindex','0');
        
        for(let submenu of this.subMenus) {
            if(submenu.controlLink === link) {
                if(this.autoDisplaySubMenus) {
                    this.openSubMenu(submenu);
                }; 
            };
        };
    }

    handleMouseOverMainLink(line: HTMLElement | null) {
        for(let submenu of this.subMenus) {
            if(submenu.controlLink?.parentElement === line) {
                    if(!submenu.isExpanded) {
                        this.openSubMenu(submenu);
                    };
            };
        };
    }
    handleMouseOutMainLink(line: HTMLElement | null) {
        for(let submenu of this.subMenus) {
            if(submenu.controlLink?.parentElement === line) {
                    if(submenu.isExpanded) {
                        this.closeSubMenu(submenu);
                    };
            };
        };
    }

    closeSubMenu(subMenu: SubMenuInterface) {
        subMenu.isExpanded = false;
        subMenu.node?.classList.remove('display');
        subMenu.node?.parentElement?.classList.remove('submenu-displayed');
        subMenu.controlLink?.setAttribute('aria-expanded','false');
        subMenu.controlLink?.setAttribute('tabindex','0');

        subMenu.controlLink?.querySelector('.navlink-arrow')?.classList.remove('up');
    }

    openSubMenu(subMenu: SubMenuInterface) {
        for(let submenu of this.subMenus) {
            this.closeSubMenu(submenu);
        };

        subMenu.isExpanded = true;
        subMenu.node?.classList.add('display');
        subMenu.node?.parentElement?.classList.add('submenu-displayed');
        subMenu.controlLink?.classList.add('submenu-displayed');
        subMenu.controlLink?.setAttribute('aria-expanded','true');
        subMenu.controlLink?.setAttribute('tabindex','-1');

        subMenu.controlLink?.querySelector('.navlink-arrow')?.classList.add('up');
    }

    handleEscapeOnDocument(e: KeyboardEvent) {
        console.log('escape')
        if(e.key === 'Escape' && !this.node?.contains(document.activeElement)) {
            console.log('close submenus')
            this.subMenus.forEach(submenu => submenu?.node?.classList.remove('display'));
        };
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
            case 'ArrowRight':
                e.preventDefault();
                for(let submenu of this.subMenus) {
                    this.closeSubMenu(submenu);
                    if(submenu.node?.contains(document.activeElement)) {
                        submenu.controlLink?.focus();
                    };
                };
                
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
            case 'ArrowLeft':
                e.preventDefault();
                for(let submenu of this.subMenus) {
                    this.closeSubMenu(submenu);
                    if(submenu.node?.contains(document.activeElement)) {
                        submenu.controlLink?.focus();
                    };
                };
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
            case 'ArrowDown':
                e.preventDefault();
                for(let submenu of this.subMenus) {
                    if(submenu.node?.contains(document.activeElement)) {
                        let index = Array.from(submenu.links).indexOf(document.activeElement as HTMLAnchorElement);
                        if(index === submenu.links.length-1) {
                            index = 0;
                        } else {
                            index++;
                        };
                        submenu.links[index].focus();
                    };
                };
                if(this.mainLinks)
                    for(let mainlink of Array.from(this.mainLinks)) {
                        if(mainlink === document.activeElement) {
                            for(let submenu of this.subMenus) {
                                if(submenu.controlLink === document.activeElement) {
                                    if(!this.autoDisplaySubMenus) {
                                        this.openSubMenu(submenu);
                                        this.autoDisplaySubMenus = true;
                                    };
                                    submenu.links[0].focus();
                                };
                            };
                        };
                    };
                break;
            case 'ArrowUp':
                e.preventDefault();
                for(let submenu of this.subMenus) {
                    if(submenu.node?.contains(document.activeElement)) {
                        let index = Array.from(submenu.links).indexOf(document.activeElement as HTMLAnchorElement);
                        if(index === 0) {
                            index = submenu.links.length-1;
                        } else {
                            index--;
                        };
                        submenu.links[index].focus();
                    };
                };
                if(this.mainLinks)
                    for(let mainlink of Array.from(this.mainLinks)) {
                        if(mainlink === document.activeElement) {
                            for(let submenu of this.subMenus) {
                                if(submenu.controlLink === document.activeElement) {
                                    if(!this.autoDisplaySubMenus) {
                                        this.openSubMenu(submenu);
                                        this.autoDisplaySubMenus = true;
                                    };
                                    submenu.links[submenu.links.length-1].focus();
                                };
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
                                if(index !== undefined)
                                    index++;
                            };
                            if(index !== undefined)
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
                                        if(index !== undefined) 
                                            index++;        
                                    };
                                    if(index !== undefined)
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