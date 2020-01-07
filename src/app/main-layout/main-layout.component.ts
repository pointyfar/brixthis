import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OutputComponent } from './../output-builder/output/output.component';
import { UtilitiesService } from './../services/utilities.service';


@Component({
  selector: 'bx-main-layout',
  templateUrl: './main-layout.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class MainLayoutComponent implements OnInit {
  
  widgetsPath: string;
  configPath: string;
  assetsBasePath: string;
  helpPath: string;

  layoutWidgetsSource: string ; 
  layoutConfigSource: string;

  
  layoutSource: string;
  settingsSource: string;
  
  hasResults = false;
  
  configResult: any = {};
  layoutWidgetsResult: any = [];
  layoutConfigResult: any = {};
  
  constructor(
    public dialog: MatDialog,
    private _us: UtilitiesService

  ) { }

  ngOnInit() {
    this.initValues()
  }
  
  /**  
   * initValues - Initialise path values for config inputs.
   *    
   * @return {type}  description   
   */   
  initValues() {
    let bxconfig = (<any>window).bxconfig;
    const abp = bxconfig['assetsBasePath'];
    this.assetsBasePath = abp.slice(-1) == "/" ? abp : abp + "/";
    
    this.configPath = bxconfig['configPath'];
    this.widgetsPath = bxconfig['widgetsPath'];
    this.helpPath = bxconfig['helpPath'];
    
    this.layoutSource = bxconfig['layoutSource'];
    this.settingsSource = bxconfig['settingsSource'];

    this.layoutWidgetsSource = bxconfig['layoutWidgetsSource'];
    this.layoutConfigSource = bxconfig['layoutConfigSource'];

    
    //this._ss.structuresPath = bxconfig['structuresPath'];
    
  }
  
  
  /**  
   * launchResults - launch dialog with main Result object
   *    
   * @return {type}  description   
   */   
  launchResults() {
    
    let result = {...this.configResult};
    let params = {};
        params['widgets'] = this._us.formatWidgetsConfig(this.layoutWidgetsResult);
    
    for(let k in this.layoutConfigResult){
      if(this.layoutConfigResult.hasOwnProperty(k)){
        params[k] = this.layoutConfigResult[k]
      }
    }

    this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {
        site: result,
        params: params,
        file: "", 
        note: "Notes"
      }
    })
    

  }
  
  
  /**  
   * processSettingsResult - Takes each settingsConfigItem result and attaches 
   * to the main Result object `configResult`.
   *    
   * @param  {type} sr results of individual settingsConfigItem
   * @return {type}    description   
   */   
  processSettingsResult(sr){
    
    let config = {};
    let key = sr['key'];
    
    
    /* Copy x['config'] to result['key'] */     
    config = function(k, c){
      let result = {};
      if(k.length === 0) {
        copyObj(c, result)
      } else {
        for(let i = 0; i < k.length; i++ ){
          result[k[i]] = {};
          copyObj(c, result[k[i]])
        }
      }
      return result
    }(key, sr['config']);
    
    copyObj(config,this.configResult)
    console.log(this.configResult)
  }


}


function copyObj(src, dest){
  
  for(let k in src) {
    if(src.hasOwnProperty(k)){
      dest[k] = src[k]
    }
  }
  return dest
}
