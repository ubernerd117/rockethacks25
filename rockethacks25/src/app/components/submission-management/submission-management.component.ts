import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmissionService } from '../../services/submission.service';
import { AssignmentService } from '../../services/assignment.service';
import { ClassService } from '../../services/class.service';
import { HttpClientModule } from '@angular/common/http';

interface Submission {
  _id: string;
  assignmentId: any;
  studentId: any;
  fileUrl: string;
  submissionDate: Date;
  gradeReceived?: number;
  feedback?: string;
  autoGraded?: boolean;
  autoGradingDetails?: any;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

@Component({
  selector: 'app-submission-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Submission Management</h2>
      
      <!-- Filter Controls -->
      <div class="bg-white p-4 rounded-lg shadow mb-4">
        <div class="flex flex-wrap gap-4">
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Select Class</span>
            </label>
            <select class="select select-bordered" [(ngModel)]="selectedClassId" (change)="loadAssignmentsForClass()">
              <option value="">All Classes</option>
              <option *ngFor="let class of classes" [value]="class._id">{{ class.name }}</option>
            </select>
          </div>
          
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Select Assignment</span>
            </label>
            <select class="select select-bordered" [(ngModel)]="selectedAssignmentId" (change)="loadSubmissions()">
              <option value="">All Assignments</option>
              <option *ngFor="let assignment of assignments" [value]="assignment._id">{{ assignment.name }}</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Submissions Table -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-3">Submissions</h3>
        
        <div *ngIf="loading" class="flex justify-center my-4">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        
        <div *ngIf="!loading && submissions.length === 0" class="text-center py-4">
          No submissions found.
        </div>
        
        <div class="overflow-x-auto" *ngIf="submissions.length > 0">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Student</th>
                <th>Assignment</th>
                <th>Submitted</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let submission of submissions">
                <td>{{ submission.studentId?.username || 'Unknown' }}</td>
                <td>{{ submission.assignmentId?.name || 'Unknown' }}</td>
                <td>{{ submission.submissionDate | date }}</td>
                <td>
                  <span *ngIf="submission.gradeReceived !== undefined">
                    {{ submission.gradeReceived }}/100
                    <span *ngIf="submission.autoGraded" class="badge badge-info ml-2">AI Graded</span>
                  </span>
                  <span *ngIf="submission.gradeReceived === undefined">Not Graded</span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <a href="{{ submission.fileUrl }}" target="_blank" class="btn btn-xs btn-primary">View</a>
                    <button class="btn btn-xs btn-secondary" (click)="manualGrade(submission)">Grade</button>
                    <button class="btn btn-xs btn-accent" (click)="autoGrade(submission)">Auto-Grade</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Manual Grading Modal -->
      <dialog id="manual_grade_modal" class="modal" [class.modal-open]="selectedSubmission !== null">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Grade Submission</h3>
          <p *ngIf="selectedSubmission">Student: {{ selectedSubmission.studentId?.username }}</p>
          <p *ngIf="selectedSubmission">Assignment: {{ selectedSubmission.assignmentId?.name }}</p>
          
          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Grade (0-100)</span>
            </label>
            <input type="number" [(ngModel)]="gradeValue" class="input input-bordered" min="0" max="100" />
          </div>
          
          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Feedback</span>
            </label>
            <textarea [(ngModel)]="feedbackValue" class="textarea textarea-bordered" rows="4"></textarea>
          </div>
          
          <div class="modal-action">
            <button class="btn btn-outline" (click)="closeManualGradeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="submitGrade()">Submit Grade</button>
          </div>
        </div>
      </dialog>
      
      <!-- Auto-Grading Modal -->
      <dialog id="auto_grade_modal" class="modal" [class.modal-open]="autoGradingSubmission !== null">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Auto-Grading Submission</h3>
          <p *ngIf="autoGradingSubmission">Student: {{ autoGradingSubmission.studentId?.username }}</p>
          <p *ngIf="autoGradingSubmission">Assignment: {{ autoGradingSubmission.assignmentId?.name }}</p>
          
          <div *ngIf="autoGradingLoading" class="flex justify-center my-8">
            <span class="loading loading-spinner loading-lg"></span>
            <p class="ml-4">AI is grading the submission...</p>
          </div>
          
          <div *ngIf="autoGradingComplete" class="mt-4">
            <div class="alert alert-success">
              <span>Auto-grading complete! Grade: {{ autoGradingResult?.gradeReceived }}/100</span>
            </div>
            
            <div class="mt-4">
              <h4 class="font-semibold">Feedback:</h4>
              <p class="mt-2 whitespace-pre-line">{{ autoGradingResult?.feedback }}</p>
            </div>
            
            <div class="mt-4" *ngIf="autoGradingResult?.autoGradingDetails">
              <h4 class="font-semibold">Strengths:</h4>
              <ul class="list-disc ml-5 mt-2">
                <li *ngFor="let strength of autoGradingResult?.autoGradingDetails?.strengths">{{ strength }}</li>
              </ul>
              
              <h4 class="font-semibold mt-3">Areas for Improvement:</h4>
              <ul class="list-disc ml-5 mt-2">
                <li *ngFor="let improvement of autoGradingResult?.autoGradingDetails?.improvements">{{ improvement }}</li>
              </ul>
            </div>
          </div>
          
          <div class="modal-action">
            <button class="btn" (click)="closeAutoGradeModal()">Close</button>
          </div>
        </div>
      </dialog>
    </div>
  `,
  styles: [`
    .modal {
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class SubmissionManagementComponent implements OnInit {
  submissions: Submission[] = [];
  classes: any[] = [];
  assignments: any[] = [];
  selectedClassId: string = '';
  selectedAssignmentId: string = '';
  loading: boolean = false;
  
  // Manual grading
  selectedSubmission: Submission | null = null;
  gradeValue: number = 0;
  feedbackValue: string = '';
  
  // Auto grading
  autoGradingSubmission: Submission | null = null;
  autoGradingLoading: boolean = false;
  autoGradingComplete: boolean = false;
  autoGradingResult: any = null;

  constructor(
    private submissionService: SubmissionService,
    private assignmentService: AssignmentService,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.classService.getClasses().subscribe({
      next: (response: ApiResponse<any[]>) => {
        this.classes = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading classes:', error);
        this.loading = false;
      }
    });
  }

  loadAssignmentsForClass(): void {
    this.loading = true;
    this.assignments = [];
    this.selectedAssignmentId = '';
    
    if (!this.selectedClassId) {
      this.assignmentService.getAssignments().subscribe({
        next: (response: ApiResponse<any[]>) => {
          this.assignments = response.data;
          this.loading = false;
          this.loadSubmissions();
        },
        error: (error: any) => {
          console.error('Error loading assignments:', error);
          this.loading = false;
        }
      });
    } else {
      this.assignmentService.getAssignmentsByClass(this.selectedClassId).subscribe({
        next: (response: ApiResponse<any[]>) => {
          this.assignments = response.data;
          this.loading = false;
          this.loadSubmissions();
        },
        error: (error: any) => {
          console.error('Error loading assignments for class:', error);
          this.loading = false;
        }
      });
    }
  }

  loadSubmissions(): void {
    this.loading = true;
    this.submissions = [];
    
    if (this.selectedAssignmentId) {
      this.submissionService.getSubmissionsByAssignment(this.selectedAssignmentId).subscribe({
        next: (response: ApiResponse<Submission[]>) => {
          this.submissions = response.data;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading submissions for assignment:', error);
          this.loading = false;
        }
      });
    } else if (this.selectedClassId) {
      this.submissionService.getSubmissionsByClass(this.selectedClassId).subscribe({
        next: (response: ApiResponse<Submission[]>) => {
          this.submissions = response.data;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading submissions for class:', error);
          this.loading = false;
        }
      });
    } else {
      // Load all submissions when no class or assignment is selected
      this.submissionService.getAllSubmissions().subscribe({
        next: (response: ApiResponse<Submission[]>) => {
          this.submissions = response.data;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading all submissions:', error);
          this.loading = false;
        }
      });
    }
  }

  manualGrade(submission: Submission): void {
    this.selectedSubmission = submission;
    this.gradeValue = submission.gradeReceived || 0;
    this.feedbackValue = submission.feedback || '';
  }

  closeManualGradeModal(): void {
    this.selectedSubmission = null;
    this.gradeValue = 0;
    this.feedbackValue = '';
  }

  submitGrade(): void {
    if (!this.selectedSubmission) return;
    
    const gradeData = {
      gradeReceived: this.gradeValue,
      feedback: this.feedbackValue
    };
    
    this.submissionService.gradeSubmission(this.selectedSubmission._id, gradeData).subscribe({
      next: (response: ApiResponse<Submission>) => {
        // Update the submission in the list
        const index = this.submissions.findIndex(s => s._id === this.selectedSubmission?._id);
        if (index !== -1) {
          this.submissions[index] = response.data;
        }
        this.closeManualGradeModal();
      },
      error: (error: any) => {
        console.error('Error grading submission:', error);
        alert('Failed to submit grade. Please try again.');
      }
    });
  }

  autoGrade(submission: Submission): void {
    this.autoGradingSubmission = submission;
    this.autoGradingLoading = true;
    this.autoGradingComplete = false;
    this.autoGradingResult = null;
    
    this.submissionService.autoGradeSubmission(submission._id).subscribe({
      next: (response: ApiResponse<any>) => {
        this.autoGradingLoading = false;
        this.autoGradingComplete = true;
        this.autoGradingResult = response.data;
        
        // Update the submission in the list
        const index = this.submissions.findIndex(s => s._id === submission._id);
        if (index !== -1) {
          this.submissions[index] = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error auto-grading submission:', error);
        this.autoGradingLoading = false;
        alert('Failed to auto-grade submission. Please try again or grade manually.');
      }
    });
  }

  closeAutoGradeModal(): void {
    this.autoGradingSubmission = null;
    this.autoGradingComplete = false;
    this.autoGradingResult = null;
  }
} 