import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FileUploadComponent } from './fileupload.component';
import { HttpService } from '../services/file.service';

describe('Component: FileUpload', () => {

  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let submitEl: DebugElement;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [FileUploadComponent]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(FileUploadComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    submitEl = fixture.debugElement.query(By.css('button'));
  });
});
