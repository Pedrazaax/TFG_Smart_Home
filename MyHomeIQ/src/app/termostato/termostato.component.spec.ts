import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermostatoComponent } from './termostato.component';

describe('TermostatoComponent', () => {
  let component: TermostatoComponent;
  let fixture: ComponentFixture<TermostatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermostatoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermostatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
