import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToGoogleCalanderComponent } from './add-to-google-calander.component';
import { ClanderService } from './clander-service.service';
import { config } from './data.model';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AddToGoogleCalanderComponent
  ],
  exports: [
    AddToGoogleCalanderComponent
  ]
})
export class AddToGoogleCalanderModule {

  /**
  * A static method to provide configuration to the AddToGoogleCalanderModule.
  * @param config Use the AddToGoogleCalanderModule to provide configuration
  * information to the module.
  */
  static forRoot(config: config): ModuleWithProviders {
    return {
      ngModule: AddToGoogleCalanderModule,
      providers: [ClanderService, { provide: 'config', useValue: config }]
    };
  }
}
