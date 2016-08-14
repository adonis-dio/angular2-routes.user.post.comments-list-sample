import {Control} from '@angular/common';

export class SignupValidators {

    static shouldBeUnique(control: Control) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                if (control.value == 'mosh')
                    resolve({ shouldBeUnique: true });
                else
                    resolve(null);
            }, 1000);
        });
    }

    static cannotContainSpace(control: Control) {
        if (control.value.indexOf(' ') >= 0)
            return { cannotContainSpace: true };

        return null;
    }
    
    static emailFormat(control: Control){
        var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = regEx.test(control.value);
        return valid ? null : { email: true };
    }
}
