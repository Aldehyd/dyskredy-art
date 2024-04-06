import AccessibilityInterface from "./models/accessibilityInterface";
import PreviewsInterface from "./models/previewsInterface";

export default class Previews implements PreviewsInterface {
    accessibility: AccessibilityInterface;
    previews: NodeListOf<HTMLAnchorElement> | undefined;
    previewHeadings: NodeListOf<HTMLElement> | undefined;
    previewPictures: NodeListOf<HTMLElement> | undefined;
    offsets: {[key: string]: number;};

    constructor(accessibility: AccessibilityInterface) {
        this.accessibility = accessibility;
        this.previews = document.querySelectorAll('.preview');
        this.offsets = {}; 
        this.previews.forEach(preview => this.offsets[preview.classList[1]] = preview.offsetTop);
        
        this.handleAppear = this.handleAppear.bind(this);

        window.addEventListener('scroll',()=> this.handleAppear());
        this.previews.forEach(preview => preview.addEventListener('focus',()=> this.handleFocus(preview)));
    }

    handleAppear() {
        if(!this.accessibility.isAnimations) {
            this.previews?.forEach(preview => {
                preview.classList.add('display');
            });
        } else {
            for(let prop in this.offsets) {
                if(document.documentElement.scrollTop > this.offsets[prop]-250) {
                    const previewToDisplay = Array.from(this.previews as NodeListOf<HTMLElement>).find(preview => preview.classList.contains(prop));
                    previewToDisplay?.classList.add("display");
                };
            };
        };
    };

    handleFocus(preview: HTMLAnchorElement) {
        scrollTo(0,preview.offsetTop+150); //'+150' pour être sûr de faire apparaître le suivant
    }
}