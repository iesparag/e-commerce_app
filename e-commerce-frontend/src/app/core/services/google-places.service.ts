// google-places.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; // Import Subject to emit the selected address

declare global {
  interface Window {
    google: any;
  }
}

interface PlaceResult {
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GooglePlacesService {
  private formattedAddress: string = '';
  private addressComponents: Array<any> = [];
  
  // Create a Subject to emit the selected address
  private addressSubject = new Subject<string>();

  constructor() {}

  // Method to initialize Google Places Autocomplete
  initializeAutocomplete(inputElement: HTMLInputElement): any {
    const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
      types: ['geocode'],
      componentRestrictions: { country: 'in' },
    });

    // Listen to the 'place_changed' event
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace() as PlaceResult;
      if (place) {
        // Update the formatted address and address components
        this.formattedAddress = place.formatted_address || '';
        this.addressComponents = place.address_components || [];
        console.log('this.addressComponents: ', this.addressComponents);

        // Emit the updated formatted address to the component
        this.addressSubject.next(this.formattedAddress);
        
        // Set the input element's value to the formatted address
        inputElement.value = this.formattedAddress;
      }
    });
  }

  // Method to get the stored formatted address
  getFormattedAddress(): string {
    return this.formattedAddress;
  }

  // Method to get the stored address components
  getAddressComponents(): Array<any> {
    return this.addressComponents;
  }

  // Method to get the address observable for the component to subscribe
  getAddressObservable() {
    return this.addressSubject.asObservable();
  }
}
