// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';
// import { AssignmentService } from '../../services/assignment.service';
// import { FileService } from '../../services/file.service'; // Import FileService

// @Component({
//   selector: 'app-file-upload',
//   templateUrl: './file-upload.component.html',
//   styleUrls: ['./file-upload.component.css'],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class FileUploadComponent {
//   selectedFile: File | null = null;

//   constructor(
//     private authService: AuthService,
//     private assignmentService: AssignmentService,
//     private fileService: FileService // Inject FileService
//   ) {}

//   onFileSelected(event: any): void {
//     this.selectedFile = event.target.files[0];
//   }

//dont want

// onUpload(): void {
//   if (this.selectedFile) {
//     const currentUser = this.authService.getCurrentUser();
//     if (currentUser && currentUser.classId) {
//       this.assignmentService.addAssignment(
//         this.selectedFile.name,
//         currentUser.username,
//         currentUser.classId
//       );
//       console.log('File Selected:', this.selectedFile);
//       alert('File Uploaded (Dummy)');
//       this.selectedFile = null;
//     } else {
//       alert('Error: Could not determine student or class.');
//     }
//   } else {
//     alert('Please select a file');
//   }
// }

//   onUpload(): void {
//     if (this.selectedFile) {
//       const currentUser = this.authService.getCurrentUser();
//       if (currentUser && currentUser.classId) {
//         // Now call fileService.uploadFile()
//         this.fileService
//           .uploadFile(this.selectedFile, 'submissions') // folder name is optional.
//           .subscribe({
//             next: (event) => {
//               console.log('File uploaded successfully', event);
//               // Handle successful upload, e.g., show a success message
//               alert('File Uploaded (Actually)');
//               this.selectedFile = null;
//             },
//             error: (error) => {
//               console.error('Error uploading file', error);
//               // Handle upload error, e.g., show an error message
//               alert('Error uploading the file');
//             },
//           });
//         // this.assignmentService.addAssignment(
//         //     this.selectedFile.name,
//         //     currentUser.username,
//         //     currentUser.classId
//         // );
//         console.log('File Selected:', this.selectedFile);
//         // alert('File Uploaded (Dummy)');
//         // this.selectedFile = null;
//       } else {
//         alert('Error: Could not determine student or class.');
//       }
//     } else {
//       alert('Please select a file');
//     }
//   }
// }

import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, CurrentUser } from '../../services/auth.service';
import { AssignmentService } from '../../services/assignment.service';
import { FileService } from '../../services/file.service';
import { Subscription, switchMap, tap, of } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class FileUploadComponent implements OnDestroy {
  selectedFile: File | null = null;
  private subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private fileService: FileService
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.subscription = this.authService
        .getCurrentUser()
        .pipe(
          tap((currentUser) => {
            if (currentUser && currentUser.classId) {
              // Now call fileService.uploadFile()
              this.fileService
                .uploadFile(this.selectedFile!, 'submissions') // folder name is optional.
                .subscribe({
                  next: (event) => {
                    console.log('File uploaded successfully', event);
                    // Handle successful upload, e.g., show a success message
                    alert('File Uploaded (Actually)');
                    this.selectedFile = null;
                  },
                  error: (error) => {
                    console.error('Error uploading file', error);
                    // Handle upload error, e.g., show an error message
                    alert('Error uploading the file');
                  },
                });
              console.log('File Selected:', this.selectedFile);
            } else {
              alert('Error: Could not determine student or class.');
            }
          })
        )
        .subscribe();
    } else {
      alert('Please select a file');
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
