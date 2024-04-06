

export default function handleTopPage(topPage: HTMLDivElement,minScroll: number) { 

    const scroll: number = document.documentElement.scrollTop; 
    
    if(scroll > minScroll) {
        topPage.classList.add("display");
        if(scroll >= document.documentElement.scrollHeight - window.innerHeight) {
            topPage.classList.add("scroll-end");
        } else {
            topPage.classList.remove("scroll-end");
        };
    } else {
        topPage.classList.remove("display");
    };
};