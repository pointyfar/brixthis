import { Component } from '@angular/core';
import { FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';

@Component({
  selector: 'formly-array-type',
  templateUrl:'./array-type.component.html'
})
export class ArrayTypeComponent extends FieldArrayType {
  constructor() {
    super();
  }
}
