import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Validators } from '@angular/forms';
import { setContrastColor } from './../colorpicker/colorpicker.component';

import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';

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

  rainbow = [
    { "value": "#5e4fa2" } ,
    { "value": "#3288bd" } ,
    { "value": "#66c2a5" } ,
    { "value": "#abdda4" } ,
    { "value": "#e6f598" } ,
    { "value": "#ffffbf" } ,
    { "value": "#fee08b" } ,
    { "value": "#fdae61" } ,
    { "value": "#f46d43" } ,
    { "value": "#d53e4f" } ,
    { "value": "#9e0142" } ,
    { "value": "#000000" } ,
    { "value": "#ffffff" } 
  ]
  
  @ViewChild('paintInput', {static: true}) paintInput: ElementRef;

  ngOnInit(){
    this.formControl.setValidators(Validators.pattern(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i))
    this.allowCustom = this.to.allowcustom ? true : false;

    fromEvent(this.paintInput.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
          console.log(event.target.value)
          return event.target.value;
        })
        // Time in milliseconds between key events
        ,debounceTime(1500)        
        // If previous query is diffent from current   
        ,distinctUntilChanged()
        // subscription for response
        ).subscribe((text: string) => {
          // this.isSearching = true;
          console.log(text)
          this.changeColorManual(text)
      });


  }

  changeColorManual(color){
    console.log(color)
      if(this.formControl.valid){
      this.setColor(color, color)
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
