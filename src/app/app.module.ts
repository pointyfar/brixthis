import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material.module";
import { FormBuilderModule } from "./form-builder/form-builder.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MarkdownModule } from "ngx-markdown";
import { NgxDnDModule } from "@swimlane/ngx-dnd";



import { FormComponent } from "./output-builder/form/form.component";
import { OutputComponent } from "./output-builder/output/output.component";
import { DialogComponent } from "./output-builder/dialog/dialog.component";
import { LayoutConfigComponent } from "./layout-builder/layout-config/layout-config.component";
import { LayoutItemComponent } from "./layout-builder/layout-item/layout-item.component";
import { SettingsItemComponent } from "./settings-builder/settings-item/settings-item.component";
import { SettingsConfigComponent } from "./settings-builder/settings-config/settings-config.component";
import { HelpComponent } from "./help/help.component";
import { MainLayoutComponent } from "./main-layout/main-layout.component";

@NgModule({
  declarations: [
    FormComponent,
    OutputComponent,
    DialogComponent,
    LayoutConfigComponent,
    LayoutItemComponent,
    SettingsItemComponent,
    SettingsConfigComponent,
    HelpComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormBuilderModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    NgxDnDModule,
    MarkdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [
    /*AppComponent*/
  ],
  entryComponents: [
    FormComponent,
    OutputComponent,
    DialogComponent,
    MainLayoutComponent,
    SettingsConfigComponent
  ]
})
export class AppModule {
  ngDoBootstrap(app) { 
    // obtain reference to the DOM element
    const bx = document.querySelector("#bxComponent");
    if (bx) {
      const bxEl = bx.getAttribute("data-bx-component");
      if (bxEl) {
        // create DOM element for the component being bootstrapped
        // and add it to the DOM
        switch( bxEl ) {
          case "main": {
            const el =  document.createElement("bx-main-layout");
                        document.body.appendChild(el);
            // bootstrap the application with the component
            app.bootstrap(MainLayoutComponent);
            break;
          }
          case "config": {
            const el =  document.createElement("bx-settings-config");
                        document.body.appendChild(el);
            app.bootstrap(SettingsConfigComponent);
            break;
          }
          default: {
            bx.innerHTML = "data-bx-component attribute not recognised."
            break;
          }
        }
      } else {
        bx.innerHTML = "No data-bx-component attribute set."
      }
    } else {
      console.log("#bxComponent element not found.")
      const h = document.createElement("div");
                document.body.appendChild(h);
            h.innerHTML = "#bxComponent element not found."
    }
  }
}
