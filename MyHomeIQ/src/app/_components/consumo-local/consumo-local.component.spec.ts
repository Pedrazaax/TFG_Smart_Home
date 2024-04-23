import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoLocalComponent } from './consumo-local.component';

describe('ConsumoLocalComponent', () => {
  let component: ConsumoLocalComponent;
  let fixture: ComponentFixture<ConsumoLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumoLocalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
