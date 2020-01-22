import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*import { FormlyFieldConfig } from '@ngx-formly/core';*/
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
/*import { WidgetItem } from './../layout-buildermodels/widget.item';*/


@Injectable({providedIn: 'root'})
export class UtilitiesService {
  
  configOrderUrl = "assets/config-order.json"
  
  constructor(private http: HttpClient) {
    
  }
  
  getUrl(url): any {
    return this.http.get<any>(url);
  }
  
  getText(url): any {
    return this.http.get<any>(url, { responseType: 'text' as 'json'})
  }
  getWidgetsConfig(url): any {
    return this.http.get<any>(url)
            .pipe(
              map(combi => { 
                let widgets = mapWidgetItem(combi);
                let groups = combi.groups;
                let helpPath = combi.help;
                return {groups, widgets, helpPath}
              })
            )
  }
  
  handleError(error: any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body['error'] || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  
  stripNulls(o) {
    
  let newObj = JSON.parse(JSON.stringify(o));
  for (var k in newObj) {
    if(newObj[k] === false) {
      continue
    } else if (!newObj[k] || ((typeof newObj[k]) !== "object")) {
      if ( !newObj[k]) {
        // if null
        delete newObj[k]
        continue
      } else {
        continue 
      }
    }
    // The property is an object
    newObj[k] = this.stripNulls(newObj[k]); // <-- Make a recursive call on the nested object
    if (Object.keys(newObj[k]).length === 0) {
      delete newObj[k]; // The object had no properties, so delete that property
    }
  }
  return newObj
  }

  mapConfigResult(config){

    console.log("for checking: mapConfigResult", config)
    return config
    
  }

  formatWidgetsConfig(widgetConf: any) {
    
    let list = [];
    for (let i = 0; i < widgetConf.length; i++) {

      let f = {};
      f['widgetName'] = widgetConf[i]['name'];
      f['class'] = widgetConf[i]['class'];

      /** Section Widget **/
      if (widgetConf[i].hasOwnProperty('children')) {
        if (widgetConf[i]['children'].length > 0) {
          f['items'] = this.formatWidgetsConfig(widgetConf[i]['children']);
        }
        f['flex'] = widgetConf[i]['flex'];
        f['type'] = "section"
        f['config'] = widgetConf[i]['result']
      } else { /** Functional Widget **/
        f['config'] = widgetConf[i]['result'];
        f['type'] = "widget"

      }
      list.push(f)
    }
    return list

  }
  
}

function mapWidgetItem( wi: any ):any[] {
  let items = [];
  
  for(let i = 0; i < wi.widgets.length; i++ ){
    let item = <any>{};
    
    item['name'] = wi.widgets[i].name ? wi.widgets[i].name : "widget";
    item['label'] = wi.widgets[i].label ? wi.widgets[i].label : "widget";
    item['class'] = wi.widgets[i].class ? wi.widgets[i].class : "widget";
    item['icon'] = wi.widgets[i].icon ? wi.widgets[i].icon : "widgets";
    item['svg'] = wi.widgets[i].svg ? wi.widgets[i].svg : "";
    item['group'] = wi.widgets[i].group ? wi.widgets[i].group : "ungrouped";
    item['formConfig'] = wi.widgets[i].formConfig ? wi.widgets[i].formConfig : "";
    item['draggable'] = (wi.widgets[i].draggable != null) ? wi.widgets[i].draggable : "['contents']";
    item['droppable'] = (wi.widgets[i].droppable != null) ? wi.widgets[i].droppable : "['default']";
    item['removeOnSpill'] = (wi.widgets[i].removeOnSpill != null) ? wi.widgets[i].removeOnSpill : true;
    item['removeable'] = (wi.widgets[i].removeable != null) ? wi.widgets[i].removeable : true;
    item['image'] = wi.widgets[i].image ? wi.widgets[i].image : "";
    item['content'] = wi.widgets[i].content ? wi.widgets[i].content : "";

    if( wi.widgets[i]['parent'] === true ){
      item['children'] = [] as any[];
      if(wi.widgets[i]['children']) { 
        let wchildren = wi.widgets[i]['children'];
        item['children'] = mapWidgetItem({"widgets": wchildren})
      }
      
      item['flex'] =  wi.widgets[i].flex ? wi.widgets[i].flex : 100;
    } else {
      item['result'] = <any>{};
      
    }
    items.push(item)
  }
  
  return items
}