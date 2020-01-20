import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OutputComponent } from './../output-builder/output/output.component';
import { DialogComponent } from './../output-builder/dialog/dialog.component';
import { UtilitiesService } from './../services/utilities.service';
import deepcopy from "ts-deepcopy";


@Component({
  selector: 'bx-main-layout',
  templateUrl: './main-layout.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class MainLayoutComponent implements OnInit {
  
  widgetsPath: string;
  configPath: string;
  assetsBasePath: string;
  
  helpTextSource: string;
  helpTextReady = false;
  helpText = "";

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
    this.initValues();
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
    
    this.helpTextSource = bxconfig['helpTextSource'];
    
    this.layoutSource = bxconfig['layoutSource'];
    this.settingsSource = bxconfig['settingsSource'];
    
    this.layoutWidgetsSource = bxconfig['layoutWidgetsSource'];
    this.layoutConfigSource = bxconfig['layoutConfigSource'];
    
    this.getHelpText(bxconfig['helpTextSource']);
    
    //this._ss.structuresPath = bxconfig['structuresPath'];
    
  }
  
  
  /**  
   * launchResults - launch dialog with main Result object
   *    
   * @return {type}  description   
   */   
  launchResults() {
    
    /**
     * Assemble main config object:
     * result = top-level / Hugo options
     * params = {widgets, styles, options}
     */
    let result = deepcopy(this.configResult);
    let params = {};
        params['widgets'] = this._us.formatWidgetsConfig(this.layoutWidgetsResult);

    params = {...params, ...this.layoutConfigResult}
    
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


  getHelpText(url:string){
    this._us.getText(url)
        .subscribe(
          help => {
            this.helpText = help;
          },
          err => { console.log("Error getting help text from ", url )},
          () => {
            this.helpTextReady = true;
          }
        )
  }

  launchHelp(m){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: "Help",
        text: this.helpText,
        markdownify: true
      }
    });
    
  }
  
  
  /**  
   * processSettingsResult - Takes each settingsConfigItem result and attaches 
   * to the main Result object `configResult`.
   *    
   * @param  {type} sr results of individual settingsConfigItem
   * @return {type}    description   
   */   
  processSettingsResult(sr){
    
    let config = mapToKey(sr['key'], sr['config']);
    this.configResult = {... this.configResult, ...config}
    
  }
}


/**
 * Takes (key, object), and returns { key: object }
 * @param key 
 * @param obj 
 */
function mapToKey(key, obj){
  let result = {};
  /**
  * If no key value: top level object
  * therefore return copy of object
  * Otherwise return result.
  */
  if(key.length === 0) {
    result = deepcopy(obj)
  } else {
    for(let i = 0; i < key.length; i++ ){
      result[key[i]] = {};
      result[key[i]] = deepcopy(obj)
    }
  }
  console.log(result)
  return result
}