import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      .post('http://localhost:3000/upload', uploadData)
      .subscribe(res => {
        console.log(res);
      });
  }
}
