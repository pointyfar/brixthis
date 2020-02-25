import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Validators } from '@angular/forms';
import { setContrastColor } from './../colorpicker/colorpicker.component';

@Component({
  selector: 'bx-colorpicker-type',
  templateUrl: './colorpicker-type.component.html',
  styleUrls: ['./colorpicker-type.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ColorpickerTypeComponent extends FieldType {
  
  colorVal: string = "#FFFFFF"
  colorName: string = ""

  backgroundColor = "#FF0000"
  textColor = "#000000"
  showErrorMsg = false;

  allowCustom = false;

  ngOnInit(){
    this.formControl.setValidators(Validators.pattern(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i))
    this.allowCustom = this.to.allowcustom ? true : false;
  }

  changeColorManual(color){
      if(this.formControl.valid){

      let colorfix = "";
      if(color.length < 6 ) {
        const h = color.replace(/#/, '');
        colorfix = "#" + h.split('').map(function (hex) {
          return hex + hex;
        }).join('')
      }

      this.setColor(colorfix, colorfix)
      this.showErrorMsg = false;
    } else {
      this.showErrorMsg = true;
    }
    
  }

  receiveColor(color){
    this.setColor(color.value, color.label, color.contrast)
  }

  setColor(value, label, contrast?){

    this.colorVal = value
    this.colorName = label ? label : value
    this.textColor = contrast? contrast : setContrastColor(value)

    this.formControl.setValue(value)
  }

}
