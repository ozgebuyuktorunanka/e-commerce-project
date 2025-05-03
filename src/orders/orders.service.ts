import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { UsersService } from 'users/users.service';
import { ProductsService } from 'products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private userService: UsersService,
    private productService: ProductsService,
  ) {}

  /**
   * Fetch all orders along with their related users and products.
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'products'],
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
      relations: ['user', 'products'],
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
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['products'],
    });
  }

  /**
   * Create a new order with user and product details.
   * @param createOrderDto - The data for creating a new order.
   * @returns The newly created order.
   * @throws NotFoundException if the user or any of the products are not found.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userService.findOne(createOrderDto.userId);
    const products = await Promise.all(
      createOrderDto.productIds.map((id) => this.productService.findOne(id)),
    );

    // If any of the products are not found, an exception will be thrown automatically.
    if (!user) {
      throw new NotFoundException(`User with ID ${createOrderDto.userId} not found`);
    }

    // Calculate total price
    const totalAmount = products.reduce((sum, product) => sum + Number(product.price), 0);

    // Create the order entity
    const order = this.orderRepository.create({
      user,
      products,
      totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
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
    const order = await this.findOne(id);

    const { status, shippingAddress } = updateOrderDto;

    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      order.status = status as OrderStatus;
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
    order.status = status;
    return this.orderRepository.save(order);
  }
}
