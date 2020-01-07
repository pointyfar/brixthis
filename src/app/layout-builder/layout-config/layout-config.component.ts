import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UtilitiesService } from './../../services/utilities.service';
import { MatDialog } from '@angular/material';
import { WidgetItem } from './../models/widget.item';
import { FormComponent } from './../../output-builder/form/form.component';
import { OutputComponent } from './../../output-builder/output/output.component';


@Component({
  selector: 'bx-layout-config',
  templateUrl: './layout-config.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutConfigComponent implements OnInit {
  
  @Input() public helpText: string;

  @Input() public layoutConfigSource: string;
  @Input() public layoutWidgetsSource: string;

  @Input() public layoutWidgetsResult: any[] = [];
  @Input() public layoutConfigResult: any = {};
  
  
  @Output() removeWidget = new EventEmitter<any>();
  
  
  configFilesDone = false;
  configFiles = [];
  xconfigFiles = [
    {
      label: "Styles", 
      key:["styles"], 
      url: "assets/config/params-styles.json"
    },
    {
      label: "Theme", 
      url: "assets/config/params-options.json"
    }
  ];
  configFile:any = {};
  configParams = "/assets/config/params.json"
  
  params = {};
  result = {};

  droppableItemClass = (item: any) => `${item.class} ${item.inputType}`;

  widgets: WidgetItem[] = [];
  groupedWidgets: any[] = [];
  structuresWidgets: any[] = [];
  contentsWidgets: any[] = [];
  
  isReady = false;
  
  containerWidgetConfig = {};
  containerWidgetForm = "";

  constructor(
    public dialog: MatDialog,
    private _us: UtilitiesService

  ) { }

  ngOnInit() {

    this.getWidgetsList(this.layoutWidgetsSource);
    this.getLayoutConfigOptions(this.layoutConfigSource);
  }


   
  /**
   * get the config definition for the (theme-specific) custom config options.
   * @param url - url for the config definition
   */
  getLayoutConfigOptions(url:string){
    this._us.getUrl(url)
        .subscribe(
          config => {
            for(let i = 0; i < config["items"].length; i++){
              this.configFiles.push(config["items"][i])
            }
          },
          err => {console.log("Error getting layoutConfigSource", err)},
          () => {
            this.configFilesDone = true;
          }
        )
  }
  
  configResult(e){
    if(e['key']) {
      this.params[e['key']] = e['config'];
      this.layoutConfigResult[e['key']] = e['config'];
    } 
    else {
      for(let key in e['config']) {
        this.params[key] = e['config'][key]
        this.layoutConfigResult[key] = e['config'][key];
      }
    }
    this.emitlayoutWidgetsResult(this.params)

  }
  
  getWidgetsList(url:string) {
    this._us.getWidgetsConfig(url)
        .subscribe(
          config => {
            this.widgets = config.widgets;
            this.groupedWidgets = this.processWidgets(config.widgets, config.groups);
          },
          err => {
            console.log(err)
          },
        () => {
          this.isReady = true;
        }
      )
      ;
  }
  
  
  /**  
   * removeFromLayout - Trigger to emit coordinates of item to remove
   *    
   * @param  {type} e event
   * @param  {type} i coordinate
   * @param  {type} j coordinate
   * @param  {type} k coordinate
   * @return {type}   description   
   */   
  removeFromLayout(e,i,j,k) {
    let r = {e,i,j,k}
    this.removeWidget.emit(r)
  }
  
  
  /**  
   * getWidgetsResults - output the configuration results for the widgets only
   *    
   */   
  getWidgetsResults(){
    let params = {...this.params};

    params['widgets'] = this._us.formatWidgetsConfig(this.layoutWidgetsResult);
    
    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {
        site: params,
        file: ["params"], 
        note: "Notes"
        
      }
    })
  }
  
  
  
  /**  
   * getContainerConfigSettings - Get the container configuration options. 
   * Triggered by cog icon button on row containers.
   * Once done, launchContainerSettings().
   *    
   * @param  {type} e event
   * @param  {type} m config of config item model
   */   
  getContainerConfigSettings(_e, m){
    if(!this.containerWidgetForm || (this.containerWidgetForm !== m['formConfig'])) {
      this._us.getUrl(m['formConfig'])
      .subscribe(
        c => {
          this.containerWidgetConfig = {...c}
        },
        err => {
          console.log("Error getting Container Config", err)
        },
        () => {
          this.containerWidgetForm = {...m['formConfig']}
          this.launchContainerSettings(this.containerWidgetConfig, m)
        }
      )
    } else {
      this.launchContainerSettings(this.containerWidgetConfig, m)
    }
    
  }
  
  launchContainerSettings(container, model) {
    let input = model['result'] ? model['result'] : container['modelJson'];

    const dialogRef = this.dialog.open(FormComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: "Configure Site Params",
        inputModel: input,
        jsonSchemaFields: container['jsonFields']
      }
    });
    
    dialogRef.afterClosed()
            .subscribe(result => {
                if(result) {
                  model['result'] = result
                } 
              },
              err => {console.log(err)},
              () => {
              }
            );
    
  }
  
  
  attachConfig(e, m) {
    m.result = e.config;
  }

  emitlayoutWidgetsResult(e){
    
    if(e) {
      
    }
  }

  processWidgets(w, s){
    let groups = [];
    let processed = [];
    
    for (let i=0; i<w.length; i++) {
      let g = ""
      
      if(w[i].hasOwnProperty('group')) {
        g = w[i]['group']; 
      } else {
        g = "ungrouped";
      }

      if( groups.indexOf(g) >= 0 ){
        for(let j = 0; j< processed.length; j++){
          if(processed[j]['group'] === g){
            processed[j]['items'].push(w[i])
          }
        }
      } else {
        groups.push(g);
        let item = [w[i]];
        processed.push({group: g, items: item});
      }
    }
    processed.sort((a,b) => { 
      let val = 0;
      let ai = s.indexOf(a.group);
      let bi = s.indexOf(b.group);
      if (ai < 0 ) {
        if ( bi < 0 ) {
          val = a.group < b.group ? -1 : 0 
        } else { val = -1 }
      } else {
        if ( bi < 0  ) {
          val = -1
        } else { val = ai < bi ? -1 : 0 }
      }
      return val
    })

    return processed
  }
  
  launchHelp(m){
    /*const dialogRef = this.dialog.open(DialogComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: "Help",
        text: this.helpText,
        markdownify: m
      }
    });*/
    
  }

}
