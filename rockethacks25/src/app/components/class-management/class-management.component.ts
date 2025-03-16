import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassService, Class } from '../../services/class.service';
import { UserService, User } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './class-management.component.html',
  styleUrl: './class-management.component.css',
})
export class ClassManagementComponent implements OnInit {
  classes: Class[] = [];
  users: User[] = [];
  newClass: Class = {
    classId: '',
    className: '',
    teacherUsername: '',
    studentUsernames: [],
  };
  newUser: User = {
    username: '',
    password: '',
    role: 'student',
    classId: '',
  };
  selectedClassId: string = '';
  selectedStudentUsername: string = '';
  selectedClass: Class | null = null; // Add this line to store the selected class

  constructor(
    private classService: ClassService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.classes = this.classService.getClasses();
    this.users = this.userService.getUsers();
  }

  addClass(): void {
    this.classService.addClass(this.newClass);
    this.newClass = {
      classId: '',
      className: '',
      teacherUsername: '',
      studentUsernames: [],
    };
    this.classes = this.classService.getClasses();
  }

  addUser(): void {
    this.userService.addUser(this.newUser);
    this.newUser = {
      username: '',
      password: '',
      role: 'student',
      classId: '',
    };
    this.users = this.userService.getUsers();
  }

  addStudentToClass(): void {
    const selectedClass = this.classes.find(
      (c) => c.classId === this.selectedClassId
    );
    const selectedStudent = this.users.find(
      (u) => u.username === this.selectedStudentUsername
    );

    if (selectedClass && selectedStudent) {
      if (!selectedClass.studentUsernames.includes(selectedStudent.username)) {
        selectedClass.studentUsernames.push(selectedStudent.username);
        this.classService.updateClass(selectedClass);
        selectedStudent.classId = selectedClass.classId;
        this.userService.updateUser(selectedStudent);
        this.selectedClassId = '';
        this.selectedStudentUsername = '';
      }
    }
  }

  onClassSelect(event: Event): void { // Add this method
    const selectElement = event.target as HTMLSelectElement;
    const classId = selectElement.value;

    this.selectedClass = this.classes.find(c => c.classId === classId) || null;
  }
  viewStatistics() {
    this.router.navigate(['/statistics']);
  }
  getStudentName(username: string): string { // Add this method
    const student = this.userService.getUserByUsername(username);
    return student ? student.username : 'Unknown Student';
  }
}
