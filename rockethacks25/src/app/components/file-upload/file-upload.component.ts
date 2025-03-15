import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AssignmentService } from '../../services/assignment.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private assignmentService: AssignmentService
  ) {}

  onFileSelected(event: any): void {
    console.log('file selected', event);
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    // event.preventDefault(); // Prevent the default form submission
    if (this.selectedFile) {
      console.log('made it to the selected file');
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.classId) {
        console.log('am i making it to on upload');
        this.assignmentService.addAssignment(
          this.selectedFile.name,
          currentUser.username,
          currentUser.classId
        );
        console.log('File Selected:', this.selectedFile);
        alert('File Uploaded (Dummy)');
        this.selectedFile = null;
      } else {
        alert('Error: Could not determine student or class.');
      }
    } else {
      alert('Please select a file');
    }
  }
}
