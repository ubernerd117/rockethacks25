import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassService, Class } from '../../services/class.service'; // Import ClassService and Class interface
import { UserService } from '../../services/user.service'; // Import UserService
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-classes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-classes.component.html',
  styleUrl: './teacher-classes.component.css',
})
export class TeacherClassesComponent implements OnInit {
  classes: Class[] = []; // Define the classes array

  constructor(
    private classService: ClassService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.classes = this.classService.getClasses(); // Get classes from the service
  }

  getStudentCount(classObject: Class): number {
    return classObject.studentUsernames.length;
  }
  viewClassDetails(classId: string){
      this.router.navigate([`/classDetails/${classId}`])
  }
}
