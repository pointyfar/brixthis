import { Injectable } from '@angular/core';
import {FormControl} from '@angular/forms';


import * as yamljs from 'yamljs';
import * as tomlify from 'tomlify-j0.4';
import * as FileSaver from 'file-saver/src/FileSaver';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  public structuresPath: string;
  public configPath: string;
  public helpPath: string;
  
  public settingsSource: string;
  public layoutSource: string;
  
  public settingsConfigFiles = [];
  
  public touched = [];
  
  configuration = {};
  
  testCounter = 0;
  
  data = {};
  jsonFormat: any = {};

  constructor() { }
  
  test() {
    this.testCounter ++;
    console.log("Shared Service works:", this.testCounter)
  }
  
  private _widgetsPath: string;
    set widgetsPath(val: string){
      this._widgetsPath = val;
    }
    get widgetsPath():string {
      return this._widgetsPath;
    }
  
  private _assetsBasePath: string;
    set assetsBasePath(val: string){
      this._assetsBasePath = val.slice(-1) == "/" ? val : val + "/";
    }
    get assetsBasePath():string {
      return this._assetsBasePath;
    }
  
  private _configValue = {};
    set configValue(e){
      if(e['key'].length === 0) {
        copyObj(e['config'], this._configValue)
      } else {
        for(let i = 0; i < e['key'].length; i++ ){
          this._configValue[e['key'][i]] = {};
          copyObj(e['config'], this._configValue[e['key'][i]])
        }
      }
    }
    get configValue(): any {
      return this._configValue
    }
  
  
  private _settingsResult: any = {};
    public set settingsResult(value: any) {
        this._settingsResult = value;
    }
    public get settingsResult(): any {
        return this._settingsResult;
    }
  
  
  private _configResult: any = {};
    public set configResult(x:any) {

      let config = {};
      let key = x['key'];
      
      config['id'] = x['id'] ? x['id'] : -1 ;
      
      if((config['id']>-1)&&(this.touched.indexOf(config['id'])>-1)) {
        this.touched.push(config['id']);
        console.log("touching:", x['id'])
      }
      
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
      }(key, x['config']);
      
      copyObj(config,this._configResult)
    }
    public get configResult(): any {
      return this._configResult
    }
    
    
    
    public settingsItems = {};
      public setSettingsItems(id:number, item:any) {
        const strid = id.toString();
        this.settingsItems[strid] = {...item};
      }
      public getSettingsItems(id:number) {
          return this.settingsItems[id.toString()];
      }
  
  transformDynamic(c){
    let result = {};
    
    if(c['values']) {
      for(let i = 0; i < c['values'].length; i++){
        result[c['values'][i]['key']] = c['values'][i]['value']
      }
    }
    return result;
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
