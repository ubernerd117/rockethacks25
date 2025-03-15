// file-upload.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedFile) {
      console.log('File Selected:', this.selectedFile);
      alert('File Uploaded (Dummy)');
      this.selectedFile = null;
    } else {
      alert('Please select a file');
    }
  }
}
