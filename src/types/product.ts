export interface Product {
  id: string;
  title: string;
  description: string;
  category: Category;
  price: number;
  discountPercentage?: number;
  stock: number;
  brand: string;
  weight: number;
  dimensions: Dimensions;

  material?: string;
  color?: string;
  packQuantity?: number; 
  pageCount?: number; 
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
}

export enum Category {
  PENS = "Pens",
  NOTEBOOKS = "Notebooks",
  STAPLERS_STAPLES = "Staplers/Staples",
  STICKY_NOTES = "Sticky Notes",
  DESK_ORGANIZERS = "Desk Organizers",
}

export const allCategories = Object.keys(Category);

export enum AvailabilityStatus {
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out of Stock",
}

export const allAvailabilityStatuses = Object.keys(AvailabilityStatus);

export enum ReturnPolicy {
  NO_RETURN = "No return policy",
  DAYS_14 = "14 days return policy",
  DAYS_7 = "7 days return policy",
  DAYS_30 = "30 days return policy",
  DAYS_60 = "60 days return policy",
  DAYS_90 = "90 days return policy",
}

export const allReturnPolicies = Object.keys(ReturnPolicy);

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
}
