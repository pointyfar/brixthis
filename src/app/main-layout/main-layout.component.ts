import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OutputComponent } from './../output-builder/output/output.component';
import { DialogComponent } from './../output-builder/dialog/dialog.component';
import { UtilitiesService } from './../services/utilities.service';
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

  configResult: any = {};
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

    this.helpTextSource = bxconfig.helpTextSource;
    this.getHelpText(bxconfig.helpTextSource);

    this.settingsSource = bxconfig.settingsSource;

    this.layoutWidgetsSource = bxconfig.layoutWidgetsSource;
    this.layoutConfigSource = bxconfig.layoutConfigSource;


    // this._ss.structuresPath = bxconfig['structuresPath'];

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
    const result = deepcopy(this.configResult);
    let params = {};
    params['widgets'] = this._US.formatWidgetsConfig(this.layoutWidgetsResult);

    params = {...params, ...this.layoutConfigResult};

    this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {
        site: result,
        params,
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

    const config = mapToKey(sr.key, sr.config);
    this.configResult = {... this.configResult, ...config};

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


/**
 * Takes (key, object), and returns { key: object }
 */
function mapToKey(key, obj) {
  let result = {};
  /**
   * If no key value: top level object
   * therefore return copy of object
   * Otherwise return result.
   */
  if (key.length === 0) {
    result = deepcopy(obj);
  } else {
    for (const i of key ) {
      result[key[i]] = {};
      result[key[i]] = deepcopy(obj);
    }
  }
  return result;
}
