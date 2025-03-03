import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-empty-state',
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss'],
    imports: [RouterLink,CommonModule],
})
export class EmptyStateComponent {
    @Input() image: string =""
    @Input() heading: string = 'Nothing here yet!'; 
    @Input() message: string = 'Looks like there’s nothing to display here.';
    @Input() actionLink: string = '';
    @Input() buttonText: string = ''; 
}
