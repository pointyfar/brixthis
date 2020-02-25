import { Component, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'bx-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ColorpickerComponent{

  @Input() palette: string[];
  
  @Output() event: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() { }


  changeColor(color){
    this.event.emit(color)
  }

  /**
   * Based heavily on https://medium.com/@dancornilov/angular-5-color-picker-component-be-colorfully-7e8b12c27ac0
   */



  
}
