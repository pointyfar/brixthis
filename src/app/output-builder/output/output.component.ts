import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { UtilitiesService } from './../../services/utilities.service';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl} from '@angular/forms';
import * as yamljs from 'yamljs';
import * as tomlify from 'tomlify-j0.4';
import * as FileSaver from 'file-saver/src/FileSaver';
import deepcopy from "ts-deepcopy";

@Component({
  selector: 'bx-output',
  templateUrl: './output.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class OutputComponent implements OnInit {

  jsonFormat: any = {};
  jsonData: "";
  yamlData: "";
  tomlData: "";
  codeOptions = ["JSON", "YAML", "TOML"];
  selectedCode = "JSON";
  hasY = false;
  hasT = false;
  note = "";
  selected = new FormControl(0);

  constructor(
    public dialogRef: MatDialogRef<OutputComponent>,
    private _us: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.note = this.data.note? this.data.note : "";

    let config = this._us.stripNulls({...this.data.site});
    

    let params = {};
    if(this.data.params) {
      params['params'] = deepcopy(this.data.params)
    }

    if(params['params']){
      config['params'] = this._us.stripNulls({...params['params']})
    }
    
    this.jsonFormat = this.cleanResult(config);
    this.getYaml(this.jsonFormat);
    this.getToml(this.jsonFormat);
  }

  processParams(params){
    let result = deepcopy(params)
    return result;
  }

  processWidgets(widgets){
    let result = {};
    if (widgets.length > 0) {
      if(!result.hasOwnProperty('params')){
        result['params'] = {};
      }
      result['params']['widgets'] = widgets;
    }
    
    return result 
  }

  cleanResult(config){
    let result = {};

    /* Copying config values to this.jsonFormat. */
    /* First copy non-object values */
    for(let k in config){
      if(config.hasOwnProperty(k)){
        if((typeof config[k]) !== "object"){
          result[k] = deepcopy(config[k])
        }
      }
    }
    /* To make sure objects are last */
    for(let k in config){
      if(config.hasOwnProperty(k)){
        if((typeof config[k]) === "object"){
          result[k] = deepcopy(config[k])
        }
      }
    }

    return result
  }

  getYaml(data) {
    try {
      let doc = yamljs.stringify(data, 5, 2); 
        this.yamlData = doc;
        this.hasY = true;
    } catch (e) {
      console.log('error!',e);
    }
    
  }

  getToml(data) {
    try {
      this.tomlData = tomlify.toToml(data, {
        space: 2, // indent with 2 spaces
        replace: function (key, value) {
            if( 
              ((typeof value) === (typeof 1.0)) &&
              ( value % 1 === 0 )
            ) {
              return value.toFixed(0)
            }
            return false;
        }
      });
      this.hasT = true;
    } catch (err) {
      console.log('error!',err);
    }
  }

  copyToClipboard(containerid) {
    let elementId = `copy${this.codeOptions[containerid]}`;
    let textarea = document.createElement('textarea');
    textarea.id = 't';
    textarea.style.height = '0';
    document.body.appendChild(textarea);
    textarea.value = document.getElementById(elementId).innerText;
    let selector = <any>document.querySelector('#t');
    selector.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  tab($event) {
    this.selected.setValue($event);
  }

  downloadCode(code) {
    let blob;

    let filename = (this.data['file'].length > 0 ? this.data['file'] : "config") + "." + this.codeOptions[code].toLowerCase();

    switch(this.codeOptions[code]) {
      case "JSON": {
        blob = new Blob([JSON.stringify(this.jsonFormat,null,2)], {type : 'application/json'});
        break;  
      }
      case "YAML": {
        blob = new Blob([this.yamlData], {type : 'text/plain'});
        break;
      }
      case "TOML": {
        blob = new Blob([this.tomlData], {type : 'text/plain'});
        break;
      }
    }
    FileSaver.saveAs(blob, filename);
  }
  cancel(): void {
      this.dialogRef.close();
    }
  }

