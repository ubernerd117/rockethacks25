import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule],
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
