import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { WidgetItem } from '../../shared/models/widget.item';
//import { WidgetItem } from './../../shared/models/widget-item';
import { FormComponent } from './../../output-builder/form/form.component';
import { OutputComponent } from './../../output-builder/output/output.component';
import deepcopy from 'ts-deepcopy';


@Component({
  selector: 'bx-layout-config',
  templateUrl: './layout-config.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutConfigComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private _US: UtilitiesService

  ) { }

  @Input() public helpTextSource: string;

  @Input() public layoutConfigSource: string;
  @Input() public layoutWidgetsSource: string;

  @Input() public layoutWidgetsResult: any[] = [];
  @Input() public layoutConfigResult: any = {};
  @Output() public layoutConfigResultChange = new EventEmitter();


  @Output() removeWidget = new EventEmitter<any>();

  helpTextReady = false;
  helpText = '';

  configFilesDone = false;
  configFiles = [];

  configFile: any = {};

  params = {};
  result = {};

  widgets: WidgetItem[] = [];
  groupedWidgets: any[] = [];
  structuresWidgets: any[] = [];
  contentsWidgets: any[] = [];

  isReady = false;

  containerWidgetConfig = {};
  containerWidgetForm = '';

  notest = true;

  pw = {
    name: 'one',
    label: 'Structure: Single Column',
    class: 'column is-full row',
    content: '',
    parent: true,
    inputType: 'section',
    flex: 100,
    removeOnSpill: true,
    removeable: true,
    group: 'structure',
    icon: 'view_compact',
    image: '',
    svg: 'assets/img/svg/row-1.svg#layer1',
    draggable: '[\'maindroppable\']',
    droppable: 'dragtest',
    formConfig: 'assets/bx/layouts-widgets/container-widget.json',
    children: [
      {
        children: [
          {
            name: 'widget-hero',
            label: 'Hero Widget',
            class: 'widget',
            inputType: 'content',
            icon: 'fas fa-flag',
            svg: 'assets/img/icons/hero.png',
            group: 'main',
            formConfig: 'assets/bx/layouts-widgets/hero-widget.json'
          }
        ],
        content: '',
        name: 'full',
        label: 'Full',
        class: 'column is-full',
        parent: true,
        inputType: 'section',
        flex: 100,
        group: 'structure',
        icon: 'view_compact',
        removeOnSpill: false,
        removeable: false,
        draggable: '[]',
        droppable: '[\'default\']',
        image: '',
        formConfig: 'assets/bx/layouts-widgets/container-widget.json'

      }
    ]
  };

  droppableItemClass = (item: any) => `${item.class}`;

  ngOnInit() {
    if(this._US.env === 'dev' && this.notest !== true ) {
      this.layoutWidgetsResult.push(this.pw);
    }

    this.getWidgetsList(this.layoutWidgetsSource);
    this.getLayoutConfigOptions(this.layoutConfigSource);
  }


  /**
   * get the config definition for the (theme-specific) custom config options.
   * @param url - url for the config definition
   */
  getLayoutConfigOptions(url: string) {
    this._US.getUrl(url)
        .subscribe(
          config => {
            for (const i of config.items ) {
              this.configFiles.push(i);
            }
          },
          err => {console.log('Error getting layoutConfigSource', err); },
          () => {
            this.configFilesDone = true;
          }
        );
  }

  configResult(e) {
    let result = {};
    if(e.key){
      result = this._US.mapToKey(e.key, e.config)
    }
    this.layoutConfigResult = this._US.mergeObjects([this.layoutConfigResult, result])
    this.layoutConfigResultChange.emit(this.layoutConfigResult);
  }

  getWidgetsList(url: string) {
    this._US.getWidgetsConfig(url)
        .subscribe(
          config => {
            this.widgets = config.widgets;
            this.groupedWidgets = this.processWidgets(config.widgets, config.groups);
          },
          err => {
            console.log(err);
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
   * @param   e event
   * @param   i coordinate
   * @param   j coordinate
   * @param   k coordinate
   * @return  description
   */
  removeFromLayout(e, i, j, k) {
    const r = {e, i, j, k};
    this.removeWidget.emit(r);
  }


  /**
   * getWidgetsResults - output the configuration results for the widgets only
   *
   */
  getWidgetsResults() {
    const params = {...this.params};

    params['widgets'] = this._US.formatWidgetsConfig(this.layoutWidgetsResult);

    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {
        site: params,
        file: ['params'],
        note: 'Notes'

      }
    });
  }



  /**
   * getContainerConfigSettings - Get the container configuration options.
   * Triggered by cog icon button on row containers.
   * Once done, launchContainerSettings().
   *
   * @param  e event
   * @param  m config of config item model
   */
  getContainerConfigSettings(e, m) {
    if (!this.containerWidgetForm || (this.containerWidgetForm !== m.formConfig)) {
      this._US.getUrl(m.formConfig)
      .subscribe(
        c => {
          this.containerWidgetConfig = {...c};
        },
        err => {
          console.log('Error getting Container Config', err);
        },
        () => {
          this.containerWidgetForm = {...m.formConfig};
          this.launchContainerSettings(this.containerWidgetConfig, m);
        }
      );
    } else {
      this.launchContainerSettings(this.containerWidgetConfig, m);
    }

  }

  launchContainerSettings(container, model) {
    const input = model.result ? model.result : container.modelJson;

    const dialogRef = this.dialog.open(FormComponent, {
      width: '500px',
      height: '500px',
      data: {
        title: 'Configure Section Class',
        inputModel: input,
        jsonSchemaFields: container.jsonFields
      }
    });

    dialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                  model.result = result;
                }
              },
              err => {console.log(err); },
              () => {
              }
            );

  }


  attachConfig(e, m) {
    m.result = e.config;
  }

  emitlayoutWidgetsResult(e) {

    if (e) {

    }
  }

  processWidgets(w, s) {
    const groups = [];
    const processed = [];

    for (const i of w) {
      let g = '';

      if (i.hasOwnProperty('group')) {
        g = i.group;
      } else {
        g = 'ungrouped';
      }

      if ( groups.indexOf(g) >= 0 ) {
        for (const j of processed) {
          if (j.group === g) {
            j.items.push(i);
          }
        }
      } else {
        groups.push(g);
        const item = [i];
        processed.push({group: g, items: item});
      }
    }
    processed.sort((a, b) => {
      let val = 0;
      const ai = s.indexOf(a.group);
      const bi = s.indexOf(b.group);
      if (ai < 0 ) {
        if ( bi < 0 ) {
          val = a.group < b.group ? -1 : 0;
        } else { val = -1; }
      } else {
        if ( bi < 0  ) {
          val = -1;
        } else { val = ai < bi ? -1 : 0; }
      }
      return val;
    });

    return processed;
  }

}
