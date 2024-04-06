
export default function setActiveStyleSheet(id: string) {

    const styleSheets: NodeListOf<any> = document.head.querySelectorAll('link[rel="stylesheet"]');

    Array.from(styleSheets).forEach(sheet => {
        if(sheet.getAttribute('href') === `${id}.css`) {
            sheet.disabled = false;
        } else if(!sheet.getAttribute('href').includes('google')) {
            sheet.disabled = true;
        };
    });
}