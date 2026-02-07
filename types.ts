
export enum OrderStatus {
  CREATED = 'CREATED',
  PARTNER_ASSIGNED = 'PARTNER_ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_PROCESSING = 'IN_PROCESSING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum ServiceType {
  WASH_FOLD = 'Wash & Fold',
  WASH_IRON = 'Wash & Iron',
  DRY_CLEAN = 'Dry Clean',
  SHOE_WASH = 'Shoe Wash',
  BLANKET_CLEANING = 'Blanket Cleaning',
  EXPRESS = 'Express Service',
  QUICK_SERVICE = 'Quick Service',
  STEAM_IRON = 'Steam Iron'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COD = 'COD'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  PARTNER = 'PARTNER'
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  serviceType: ServiceType;
  status: OrderStatus;
  clothCount?: number;
  blanketCount?: number;
  pickupTime: string; // Scheduled/Estimated
  actualPickupTime?: string; // When actually picked up
  readyAtTime?: string; // When moved to READY status
  actualDeliveryTime?: string; // When DELIVERED
  deliveryTime: string; // Scheduled
  totalAmount: number;
  paymentStatus: PaymentStatus;
  partnerId?: string;
  createdAt: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Partner extends User {
  activeStatus: boolean;
  totalOrders: number;
  performanceRating: number;
}
