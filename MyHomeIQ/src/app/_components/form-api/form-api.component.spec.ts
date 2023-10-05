import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAPIComponent } from './form-api.component';

describe('FormAPIComponent', () => {
  let component: FormAPIComponent;
  let fixture: ComponentFixture<FormAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAPIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
