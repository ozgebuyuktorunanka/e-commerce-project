export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}



export enum PaymentMethod  {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL =  'paypal',
  CRYPTO =  'crypto',
  APPLE_PAY =  'apple_pay',
  GOOGLE_PAY =  'google_pay',
}
