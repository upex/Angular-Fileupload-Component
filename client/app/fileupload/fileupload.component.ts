import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { HttpService } from "../services/file.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-file-upload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileUploadComponent implements OnInit {
    errors: Array<string> =[];
    dragAreaClass: string = 'dragarea';
	  @Input() fileExt: string = "JPG, JPEG, GIF, PNG";
	  @Input() maxFiles: number = 10;
	  @Input() maxSize: number = 5; /** 5MB */
    @Output() uploadStatus = new EventEmitter();
    localUrl: any = [];
    loading: boolean = false;

    constructor(
      private http: HttpService,
    ) { }

    ngOnInit() { }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }
    
    @HostListener('dragenter', ['$event']) onDragEnter(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }
    
    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }
    @HostListener('drop', ['$event']) onDrop(event) {   
        this.dragAreaClass = "dragarea";           
        event.preventDefault();
        event.stopPropagation();
        this.showPreview(event, event.dataTransfer.files);
    }
    onFileChange(event){
      this.showPreview(event, event.target.files);
    }
    removeImage(item) {
      this.localUrl = _.filter(this.localUrl, o => o.key !== item.key);
    }
    showPreview(event, files) {
      this.localUrl = [];
      if (files && files.length && this.validateFiles(files)) {
          _.each(files, (value, key)=> {
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.localUrl.push({
                file: value,
                key,
                name: value.name,
                url: event.target.result
              });
            }
            reader.readAsDataURL(value);
          });
      }
    }

    validateFiles(files) {
      this.errors = []; 
      /** Validate file size and allowed extensions */
      if (files.length > 0 && (!this.isValidFiles(files))) {
        this.uploadStatus.emit(false);
        return false;
      } 
      return true;
    }
    saveFiles(){
      const files: Array<File> = _.map(this.localUrl, item => item.file);
      if (files.length > 0 && !this.errors.length) {
            const formData: any = new FormData();
            /** We can append any data with formData
             * Like a product id to create a directory and put all the images there 
             */
            formData.append('productId', '5b828d22fd0e42df4a672164');
            _.each(files, (value, key)=>{
              formData.append("uploads[]", files[key], files[key]['name']);
            });
            this.loading = true;
            this.http.upload('/api/upload', formData)
              .subscribe(resp => {
                this.uploadStatus.emit(true);
                this.loading = false;
                this.localUrl = [];
                console.log('File uploaded successfully.');
              },
              error => {
                this.loading = false;
                this.uploadStatus.emit(true);
                this.errors.push(error.ExceptionMessage);
              });
        } 
    }


    private isValidFiles(files){
       /** Check Number of files */
        if (files.length > this.maxFiles) {
            this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
            return;
        }        
        this.isValidFileExtension(files);
        return this.errors.length === 0;
    }

    private isValidFileExtension(files){
        /** Make array of file extensions */
          const extensions = (this.fileExt.split(','))
                          .map( (x) => { return x.toLocaleUpperCase().trim() });
          _.each(files, (value, key)=> {
              /** Get file extension */
              const ext = value.name.toUpperCase().split('.').pop() || value.name;
              /** Check the extension exists */
              const exists = extensions.includes(ext);
              if (!exists) {
                  this.errors.push("Error (Extension): " + value.name);
              }
              /** Check file size */
              this.isValidFileSize(value);
          });
    }


    private isValidFileSize(file) {
          var fileSizeinMB = file.size / (1024 * 1000);
          /** convert upto 2 decimal place */
          var size = Math.round(fileSizeinMB * 100) / 100; 
          if (size > this.maxSize)
              this.errors.push("Error (File Size): " + file.name + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )");
    }
}
