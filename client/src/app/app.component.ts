import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  selectedFile: File;

  constructor(private http: HttpClient) {}

  onFileChanged(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files[0];
    console.log(event);
  }

  onUpload(): void {
    const uploadData = new FormData();
    uploadData.append('upload_file', this.selectedFile, this.selectedFile.name);
    this.http
      .post('http://localhost:3000/upload', uploadData, {
        reportProgress: true, // Без observe: 'events' не работает
        observe: 'events', // без reportProgress: true только HttpEventType.Sent и HttpEventType.Response
      })
      .subscribe(event => {
        // console.log(event);
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request sent!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header received!');
            break;
          case HttpEventType.UploadProgress:
            const kbLoaded = Math.round(event.loaded / 1024 / 1024);
            const percent = Math.round(event.loaded * 100 / event.total);
            console.log(`Upload in progress! ${kbLoaded}Mb loaded (${percent}%)`);
            break;
          case HttpEventType.Response:
            console.log('😺 Done!', event.body);
        }
      });
  }
}
