import Form from "./formClass";

export default class ContactForm extends Form {
    userMail: HTMLInputElement | null;
    subject: HTMLInputElement | null;
    messageContent: HTMLTextAreaElement | null;
    temporaryMessage: HTMLElement | null;

    constructor(form: HTMLElement | null) {
        super(form);

        this.userMail = document.getElementById('mail') as HTMLInputElement;
        this.subject = document.getElementById('subject') as HTMLInputElement;
        this.messageContent = document.getElementById('messageContent') as HTMLTextAreaElement;
        this.temporaryMessage = document.querySelector('.waiting-message');

        this.applyEffect = this.applyEffect.bind(this);
    }   

    applyEffect() {
        //display temporary message
        this.temporaryMessage?.classList.add('display');

        // encode fields values for security
        const replaceSpecialChars = (text: string | undefined) => {
            interface mapInterface {
                [key: string]: string;
            }
            const map: mapInterface = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text?.replace(/[&<>"']/g, function(m) { return map[m]; });
        }
        
        let mailData = {
            userMail : replaceSpecialChars(this.userMail?.value),
            subject: replaceSpecialChars(this.subject?.value),
            messageContent: replaceSpecialChars(this.messageContent?.value)
        };

        const options = {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(mailData)
                };
        fetch('/app/send_mail',options)
        .then(res => {
            this.temporaryMessage?.classList.remove('display');
            if(res.ok) {
                this.setSuccessForm();
            } else {
                this.setFailForm();
            };
        })
        .catch(err => {
            this.temporaryMessage?.classList.remove('display');
            this.setFailForm();
        })
    };
       
}