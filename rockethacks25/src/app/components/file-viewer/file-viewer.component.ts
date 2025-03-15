// file-viewer.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css'],
  imports: [CommonModule],
})
export class FileViewerComponent {
  files = [
    { name: 'Assignment1.pdf', student: 'student1' },
    { name: 'Assignment2.docx', student: 'student2' },
    { name: 'ProjectReport.pdf', student: 'student1' },
  ];

  viewFile(file: any): void {
    console.log(`Viewing file: ${file.name}`);
    alert('viewing ' + file.name);
  }
}
