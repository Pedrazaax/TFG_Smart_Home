import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAdminComponent } from './control-admin.component';

describe('ControlAdminComponent', () => {
  let component: ControlAdminComponent;
  let fixture: ComponentFixture<ControlAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
