import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormComponent } from './../../output-builder/form/form.component';

@Component({
  selector: 'bx-layout-item',
  templateUrl: './layout-item.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutItemComponent implements OnInit {
  data = 'hello';
  qReady = false;

  @Input() public qpath: string;
  @Input() public title: string;
  @Input() public image: string;
  @Input() public contentUrl: string;
  @Output() widgetConfig = new EventEmitter<any>();
  @Output() removeWidget = new EventEmitter<any>();

  description = '';
  model: any = {};
  formFields: FormlyFieldConfig[] = [];

  jsonSchemaFields: FormlyFieldConfig[] = [];
  res: any = {};
  hasResult = false;

  hasModel = false;

  constructor(
    private _US: UtilitiesService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getQuestions();
  }

  widgetConfigured(c: any) {
    const e = {config: c};
    if (c) {
      this.widgetConfig.emit(e);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '1000px',
      height: '500px',
      data: {
        inputModel: this.model,
        inputFields: this.formFields,
        jsonSchemaFields: this.jsonSchemaFields,
        result: this.res,
        title: `Configure ${this.title}`
      }
    });
    let result;
    dialogRef.afterClosed()
            .subscribe(x => {
              result = x;
              this.res = x;
              this.model = this._US.stripNulls(this.model);
              this.hasModel = true;
              },
              err => {console.log(err); },
              () => {
                this.widgetConfigured(result);
                if (result) {
                  this.hasResult = true;
                }
              }
            );
  }

  getQuestions() {
    const url = this.qpath;
    this._US.getUrl(url)
        .subscribe(
          r => {
            this.model = r.modelJson;
            this.description = r.description;
            this.jsonSchemaFields = r.jsonFields;
          },
          err => {
            console.log('error:', err);
          },
          () => {
            this.qReady = true;
          }
        );
  }

  removeWidgetEvent(e) {
    this.removeWidget.emit(e);

  }

  }
