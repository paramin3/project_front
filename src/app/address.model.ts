// src/app/address-management/address.model.ts
export interface Address {
    id?: number;
    name: string;
    homeAddress: string;
    road?: string | null;
    soi?: string | null;
    moo?: string | null;
    subDistrict: string;
    district: string;
    city: string;
    postcode: string;
    isDefault: boolean;
    user?: any;
  }