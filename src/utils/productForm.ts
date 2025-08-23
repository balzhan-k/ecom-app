// src/utils/productForm.ts
import { Category, AvailabilityStatus, ReturnPolicy } from "@/types/product";

// Optional, but helps readability across files
export type RawProductFormData = {
  id?: string;
  title: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  tags: string[];
  brand: string;
  weight: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  material?: string;
  color?: string;
  packQuantity?: string;
  pageCount?: string;
  discountPercentage?: string;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: string;
  images: string[];
  meta: { createdAt: string; updatedAt: string };
};

export function extractFormData(formData: FormData): RawProductFormData {
  const idValue = formData.get("id");
  const id =
    idValue && idValue.toString().trim() !== ""
      ? idValue.toString()
      : undefined;

  const getStringValue = (key: string) => {
    const value = formData.get(key);
    return value && value.toString().trim() !== ""
      ? value.toString()
      : undefined;
  };
  const getNumberValue = (key: string) => {
    const value = formData.get(key);
    return value && value.toString().trim() !== ""
      ? value.toString()
      : undefined;
  };

  return {
    id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    price: formData.get("price") as string,
    stock: formData.get("stock") as string,
    tags: formData.getAll("tags") as string[],
    brand: formData.get("brand") as string,
    weight: formData.get("weight") as string,
    dimensions: {
      width: formData.get("dimensions.width") as string,
      height: formData.get("dimensions.height") as string,
      depth: formData.get("dimensions.depth") as string,
    },
    material: getStringValue("material"),
    color: getStringValue("color"),
    packQuantity: getNumberValue("packQuantity"),
    pageCount: getNumberValue("pageCount"),
    discountPercentage: getNumberValue("discountPercentage"),
    warrantyInformation: formData.get("warrantyInformation") as string,
    shippingInformation: formData.get("shippingInformation") as string,
    availabilityStatus: formData.get("availabilityStatus") as string,
    returnPolicy: formData.get("returnPolicy") as string,
    minimumOrderQuantity: formData.get("minimumOrderQuantity") as string,
    images: formData.getAll("images") as string[],
    meta: { createdAt: "", updatedAt: "" },
  };
}

export function convertRawDataToInputs(rawData: RawProductFormData) {
  return {
    title: rawData.title,
    description: rawData.description,
    category: rawData.category as Category,
    price: parseFloat(rawData.price) || 0,
    discountPercentage: rawData.discountPercentage
      ? parseFloat(rawData.discountPercentage)
      : undefined,
    stock: parseInt(rawData.stock) || 0,
    brand: rawData.brand,
    weight: parseFloat(rawData.weight) || 0,
    dimensions: {
      width: parseFloat(rawData.dimensions.width) || 0,
      height: parseFloat(rawData.dimensions.height) || 0,
      depth: parseFloat(rawData.dimensions.depth) || 0,
    },
    material: rawData.material || undefined,
    color: rawData.color || undefined,
    packQuantity: rawData.packQuantity
      ? parseInt(rawData.packQuantity)
      : undefined,
    pageCount: rawData.pageCount ? parseInt(rawData.pageCount) : undefined,
    warrantyInformation: rawData.warrantyInformation,
    shippingInformation: rawData.shippingInformation,
    availabilityStatus: rawData.availabilityStatus as AvailabilityStatus,
    returnPolicy: rawData.returnPolicy as ReturnPolicy,
    minimumOrderQuantity: parseInt(rawData.minimumOrderQuantity) || 1,
    images: rawData.images,
    meta: rawData.meta,
    id: undefined,
  };
}

export function removeUndefined(obj: unknown): unknown {
  if (obj === undefined || obj === null) return undefined;
  if (Array.isArray(obj))
    return obj.map(removeUndefined).filter((item) => item !== undefined);
  if (typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeUndefined(value);
      if (cleanedValue !== undefined) cleaned[key] = cleanedValue;
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  return obj;
}
