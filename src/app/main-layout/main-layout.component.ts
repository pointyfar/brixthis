import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OutputComponent } from './../output-builder/output/output.component';
import { DialogComponent } from './../output-builder/dialog/dialog.component';
import { UtilitiesService } from '../shared/services/utilities.service';
import { environment } from './../../environments/environment';
import deepcopy from 'ts-deepcopy';


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
  helpText = '';

  layoutWidgetsSource: string ;
  layoutConfigSource: string;


  layoutSource: string;
  settingsSource: string;

  hasResults = false;

  settingsConfigResult: any = {};
  layoutWidgetsResult: any = [];
  layoutConfigResult: any = {};

  constructor(
    public dialog: MatDialog,
    private _US: UtilitiesService

  ) { }

  ngOnInit() {
    this.initValues();
  }

  /**
   * initValues - Initialise path values for config inputs.
   *
   * @return   description
   */
  initValues() {
    const bxconfig = (window as any).bxconfig;
    const abp = bxconfig.assetsBasePath;
    this.assetsBasePath = abp.slice(-1) === '/' ? abp : abp + '/';

    this._US.env = environment.production ? "prod" : "dev" ;

    this.helpTextSource = assembleURL(bxconfig.helpTextSource, abp);
    this.getHelpText(this.helpTextSource);

    this.settingsSource = assembleURL(bxconfig.settingsSource, abp);

    this.layoutWidgetsSource = assembleURL(bxconfig.layoutWidgetsSource, abp);
    this.layoutConfigSource = assembleURL(bxconfig.layoutConfigSource, abp);

  }


  /**
   * launchResults - launch dialog with main Result object
   *
   * @return   description
   */
  launchResults() {

    /**
     * Assemble main config object:
     * result = top-level / Hugo options
     * params = {widgets, styles, options}
     */

    let result = {};
    let sr = deepcopy(this.settingsConfigResult);
    let wlr = this._US.formatWidgetsConfig(this.layoutWidgetsResult);
    let wcf = this.layoutConfigResult;
    
    result = this._US.mergeObjects([sr, {params: {widgets: wlr}}, wcf])

    this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {
        site: result,
        file: '',
        note: 'Notes'
      }
    });


  }


  getHelpText(url: string) {
    this._US.getText(url)
        .subscribe(
          help => {
            this.helpText = help;
          },
          err => { console.log('Error getting help text from ', url ); },
          () => {
            this.helpTextReady = true;
          }
        );
  }

  launchHelp(m?: boolean) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: 'Help',
        text: this.helpText,
        markdownify: (m ? m : true)
      }
    });

  }


  /**
   * processSettingsResult - Takes each settingsConfigItem result and attaches
   * to the main Result object `configResult`.
   *
   * @param   sr results of individual settingsConfigItem
   * @return     description
   */
  processSettingsResult(sr) {
    const config = this._US.mapToKey(sr.key, sr.config);
    this.settingsConfigResult = {... this.settingsConfigResult, ...config};

  }

  removeFromLayout(e) {
    if (e.k === false) {
      /* structure widget */
      this.layoutWidgetsResult.splice(e.i, 1);
    } else {
      /* feature widget */
      this.layoutWidgetsResult[e.i].children[e.j].children.splice(e.k, 1);
    }

  }
}


function assembleURL(url: string, base: string): string {
  if(url.startsWith("http")) {
    return url;
  } else {
    let hts = "";

    hts = base.slice(-1) === '/' ? base : base + '/';
    hts += url.charAt(0) === '/' ? url.slice(1) : url;

    return hts
  } 
}