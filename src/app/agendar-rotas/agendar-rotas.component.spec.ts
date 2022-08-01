import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarRotasComponent } from './agendar-rotas.component';

describe('AgendarRotasComponent', () => {
  let component: AgendarRotasComponent;
  let fixture: ComponentFixture<AgendarRotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendarRotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarRotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
