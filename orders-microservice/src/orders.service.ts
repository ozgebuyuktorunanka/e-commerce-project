import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../libs/src/orders/entities/order.entity';
import { UsersService } from '../../users-microservice/src/users.service';
import { ProductsService } from '../../products-microservice/src/products.service';
import { CreateOrderDto } from '../../libs/src/orders/dto/create-order.dto';
import { UpdateOrderDto } from '../../libs/src/orders/dto/update-order.dto';
import { OrderStatus } from '../../libs/src/orders/entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private userService: UsersService,
    private productService: ProductsService,
  ) { }

  /**
   * Fetch all orders along with their related users and products.
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'products'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Fetch a specific order by its ID, including related user and products.
   * @param id - The ID of the order.
   * @returns The order details.
   * @throws NotFoundException if the order is not found.
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'products']
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  /**
   * Fetch orders for a specific user by their user ID.
   * @param userId - The ID of the user.
   * @returns The list of orders for the user.
   */
  async findByUser(userId: number): Promise<Order[]> {
    //Control the user is allready  exist.
    await this.userService.findOne(userId);

    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['products'],
      order: { createdAt: 'DESC' },
    });
  };

  /**
   * Create a new order with user and product details.
   * @param createOrderDto - The data for creating a new order.
   * @returns The newly created order.
   * @throws NotFoundException if the user or any of the products are not found.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, productIds, shippingAddress } = createOrderDto;

    const user = await this.userService.findOne(createOrderDto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    //Control the product's details.
    if (!productIds || productIds.length === 0) {
      throw new BadRequestException('At least one product is required');
    }


    const products = await Promise.all(
      productIds.map(id => this.productService.findOne(id)),
    );

    // Calculate total price
    const totalAmount = products.reduce((sum, product) => sum + Number(product.price), 0);

    // Create an order
    const order = this.orderRepository.create({
      user,
      products,
      totalAmount,
      shippingAddress,
      status: OrderStatus.PENDING,
    });

    return this.orderRepository.save(order);
  }

  /**
   * Update an existing order by its ID.
   * @param id - The ID of the order to update.
   * @param updateOrderDto - The data to update the order.
   * @returns The updated order.
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { status, shippingAddress } = updateOrderDto;

    const order = await this.findOne(id);

    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      order.status = status;
    }

    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }
    return this.orderRepository.save(order);
  }

  /**
   * Remove an order by its ID.
   * @param id - The ID of the order to remove.
   * @throws NotFoundException if the order is not found.
   */
  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);

    //We can be able to delete only Pending or Cancelled status order.
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CANCELLED) {
      throw new BadRequestException('Only pending or cancelled orders can be deleted');
    }
    await this.orderRepository.remove(order);
  }

  /**
   * Update the status of an existing order.
   * @param id - The ID of the order to update.
   * @param status - The new status to set for the order.
   * @returns The updated order.
   */
  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);

    //Status transation control
    if (!this.isValidStatusTransition(order.status, status)) {
      throw new BadRequestException(`Cannot change status from ${order.status} to ${status}`);
    }

    order.status = status;
    return this.orderRepository.save(order);
  }

  /**
* Validates whether a status transition from current status to new status is allowed.
* Prevents invalid order status changes and maintains proper order workflow.
* 
* @param currentStatus - The current status of the order
* @param newStatus - The desired new status to transition to
* @returns {boolean} - True if the transition is valid, false otherwise
* 
* @example
* // Valid transition
* isValidStatusTransition(OrderStatus.PENDING, OrderStatus.PROCESSING) // returns true
* 
* @example
* // Invalid transition
* isValidStatusTransition(OrderStatus.SHIPPED, OrderStatus.PENDING) // returns false
* 
* Valid transitions:
* - PENDING → PROCESSING, CANCELLED
* - PROCESSING → CONFIRMED, CANCELLED
* - CONFIRMED → SHIPPED, CANCELLED
* - SHIPPED → CANCELLED (for returns)
* - CANCELLED → (no transitions allowed)
*/
  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED
      ],
      [OrderStatus.PROCESSING]: [
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED
      ],
      [OrderStatus.CONFIRMED]: [
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED
      ],
      [OrderStatus.SHIPPED]: [
        OrderStatus.CANCELLED
      ],
      [OrderStatus.CANCELLED]: [
        // No transitions allowed from cancelled status
      ],
    };
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}
