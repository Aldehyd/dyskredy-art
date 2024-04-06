
export default class Copyright {
    node: HTMLElement | null;
    container: HTMLElement | null;

    constructor() {
        this.node = document.querySelector(".copyright_text");
        this.container = document.querySelector(".copyright");

        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.container?.addEventListener('mouseover',()=> this.node?.classList.add('display'));
        this.container?.addEventListener('mouseout',()=> this.node?.classList.remove('display'));
        this.node?.addEventListener('focus',()=> this.node?.classList.add('display'));
        this.node?.addEventListener('focusout',()=> this.node?.classList.remove('display'));
        document.addEventListener('keydown',(e: KeyboardEvent)=> this.handleKeyDown(e));
    }

    handleKeyDown(e: KeyboardEvent) {
        if(e.key === 'Escape'){
            this.node?.classList.remove('display');
        };
    }
}


