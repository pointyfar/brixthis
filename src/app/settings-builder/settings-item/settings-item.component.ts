import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UtilitiesService } from './../../services/utilities.service';
import { OutputComponent } from './../../output-builder/output/output.component';
import { FormComponent } from './../../output-builder/form/form.component';


@Component({
  selector: 'bx-settings-item',
  templateUrl: './settings-item.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class SettingsItemComponent implements OnInit {
  
  @Input() public configFile: any;
  @Input() bare: boolean;
  @Output() itemResult = new EventEmitter<any>();
  
  @Input() id = -1;

  config:any = {};
  configResult:any = {};
  hasResult = false;
  
  configReady = false;
  
  hasNotes = false;
  notes = [];
  
  jsonFields = {};

  constructor(
    public dialog: MatDialog,
    private _us: UtilitiesService
  ) { }

  ngOnInit() {
    
    this._us.getUrl(this.configFile['url'])
    .subscribe(
      result => {
        this.config = result;
      },
      err => console.log('Error getting config from ', this.configFile['url'], err),
      () => {
        this.configReady = true;
      }
    )
  }
  
  loadConfigDialog() {
    
    let currentResult = this.configResult;
    
    let notes = "";
    if(this.config['destination']) {
      notes = `Suggested destination: ${this.config['destination']}`
    }

    const dialogRef = this.dialog.open(FormComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: `Configure ${this.configFile['label']} Options`,
        notes: [notes],
        inputModel: currentResult,
        jsonSchemaFields: this.config['jsonFields']
      }
    });
    
    dialogRef.afterClosed()
            .subscribe(res => {
              if(res) {
                this.configResult = res;

                let x = this._us.stripNulls(res)
                if(Object.keys(x).length === 0 && x.constructor === Object) {
                  this.hasResult = false;
                } else {
                  this.hasResult = true;
                }
              } 
              
            },
            err => {console.log(err)},
            () => {
              this.configured(this.configResult)
            }
            );
  }
  
  configured(c:any){
    console.log(c)
    let e = {};
    e['id'] = this.id;
    
    if(this.configFile['dynamic'] === true ){
      e['config'] = this.transformDynamic(c)
    } else {
      e['config'] = c;
    }

    e['key'] = this.configFile['key']
    if(c) {
      this.itemResult.emit(this._us.mapConfigResult(e));
    }
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
  
  saveConfig(){

    let out = this.configFile['dynamic'] ? this.transformDynamic(this.configResult) : this.configResult;
    let result = this._us.mapConfigResult(out);

    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {
        site: result, 
        file: this.configFile['key'], 
        note: (this.configFile['destination']? `Suggested location: $${this.configFile['destination']}` : "")
      }
    })
  }

}
