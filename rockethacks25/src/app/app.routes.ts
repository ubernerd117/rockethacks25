import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { TeacherClassesComponent } from './components/teacher-classes/teacher-classes.component';
import { TeacherAssignmentsComponent } from './components/teacher-assignments/teacher-assignments.component';
import { TeacherStatisticsComponent } from './components/teacher-statistics/teacher-statistics.component';
import { AuthGuard } from './components/auth-guard/auth-guard.component';
import { AuthGuard0 } from './components/auth-guard0.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent }, // Default to HomeComponent
  { path: 'login', component: LoginComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'student' },
  },
  {
    path: 'teacher',
    component: TeacherDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'teacher' },

    children: [
      { path: 'classes', component: TeacherClassesComponent },
      { path: 'assignments', component: TeacherAssignmentsComponent },
      { path: 'statistics', component: TeacherStatisticsComponent },
    ],
  },
  //auth0 paths
  {
    path: 'studentAuth',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard0],
    data: { role: 'student' },
  },
  //auth0 paths
  {
    path: 'teacherAuth',
    component: TeacherDashboardComponent,
    canActivate: [AuthGuard0],
    data: { role: 'teacher' },

    children: [
      { path: 'classes', component: TeacherClassesComponent },
      { path: 'assignments', component: TeacherAssignmentsComponent },
      { path: 'statistics', component: TeacherStatisticsComponent },
    ],
  },
  { path: 'classes', component: TeacherClassesComponent },
  { path: 'assignments', component: TeacherAssignmentsComponent },
  { path: 'statistics', component: TeacherStatisticsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
