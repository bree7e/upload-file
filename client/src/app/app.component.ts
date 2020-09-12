import {
  Component,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { fromEvent, Subject } from 'rxjs';
import { mergeMap, finalize, takeUntil, first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <h1>Welcome to File upload!</h1>
    <div class="progress form-group">
      <div
        class="progress-bar progress-bar-striped bg-success"
        role="progressbar"
        [style.width.%]="progressValue"
      ></div>
    </div>
    <button (click)="chooseAndUploadFile()">Upload!</button>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  progressValue: number;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {}

  /**
   * Open file dialog and upload file to server
   */
  public chooseAndUploadFile(): void {
    let fileInput = this.document.createElement('input');
    fileInput.type = 'file';
    fromEvent(fileInput, 'change')
      .pipe(
        first(),
        mergeMap((event) => {
          const target = event.target as HTMLInputElement;
          const selectedFile = target.files[0];
          // formData обязательно в 2 строчки
          const uploadData = new FormData();
          uploadData.append('upload_file', selectedFile, selectedFile.name);
          return this.http.post('http://localhost:3000/upload', uploadData, {
            reportProgress: true, // Без observe: 'events' не работает
            observe: 'events', // без reportProgress: true только HttpEventType.Sent и HttpEventType.Response
          });
        }),
        finalize(() => {
          // должен быть удален, т.к. счетчик ссылок обнулится
          fileInput = null;
          console.log('fileInput = null');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (event) => {
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
              const percent = Math.round((event.loaded * 100) / event.total);
              this.progressValue = percent;
              console.log(
                `Upload in progress! ${kbLoaded}Mb loaded (${percent}%)`
              );
              break;
            case HttpEventType.Response:
              console.log('😺 Done!', event.body);
          }
        },
        () => console.log('Upload error'),
        () => console.log('Upload complete')
      );
    fileInput.click();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
