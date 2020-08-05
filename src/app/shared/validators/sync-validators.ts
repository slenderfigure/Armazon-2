import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

const EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PHONE_REGX = /^[1]?[-.\s]?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;

const INVALID_PASSWORDS = [
  'hello',
  'abcdef',
  '00000',
  '012345'
];

export class OwnValidators {
  static mobile(control: AbstractControl): ValidationErrors | null {
    return !PHONE_REGX.test(control.value) ? 
      { mobile: { invalid: true } } : null;
  }

  static email(control: AbstractControl): ValidationErrors | null {
    return !EMAIL_REGX.test(control.value) ? 
      { email: { invalid: true }} : null;
  }

  static password(control: AbstractControl): ValidationErrors | null {
    return control.value && INVALID_PASSWORDS.some(pass => {
      return control.value.match(pass);
    }) ? { password: { invalid: true } } : null;
  }

  static passwordMatch(form: FormGroup): ValidationErrors | null {
    return form.get('rePassword').value !== form.get('password').value ? 
      { rePassword: { doesnotMatch: true } } : null;
  }
  
  static imageValidator(control: AbstractControl): ValidationErrors | null {
    const files: File[] = control.value;
    const allowedExts = ['image/jpeg', 'image/png', 'image/webp'];
    const maxImgSize = 10000000;
    let validExt;
    let validSize;

    if (files) {
      files.forEach(file => {
        if (file && typeof file !== 'string') {
          validExt = allowedExts.some(ext => ext == file.type);
          validSize = file.size <= maxImgSize;
        }
      });
    }

    return !validExt ? { extension: { allowed: allowedExts.join(', ') } } :
      !validSize ? { size: { maxSize: maxImgSize } } : null;
  }
}