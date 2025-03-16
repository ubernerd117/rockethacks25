import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth0SignupComponent } from './auth0-signup.component';

describe('Auth0SignupComponent', () => {
  let component: Auth0SignupComponent;
  let fixture: ComponentFixture<Auth0SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auth0SignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Auth0SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
