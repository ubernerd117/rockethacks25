import { Component } from '@angular/core';
import { S3Service } from '../../services/s3.service';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="file-upload-container">
      <input 
        type="file" 
        (change)="onFileSelected($event)"
        class="hidden"
        #fileInput
      >
      <button 
        (click)="fileInput.click()"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Select File
      </button>
      <div *ngIf="selectedFile" class="mt-4">
        Selected file: {{ selectedFile.name }}
        <button 
          (click)="uploadFile()"
          class="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Upload
        </button>
      </div>
      <div *ngIf="uploadProgress" class="mt-4">
        Upload progress: {{ uploadProgress }}%
      </div>
    </div>
  `,
  styles: [`
    .file-upload-container {
      padding: 2rem;
      border: 2px dashed #ccc;
      border-radius: 8px;
      text-align: center;
    }
  `]
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;

  constructor(private s3Service: S3Service) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const bucketName = 'YOUR_BUCKET_NAME';
    const key = `uploads/${Date.now()}-${this.selectedFile.name}`;

    this.s3Service.uploadFile(this.selectedFile, bucketName, key)
      .subscribe({
        next: (progress) => {
          if (progress.loaded && progress.total) {
            this.uploadProgress = Math.round((progress.loaded / progress.total) * 100);
          }
        },
        error: (error) => {
          console.error('Upload failed:', error);
          // Handle error appropriately
        },
        complete: () => {
          console.log('Upload completed');
          this.selectedFile = null;
          this.uploadProgress = 0;
        }
      });
  }
}
