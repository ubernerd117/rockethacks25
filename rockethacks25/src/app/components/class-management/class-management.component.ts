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
    _id: '',
    name: '',
    code: '',
    teacher: '',
    students: [],
    assignments: []
  };
  newUser: User = {
    username: '',
    password: '',
    role: 'student',
    classId: '',
  };
  selectedClassId: string = '';
  selectedStudentUsername: string = '';
  selectedClass: Class | null = null;

  constructor(
    private classService: ClassService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.users = this.userService.getUsers();
  }

  loadClasses(): void {
    this.classService.getClasses().subscribe(response => {
      this.classes = response.data;
    });
  }

  addClass(): void {
    this.classService.createClass(this.newClass).subscribe(response => {
      this.newClass = {
        _id: '',
        name: '',
        code: '',
        teacher: '',
        students: [],
        assignments: []
      };
      this.loadClasses();
    });
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
      (c) => c._id === this.selectedClassId
    );
    const selectedStudent = this.users.find(
      (u) => u.username === this.selectedStudentUsername
    );

    if (selectedClass && selectedStudent) {
      if (!selectedClass.students.includes(selectedStudent.username)) {
        this.classService.addStudentToClass(selectedClass._id, selectedStudent.username).subscribe(response => {
          this.loadClasses();
          selectedStudent.classId = selectedClass._id;
          this.userService.updateUser(selectedStudent);
          this.selectedClassId = '';
          this.selectedStudentUsername = '';
        });
      }
    }
  }

  onClassSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const classId = selectElement.value;

    this.selectedClass = this.classes.find(c => c._id === classId) || null;
  }
  
  viewStatistics() {
    this.router.navigate(['/statistics']);
  }
  
  getStudentName(username: string): string {
    const student = this.userService.getUserByUsername(username);
    return student ? student.username : 'Unknown Student';
  }
}
