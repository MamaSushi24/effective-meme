export default interface IProduct {
  id: string;

  description: string;

  name: string;

  price: number;

  /**The first (featured) image attached to the product. */
  featuredImage: string;

  /** The relative URL of the product. */
  url: string;

  slug: string;
  parentGroup?: string | null;
  nameSyrve: string;
  availableOnlyForSpecifiedDays: boolean;
  aviabilityDays: string[];
}
