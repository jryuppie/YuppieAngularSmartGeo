import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaEquipeComponent } from './mapa-equipe.component';

describe('MapaEquipeComponent', () => {
  let component: MapaEquipeComponent;
  let fixture: ComponentFixture<MapaEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaEquipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
