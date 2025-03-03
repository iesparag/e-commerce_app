import {
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { CartItem } from './state/cart.state';
import { Store } from '@ngrx/store';
import { getUserCart } from './state/cart.actions';
import { Observable } from 'rxjs';
import { selectAllCartItems } from './state/cart.selectors';
import { CartCommonCardComponent } from '../../shared/components/cart-common-card/cart-common-card.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SaveForLaterComponent } from '../save-for-later/save-for-later.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { GooglePlacesService } from '../../core/services/google-places.service';
import { FormsModule } from '@angular/forms';
import {
    addAddressStart,
    fetchAddressesStart,
} from '../auth/state/auth.actions';
import { AddressResponse } from '../auth/state/auth.state';
import { selectUserAddresses } from '../auth/state/auth.selectors';
import { createPaymentIntent } from './payment-state/payment.actions';

@Component({
    selector: 'app-cart',
    imports: [
        CartCommonCardComponent,
        AsyncPipe,
        CommonModule,
        FormsModule,
        RouterLink,
        SaveForLaterComponent,
        EmptyStateComponent,
    ],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
    showAddressList: boolean = true;
    store = inject(Store);
    addressessList$: Observable<AddressResponse[]> =
        this.store.select(selectUserAddresses);
    selectedAddressId: string | null = null;
    formattedAddress: string = '';
    addressComponents: Array<any> = [];
    address: string = '';
    addressDetails = {
        floor: '',
        building: '',
        street: '',
        locality: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        isDefault: false,
    };
    isAddressSaved: boolean = false;
    isError: boolean = false;
    errorMessage: string = '';
    userCartList$: Observable<CartItem[]> =
        this.store.select(selectAllCartItems);
    totalAmount: number = 0;

    constructor(private googlePlacesService: GooglePlacesService) {}

    ngOnInit(): void {
        // this.initializeAddressAutocomplete();
        this.loadAddresses();
        this.loadCartItems();
        this.monitorSelectedAddress();
    }

//  ngAfterViewInit(): void {
//      this.initializeAddressAutocomplete();
// }

    private loadAddresses(): void {
        this.store.dispatch(fetchAddressesStart());
        this.addressessList$.subscribe((addresses) => {
            const defaultAddress = addresses.find(
                (address) => address.isDefault
            );
            if (defaultAddress) {
                this.selectedAddressId = defaultAddress._id;
            }
        });
       
    }

    private loadCartItems(): void {
        this.store.dispatch(getUserCart());
        this.userCartList$.subscribe((cartItems) => {
            this.totalAmount = this.calculateTotalAmount(cartItems);
        });
    }

    private monitorSelectedAddress(): void {
        this.googlePlacesService
            .getAddressObservable()
            .subscribe((selectedAddress) => {
                this.address = selectedAddress;
                console.log('Address selected:', this.address);
                this.addressComponents =
                    this.googlePlacesService.getAddressComponents();
                this.processAddressComponents();
            });
             this.formattedAddress = this.googlePlacesService.getFormattedAddress();
        this.addressComponents =
            this.googlePlacesService.getAddressComponents();
    }

    private calculateTotalAmount(cartItems: CartItem[]): number {
        return cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
    }

    onAddressSelect(address: AddressResponse): void {
        this.selectedAddressId = address._id;
    }

    addNewAddress(): void {
        this.showAddressList = false;
        this.resetAddressDetails();
        this.selectedAddressId = null;
    }

    cancelAddNewAddress() {
        this.showAddressList = true;
    }

    private resetAddressDetails(): void {
        this.addressDetails = {
            floor: '',
            building: '',
            street: '',
            locality: '',
            city: '',
            state: '',
            country: '',
            zip: '',
            isDefault: false,
        };
    }

    onAddressChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.address = input.value;
        this.googlePlacesService.initializeAutocomplete(input);
        this.isAddressSaved = false;
        console.log('Selected Address:', this.address);
    }

    private processAddressComponents(): void {
        const components = this.addressComponents;
        this.addressDetails = {
            floor: this.extractAddressComponent(components, 'street_number'),
            building: this.extractAddressComponent(components, 'premise'),
            street: this.extractAddressComponent(components, 'route') ,
            locality: this.extractAddressComponent(components, 'locality') || this.extractAddressComponent(components, 'sublocality') || this.extractAddressComponent(components, "sublocality_level_1"),
            city: this.extractAddressComponent(
                components,
                'administrative_area_level_3'
            ),
            state: this.extractAddressComponent(
                components,
                'administrative_area_level_1'
            ),
            country: this.extractAddressComponent(components, 'country'),
            zip: this.extractAddressComponent(components, 'postal_code'),
            isDefault: false,
        };
    }

    private extractAddressComponent(components: any[], type: string): string {
        const component = components.find((c) => c.types.includes(type));
        return component ? component.long_name : '';
    }

    validateAddressFields(): boolean {
        this.isError = false;
        this.errorMessage = '';
        const missingFields = Object.keys(this.addressDetails).filter(
            (key) =>
               key !== 'isDefault' && !this.addressDetails[key as keyof typeof this.addressDetails]
        );
        if (missingFields.length > 0) {
            this.isError = true;
            this.errorMessage = `Please fill in all required fields: ${missingFields.join(
                ', '
            )}`;
            return false;
        }
        return true;
    }

    saveAddressDetails(): void {
        if (this.validateAddressFields()) {
            const completeAddress = {
                mainAddress: this.address,
                ...this.addressDetails,
            };
            this.store.dispatch(
                addAddressStart({ addresses: completeAddress })
            )
            this.showAddressList = true;
            this.resetAddressDetails();
        } else {
            console.error('Please complete all address fields before saving');
        }
    }

    useMyLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.reverseGeocode(latitude, longitude);
                },
                (error) => console.error('Error getting geolocation:', error)
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    reverseGeocode(lat: number, lng: number): void {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(lat, lng);
        geocoder.geocode({ location: latLng }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
                const address = results[0].formatted_address;
                this.address = address;
                const components = results[0].address_components;
                this.processAddressComponentsFromGeocode(components);
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }

    private processAddressComponentsFromGeocode(components: any[]): void {
        this.addressDetails = {
            floor: this.extractAddressComponent(components, 'floor'),
            building: this.extractAddressComponent(components, 'building'),
            street: this.extractAddressComponent(components, 'route'),
            locality: this.extractAddressComponent(components, 'locality'),
            city: this.extractAddressComponent(components, 'locality'),
            state: this.extractAddressComponent(
                components,
                'administrative_area_level_1'
            ),
            country: this.extractAddressComponent(components, 'country'),
            zip: this.extractAddressComponent(components, 'postal_code'),
            isDefault: false,
        };
    }



   checkout() {
    if (!this.selectedAddressId) {
      alert('Please select an address.');
      return;
    }
    this.store.dispatch(createPaymentIntent());
  }
}
