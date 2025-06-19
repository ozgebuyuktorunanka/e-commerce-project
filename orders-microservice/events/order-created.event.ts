
export class OrderCreatedEvent {
    constructor(
        public readonly orderId: string,
        public readonly userId: string,
        public readonly products: Array <{id:string; quantity:number}>,
        public readonly totalAmount: number,
        public readonly createdAt: Date,
    ){}
}