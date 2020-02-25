import { Component, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bx-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ColorpickerComponent{

  @Input() palette: string[];
  @Input() allowCustom: boolean;
  
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() { }


  changeColor(color){
    let contrast = setContrastColor(color.value);
    color['contrast'] = contrast
    this.event.emit(color)
  }

  getContrastColor(color){
    return setContrastColor(color);
  }

  /**
   * Based heavily on https://medium.com/@dancornilov/angular-5-color-picker-component-be-colorfully-7e8b12c27ac0
   */



  
}

export function setContrastColor(color: string):string {
  
  function hexToLuma(color) {
    const hex   = color.replace(/#/, '');
    const r     = parseInt(hex.substr(0, 2), 16);
    const g     = parseInt(hex.substr(2, 2), 16);
    const b     = parseInt(hex.substr(4, 2), 16);
    
    return [
      0.299 * r,
      0.587 * g,
      0.114 * b
    ].reduce((a, b) => a + b) / 255;
  }
  
  let luma = hexToLuma(color)

  if(luma <= 0.5 ) {
    return "#EEEEEE"
  } else {
    return "#111111"
  }
}

