import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCamaraComponent } from './video-camara.component';

describe('VideoCamaraComponent', () => {
  let component: VideoCamaraComponent;
  let fixture: ComponentFixture<VideoCamaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoCamaraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCamaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
