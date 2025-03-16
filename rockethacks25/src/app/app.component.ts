import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { TeacherStudentListComponent } from './components/teacher-student-list/teacher-student-list.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoginComponent,
    RouterModule,
    FileListComponent,
    UserListComponent,
    TeacherStudentListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'rockethacks25';
}
