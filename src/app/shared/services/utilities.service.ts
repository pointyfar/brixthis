import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*import { FormlyFieldConfig } from '@ngx-formly/core';*/
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, mergeMap, switchMap, mergeAll } from 'rxjs/operators';
import { WidgetItem } from '../models/widget.item';
import deepcopy from 'ts-deepcopy';
import * as merge from 'deepmerge';


@Injectable({providedIn: 'root'})
export class UtilitiesService {

  configOrderUrl = 'assets/config-order.json';
  env = "dev";

  constructor(private http: HttpClient) {

  }

  getUrl(url): any {
    return this.http.get<any>(url);
  }

  getText(url): any {
    return this.http.get<any>(url, { responseType: 'text' as 'json'});
  }
  getWidgetsConfig(url): any {
    return this.http.get<any>(url)
            .pipe(
              map(combi => {
                const widgets = mapWidgetItem(combi);
                const groups = combi.groups;
                const helpPath = combi.help;
                return {groups, widgets, helpPath};
              })
            );
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
    return throwError(errMsg);
  }

  stripNulls(o) {

  const newObj = JSON.parse(JSON.stringify(o));
  for (const k in newObj) {
    if (newObj[k] === false) {
      continue;
    } else if (!newObj[k] || ((typeof newObj[k]) !== 'object')) {
      if ( !newObj[k]) {
        // if null
        delete newObj[k];
        continue;
      } else {
        continue;
      }
    }
    // The property is an object
    newObj[k] = this.stripNulls(newObj[k]); // <-- Make a recursive call on the nested object
    if (Object.keys(newObj[k]).length === 0) {
      delete newObj[k]; // The object had no properties, so delete that property
    }
  }
  return newObj;
  }


  formatWidgetsConfig(widgetConf: any) {

    const list = [];
    for (const i of widgetConf) {

      const f = <any>{};
      f.widgetName = i.name;
      f.class = i.class;

      /* Section Widget */
      if (i.hasOwnProperty('children')) {
        if (i.children.length > 0) {
          f.items = this.formatWidgetsConfig(i.children);
        }
        f.flex = i.flex;
        f.type = 'section';
        f.config = i.result;
      } else { /* Functional Widget */
        f.config = i.result;
        f.type = 'widget';

      }
      list.push(f);
    }
    return list;

  }

  /**
   * Takes ([keys], object), and returns {key1: {key2: { keyn: object }}}
   */
  mapToKey(key, obj) {
    let result = {};
    /**
     * If no key value: top level object
     * therefore return copy of object
     * Otherwise return result.
     */
    if (key.length === 0) {
      result = deepcopy(obj);
    } else {
      
      let f = function(key, obj){
        if(key.length === 0) {
          return obj
        } else {
          let tmp = {};
          tmp[key[key.length - 1]] = deepcopy(obj);
          const newkey = key.slice(0,-1)
          return f(newkey, tmp)
        }
      }
      result = f(key, obj)
    }
    return result;
  }

  mergeObjects(obj: any) {
    return merge.all(obj)
  };



}

function mapWidgetItem( wi: any ): any[] {
  let items = [];

  for (const i of wi.widgets) {
    const item = <WidgetItem>{};

    item.name = i.name ? i.name : 'widget';
    item.label = i.label ? i.label : 'widget';
    item.class = i.class ? i.class : 'widget';
    item.icon = i.icon ? i.icon : 'widgets';
    item.svg = i.svg ? i.svg : '';
    item.group = i.group ? i.group : 'ungrouped';
    item.formConfig = i.formConfig ? i.formConfig : '';
    item.draggable = (i.draggable != null) ? i.draggable : '[\'contents\']';
    item.droppable = (i.droppable != null) ? i.droppable : '[\'default\']';
    item.removeOnSpill = (i.removeOnSpill != null) ? i.removeOnSpill : true;
    item.removeable = (i.removeable != null) ? i.removeable : true;
    item.image = i.image ? i.image : '';
    item.content = i.content ? i.content : '';

    if ( i.parent === true ) {
      item.children = [] as any[];
      if (i.children) {
        const wchildren = i.children;
        item.children = mapWidgetItem({widgets: wchildren});
      }

      item.flex =  i.flex ? i.flex : 100;
    } else {
      item.result = {} as any;

    }
    items.push(item);
  }

  return items;
}
