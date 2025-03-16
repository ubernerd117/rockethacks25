import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ClassService, Class } from '../../services/class.service';

@Component({
  selector: 'app-teacher-class-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-class-details.component.html',
  styleUrl: './teacher-class-details.component.css',
})
export class TeacherClassDetailsComponent {
  classId: string = '';
  class: Class | undefined;
  constructor(private route: ActivatedRoute, private classService: ClassService) {
    this.route.params.subscribe(params => {
      this.classId = params['classId'];
      this.class = this.classService.getClassById(this.classId);
    });
  }
}
