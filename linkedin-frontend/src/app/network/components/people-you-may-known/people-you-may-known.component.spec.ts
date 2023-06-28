import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleYouMayKnownComponent } from './people-you-may-known.component';

describe('PeopleYouMayKnownComponent', () => {
  let component: PeopleYouMayKnownComponent;
  let fixture: ComponentFixture<PeopleYouMayKnownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleYouMayKnownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleYouMayKnownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
