import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorConsumosComponent } from './simulador-consumos.component';

describe('SimuladorConsumosComponent', () => {
  let component: SimuladorConsumosComponent;
  let fixture: ComponentFixture<SimuladorConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimuladorConsumosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimuladorConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});