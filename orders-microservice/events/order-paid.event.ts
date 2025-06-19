
export class OrderPaidEvent {
    constructor(
        public readonly orderId: string,
        public readonly paymentId: string,
        public readonly paidAt: Date,
    ){}
}