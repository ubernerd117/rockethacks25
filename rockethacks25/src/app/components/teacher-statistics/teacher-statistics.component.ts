import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClassStatistics {
  className: string;
  averageGrade: number; // Changed to number for calculating percentage
  studentCount: number;
  assignmentsSubmitted: number;
}

@Component({
  selector: 'app-teacher-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-statistics.component.html',
  styleUrls: ['./teacher-statistics.component.css'],
})
export class TeacherStatisticsComponent implements OnInit {
  classStatistics: ClassStatistics[] = [];

  ngOnInit(): void {
    // Mock data for class statistics
    this.classStatistics = [
      {
        className: 'Math 101',
        averageGrade: 85,
        studentCount: 30,
        assignmentsSubmitted: 28,
      },
      {
        className: 'History 201',
        averageGrade: 70,
        studentCount: 25,
        assignmentsSubmitted: 22,
      },
      {
        className: 'Physics 101',
        averageGrade: 92,
        studentCount: 35,
        assignmentsSubmitted: 33,
      },
      {
        className: 'Computer Science 301',
        averageGrade: 60,
        studentCount: 20,
        assignmentsSubmitted: 18,
      },
    ];
  }

  getGradeClass(averageGrade: number): string {
    if (averageGrade >= 80) {
      return 'text-success'; // Green
    } else if (averageGrade >= 60) {
      return 'text-warning'; // Yellow
    } else {
      return 'text-error'; // Red
    }
  }
}
