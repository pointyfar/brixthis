import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MaterialModule } from './../material.module';
import { ArrayTypeComponent } from './array-type/array-type.component';
import { PanelWrapperComponent } from './panel-wrapper/panel-wrapper.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorpickerComponent } from './colorpicker/colorpicker/colorpicker.component';
import { ColorpickerTypeComponent } from './colorpicker/colorpicker-type/colorpicker-type.component';

@NgModule({
  declarations: [
    ArrayTypeComponent,
    PanelWrapperComponent,
    ColorpickerComponent,
    ColorpickerTypeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
      types: [
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {type: 'number'},
          }
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            }
          }
        },
        { name: 'object', extends: 'formly-group' },
        { name: 'boolean', extends: 'checkbox' },
        {
          name: 'textarea',
          defaultOptions: {
            templateOptions: {
              rows: 5
            }
          }
        },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'enum', extends: 'select' },
        { 
          name: 'colorpicker', 
          component: ColorpickerTypeComponent
        }
      ],
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
      ],
    })
  ],
  exports: [
    FormlyModule,
    FormlyMaterialModule,
    ArrayTypeComponent,
    PanelWrapperComponent
  ]
})
export class FormBuilderModule { }
