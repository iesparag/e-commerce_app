import { CommonModule } from '@angular/common';
import { Component,CUSTOM_ELEMENTS_SCHEMA, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
   encapsulation: ViewEncapsulation.None
})
export class CarouselComponent {
  @Input() images: string[] = [];

}
