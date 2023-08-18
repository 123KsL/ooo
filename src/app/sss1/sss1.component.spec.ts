import { ComponentFixture,TestBed} from '@angular/core/testing';

import { Sss1Component } from './sss1.component';
import { ActivatedRoute } from '@angular/router';
// import 'jasmine';
import { Spectator, createComponentFactory,SpectatorFactory} from '@ngneat/spectator';

let spectator: Spectator<Sss1Component>;

const fakeActivatedRoute: ActivatedRoute = {
  snapshot: { data: {} },
} as ActivatedRoute;

const componentFactory: SpectatorFactory<Sss1Component> = createComponentFactory({
  component: Sss1Component,
  declareComponent: false,
  imports: [
    // some imports
  ],
  providers: [
    // some providers
  ],
  detectChanges: false,
  shallow: true,
});

beforeEach(async () => {
  spectator = componentFactory();
});

it('should be created', () => {
  expect(spectator).toBeDefined();
});






// describe('Sss1Component', () => {
//   let component: Sss1Component;
//   let fixture: ComponentFixture<Sss1Component>;
//   const componentFactory: SpectatorFactory<Sss1Component> = createComponentFactory({
//     component: Sss1Component,
//     declareComponent: false,
// });
//   beforeEach(async () => {
//     TestBed.configureTestingModule(
//       // imports:[ DynamicTestModule],
//       // declarations: [ Sss1Component ]
//       spectator = componentFactory());
//     )
//     .compileComponents();

//     fixture = TestBed.createComponent(Sss1Component);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
