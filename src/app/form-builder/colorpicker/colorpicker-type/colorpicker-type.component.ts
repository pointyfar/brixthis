import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'bx-colorpicker-type',
  templateUrl: './colorpicker-type.component.html',
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
    console.log(this.allowCustom)
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

      this.setColor(colorfix)
      this.showErrorMsg = false;
    } else {
      this.showErrorMsg = true;
    }
    
  }

  receiveColor(color){
    this.setColor(color.value, color.label)
  }

  setColor(value, label?){

    this.colorVal = value
    this.colorName = label
    this.textColor = this.setContrastColor(value)

    this.formControl.setValue(value)
  }

  setContrastColor(color: string) {
    let luma = this.hexToLuma(color)
    if(luma <= 0.5 ) {
      return "#FFFFFF"
    } else {
      return "#000000"
    }
  }

  hexToLuma(colour) {
    const hex   = colour.replace(/#/, '');
    const r     = parseInt(hex.substr(0, 2), 16);
    const g     = parseInt(hex.substr(2, 2), 16);
    const b     = parseInt(hex.substr(4, 2), 16);

    return [
        0.299 * r,
        0.587 * g,
        0.114 * b
    ].reduce((a, b) => a + b) / 255;
  }
}
