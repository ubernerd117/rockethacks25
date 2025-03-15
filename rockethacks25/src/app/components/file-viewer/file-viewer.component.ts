import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AssignmentService } from '../../services/assignment.service';
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class FileViewerComponent implements OnInit {
  assignments: any[] = [];

  constructor(
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'teacher') {
      const teacherClasses = this.classService.getClassesForTeacher(
        currentUser.username
      );
      const classIds = teacherClasses.map((c) => c.classId);
      this.assignments =
        this.assignmentService.getAssignmentsForTeacher(classIds);
    }
  }

  viewFile(file: any): void {
    console.log(`Viewing file: ${file.filename}`);
    alert('viewing ' + file.filename);
  }
}
