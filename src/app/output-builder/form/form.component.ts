import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormGroup} from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'bx-form',
  templateUrl: './form.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class FormComponent implements OnInit {
  form = new FormGroup({});

  original = {};

  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  model: any = {};

  title = '';
  notes = [];

  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }


  ngOnInit() {
    this.model = this.data.inputModel;
    this.original = {...this.data.inputModel};
    this.fields = this.data.jsonSchemaFields;
    this.title = this.data.title;
    this.notes = this.data.notes;
  }
  saveForm() {
    if (this.form.valid) {
      this.data.result = this.form.value;
      this.dialogRef.close(this.form.value);
    } else {
      this.dialogRef.close(this.form.value);
    }
  }
  cancel(): void {
    this.form.reset(this.original);
    this.dialogRef.close();
  }
}
