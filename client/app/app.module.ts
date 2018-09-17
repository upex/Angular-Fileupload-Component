import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { RoutingModule } from './routing.module';
import { HttpService } from './services/file.service';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './fileupload/fileupload.component';


@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    HttpService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
