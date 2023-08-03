import { Component, OnInit , ElementRef, ViewChild} from "@angular/core";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";


declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  @ViewChild('toPrint', 
  { static: true }
  ) 
  toPrint!: ElementRef;


  editorInstance: any;

  public Editor = ClassicEditor;
  editorConfig : any;
  description: any;

  ngOnInit(): void {
    
    this.editorConfig={
      placeholder: 'Type here..',
   
    //   toolbar: {
    //     items: [
    //         'undo', 'redo',
    //         '|', 'heading',
    //         '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
    //         '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
    //         '|', 'alignment',
    //         'link', 'uploadImage', 'blockQuote', 'codeBlock',
    //         '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
    //     ],
    //     shouldNotGroupWhenFull: true
    // }
    
    }
  }
  export(): void {
    const ckEditorInstance = this.toPrint.nativeElement.querySelector('.ck-editor__editable');
    const toPrintContent = ckEditorInstance.innerHTML;
    const pdfContent = htmlToPdfmake(toPrintContent);
    const documentDefinition = {
      content: pdfContent,
    };

    pdfMake.createPdf(documentDefinition).download('editor.pdf');
  }

 
  onReady($event: any) {
    $event.plugins.get('FileRepository').createUploadAdapter = (
      loader: any
    ) => {
      return new MyUploadAdapter(loader);
    };
  }
}

class MyUploadAdapter {
  xhr: any;
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }


  upload() {
    return this.loader.file.then(
      (file: any) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

 
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open('POST', 'http://localhost:5111/api/Images', true);
    xhr.responseType = 'json';
  }

  
  _initListeners(resolve: any, reject: any, file: any) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      resolve({
        default: response.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt: any) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file: any) {
    const data = new FormData();

    data.append('file', file);
    // console.log(data);
    data.forEach((value, key) => {
      console.log(key, value);
    });

    this.xhr.send(data);
  }
}
