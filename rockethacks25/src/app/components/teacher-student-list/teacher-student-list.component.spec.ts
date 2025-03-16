import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherStudentListComponent } from './teacher-student-list.component';

describe('TeacherStudentListComponent', () => {
  let component: TeacherStudentListComponent;
  let fixture: ComponentFixture<TeacherStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherStudentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
