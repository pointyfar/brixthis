import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { UtilitiesService } from './../../services/utilities.service';

@Component({
  selector: 'bx-settings-config',
  templateUrl: './settings-config.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class SettingsConfigComponent implements OnInit {
  @Input() public settingsSource: string;
  @Input() public bare: boolean;

  @Output() settingsResult = new EventEmitter<any>();

  settingsConfigFiles = [];
  settingsConfigFilesDone = false;

  helpText = "";


  constructor(
    private _us: UtilitiesService
    
  ) { }

  ngOnInit() {
    this.getSettingsConfig(this.settingsSource)
    
  }
  /**  
   * getSettingsConfig - get() the config definition for the settings builder.
   *    
   * @param  {type} url: string     
   * @param  {type} force?: only get() if settinsConfigFiles[] are empty or forced
   * @return {type}                 description   
   */   
  getSettingsConfig(url: string, force?: boolean){
    
    /**    
     * Get the settings config files and store in this.settingsConfigFiles 
     * and global service equivalent. Also get help text value.
     * Trigger a get() only when this.settingsConfigFiles is not filled yet, 
     * otherwise get the global data stored.
     */     
    if(this.settingsConfigFiles.length <= 0 || (force === true)) {
      this._us.getUrl(url)
          .subscribe( result => {
            for(let i = 0; i < result.items.length; i++){
              this.settingsConfigFiles.push(result.items[i])
            }
            this.helpText = result.help;
          },
          err => {
            console.log("Error getting config files from ", this.settingsSource, err)
          },
          () => {
            this.settingsConfigFilesDone = true;
          }
          )
    } else {
      for(let i = 0; i < this.settingsConfigFiles.length; i++){
        this.settingsConfigFiles.push(this.settingsConfigFiles[i])
      }
      this.settingsConfigFilesDone = true;
    }
  }
  
  emitConfigValue(e){
    if(e) {
      this.settingsResult.emit(e);
    }
  }

}
