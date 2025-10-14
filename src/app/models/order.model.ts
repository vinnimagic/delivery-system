export interface Order {
    id?: string;
    customerName: string;
    phone: string;
    address: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt?: Date;
    estimatedDelivery?: Date;
  }
  
  export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }
  
  export enum OrderStatus {
    RECEIVED = 'RECEBIDO',
    PREPARING = 'EM_PREPARO',
    ON_ROUTE = 'EM_ROTA',
    DELIVERED = 'ENTREGUE'
  }