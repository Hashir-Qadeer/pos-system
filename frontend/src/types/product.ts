export interface ProductDto {
    id: number;
    sku: string;
    name: string;
    price: number;
    stockQty: number;
    reorderLevel: number;
    categoryId: number;
    categoryName: string;
}