export interface OrderItemRequestDto {
    productId: number;
    quantity: number;
}

export interface CreateOrderDto {
    cashierId: number;
    customerId?: number;
    items: OrderItemRequestDto[];
}

export interface OrderItemResponseDto {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface OrderResponseDto {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItemResponseDto[];
}