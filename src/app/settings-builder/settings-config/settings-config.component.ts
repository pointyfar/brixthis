import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../shared/services/utilities.service';

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

  helpText = '';


  constructor(
    private _US: UtilitiesService

  ) { }

  ngOnInit() {
    this.getSettingsConfig(this.settingsSource);

  }
  /**
   * getSettingsConfig - get() the config definition for the settings builder.
   *
   * @param   url: string
   * @param   force?: only get() if settinsConfigFiles[] are empty or forced
   * @return                  description
   */
  getSettingsConfig(url: string, force?: boolean) {

    /**
     * Get the settings config files and store in this.settingsConfigFiles
     * and global service equivalent. Also get help text value.
     * Trigger a get() only when this.settingsConfigFiles is not filled yet,
     * otherwise get the global data stored.
     */
    if (this.settingsConfigFiles.length <= 0 || (force === true)) {
      this._US.getUrl(url)
          .subscribe( result => {
            for (const i of result.items) {
              this.settingsConfigFiles.push(i);
            }
            this.helpText = result.help;
          },
          err => {
            console.log('Error getting config files from ', this.settingsSource, err);
          },
          () => {
            this.settingsConfigFilesDone = true;
          }
          );
    } else {
      for (const i of this.settingsConfigFiles) {
        this.settingsConfigFiles.push(this.settingsConfigFiles[i]);
      }
      this.settingsConfigFilesDone = true;
    }
  }

  emitConfigValue(e) {
    if (e) {
      this.settingsResult.emit(e);
    }
  }

}
