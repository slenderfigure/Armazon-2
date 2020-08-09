import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormField } from '../form-field.class';
import { DynamicFormService } from '../dynamic-form.service';

@Component({
  selector: 'dynamic-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: [
    './text-field.component.scss',
    '../dynamic-form.component.scss'
  ]
})
export class TextFieldComponent implements OnInit {
  @Input() field: FormField;
  form: FormGroup;
  enableValidCSS: boolean;
  showPassword: boolean = false;
 
  get control() { return this.form.get(this.field.fieldKey); }

  constructor(private ds: DynamicFormService) { }

  ngOnInit(): void {
    this.form = this.ds.form;
    this.enableValidCSS = this.ds.enableValidCSS;
  }

}
