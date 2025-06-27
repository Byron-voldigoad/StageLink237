import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuteurComponent } from './tuteur.component';

describe('TuteurComponent', () => {
  let component: TuteurComponent;
  let fixture: ComponentFixture<TuteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
