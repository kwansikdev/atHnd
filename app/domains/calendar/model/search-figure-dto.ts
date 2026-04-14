export interface SearchFigureDto {
  id: string;
  release: {
    text: string;
    no: number;
    notice: string;
  };
  price: {
    kr: number;
    jp: number;
  };
  detail: {
    id: string;
    name: string;
    manufacturer: {
      id: number;
      name: string;
    };
    images: Array<{
      image_url: string;
      sort_order: number;
    }>;
  };
}
