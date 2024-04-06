import FormInterface from "./models/formInterface";

export default class Form implements FormInterface {
    node: HTMLElement | null;
    language: string | null;
    fields: NodeListOf<HTMLElement> | undefined;
    requiredFields: NodeListOf<HTMLElement> | undefined;
    invalidFields: HTMLElement[] | null;
    invalidFieldsAlerts: NodeListOf<HTMLElement> | undefined;
    submitButton: HTMLElement | null | undefined;
    pageTitleElement: HTMLElement | null;
    pageTitleText: string | undefined;
    isReadyToSubmit: boolean;
    successMessage: HTMLElement | null | undefined;
    submitErrorMessage: HTMLElement | null | undefined;
    invalidFieldsMainAlert: HTMLElement | null | undefined;
    invalidCaptchaMainAlert: HTMLElement | null | undefined;

    constructor(form: HTMLElement | null) {
        this.node = form;
        this.language = document.documentElement.getAttribute('lang');
        this.fields = this.node?.querySelectorAll('input:not([type=submit]),textarea');
        this.requiredFields = this.node?.querySelectorAll('input[required],textarea[required]');
        this.invalidFields = [];
        this.invalidFieldsAlerts = this.node?.querySelectorAll('.invalid-field-alert');
        this.submitButton = this.node?.querySelector('input[type=submit]');
        this.pageTitleElement = document.querySelector('title');
        this.pageTitleText = this.pageTitleElement?.innerText;

        this.isReadyToSubmit = false;

        this.successMessage = this.node?.querySelector('.success-message');
        this.submitErrorMessage = this.node?.querySelector('.submit-error-message');
        this.invalidFieldsMainAlert = this.node?.querySelector('.invalid-fields-message');
        this.invalidCaptchaMainAlert = this.node?.querySelector('.invalid-captcha-message');
        
        this.checkRequiredFields = this.checkRequiredFields.bind(this);
        this.applyEffect = this.applyEffect.bind(this);
        this.setSuccessForm = this.setSuccessForm.bind(this);
        this.setFailForm = this.setFailForm.bind(this);
        this.cleanMainErrorMessages = this.cleanMainErrorMessages.bind(this);
        this.cleanInvalidFields = this.cleanInvalidFields.bind(this);
        this.resetForm = this.resetForm.bind(this);

        this.requiredFields?.forEach(field => field.addEventListener('invalid', (e)=> e.preventDefault()));
        this.submitButton?.addEventListener('click', ()=> {
            this.checkRequiredFields();
        });
        this.node?.addEventListener('submit',(e)=> {
            e.preventDefault();

            const captchaClientResponse = grecaptcha.getResponse();
        
            if(captchaClientResponse.length > 0) { //check on client side
                let formData = new FormData(this.node as HTMLFormElement)
                let captchaServerResponse = new URLSearchParams(formData as any)
            
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: captchaServerResponse
                };

                fetch('/app/check_captcha',options) //check on server side
                    .then(res => {
                        if(res.ok) {
                            this.cleanMainErrorMessages();
                            this.applyEffect();
                        } else {
                            this.setFailForm();
                        };
                    })
                    .catch(err => {
                        this.setFailForm();
                    })
            } else {
                this.cleanMainErrorMessages();
                this.invalidCaptchaMainAlert?.classList.add('display');
            };
        });
    }

    checkRequiredFields() {
        this.isReadyToSubmit = true;
        this.cleanInvalidFields();
        this.invalidFields = [];
        this.requiredFields?.forEach(field => {
            if(field.matches('input:invalid') || field.matches('textarea:invalid')) {
                this.invalidFields?.push(field);
                field.classList.add('invalid');
                field.previousElementSibling?.classList.add('display');
                const alertId = field.previousElementSibling?.getAttribute('id');
                if(alertId)
                    field.setAttribute('aria-describedby',alertId)
                this.isReadyToSubmit = false;
            };
        });

        if(!this.isReadyToSubmit) {
            this.cleanMainErrorMessages();
            this.invalidFieldsMainAlert?.classList.add('display');
            if(this.pageTitleElement && this.pageTitleText !== undefined) {
                this.pageTitleElement.innerText = this.pageTitleText;
                if(this.language === 'fr') {
                    this.pageTitleElement.innerText = this.pageTitleText + "- Erreur: champ(s) invalide(s) !"
                } else {
                    this.pageTitleElement.innerText = this.pageTitleText + "- Error: invalid field(s) !"
                };
            };
            if(this.invalidFields)
                this.invalidFields[0].focus();
        };
    }

    applyEffect() {
        //depends on form
    }

    setSuccessForm() {
        this.resetForm();
        this.successMessage?.classList.add('display');
        if(this.pageTitleElement && this.pageTitleText !== undefined) {
            this.pageTitleElement.innerText = this.pageTitleText;
            if(this.language === 'fr') {
                this.pageTitleElement.innerText = this.pageTitleText + "- Message envoyé avec succès !"
            } else {
                this.pageTitleElement.innerText = this.pageTitleText + "- Message successfully sent !"
            };
        };
    }

    setFailForm() {
        this.cleanMainErrorMessages();
        this.submitErrorMessage?.classList.add('display');
        if(this.pageTitleElement && this.pageTitleText !== undefined) {
            this.pageTitleElement.innerText = this.pageTitleText;
            if(this.language === 'fr') {
                this.pageTitleElement.innerText = this.pageTitleText + "- Erreur, formulaire non soumis !"
            } else {
                this.pageTitleElement.innerText = this.pageTitleText + "- Error, form not submitted !"
            };
        };
    }

    cleanMainErrorMessages() {
        this.successMessage?.classList.remove('display');
        this.submitErrorMessage?.classList.remove('display');
        this.invalidFieldsMainAlert?.classList.remove('display');
        this.invalidCaptchaMainAlert?.classList.remove('display');
    }

    cleanInvalidFields() {
        (this.fields as NodeListOf<HTMLInputElement | HTMLTextAreaElement>).forEach(field => {
            field.removeAttribute('aria-describedby');
            field.classList.remove('invalid');
        });
        this.invalidFieldsAlerts?.forEach(alert => alert.classList.remove('display'));
    }

    resetForm() {
        (this.fields as NodeListOf<HTMLInputElement | HTMLTextAreaElement>).forEach(field => {
            field.value = "";
        });
        this.cleanInvalidFields();
        this.cleanMainErrorMessages();
        if(this.pageTitleElement && this.pageTitleText !== undefined)
            this.pageTitleElement.innerText = this.pageTitleText;
        this.isReadyToSubmit = false;
    }
}