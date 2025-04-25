import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { UsersService } from 'users/users.service';
import { ProductsService } from 'products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private userService: UsersService,
    private productService: ProductsService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'products'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['user', 'products'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['products'],
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userService.findOne(createOrderDto.userId);
    const products = await Promise.all(
      createOrderDto.productIds.map((id) => this.productService.findOne(id)),
    );

    // Calculate total price
    const totalAmount = products.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    const order = this.orderRepository.create({
      user,
      products,
      totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
    });

    return this.orderRepository.save(order);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (
      updateOrderDto.status &&
      Object.values(OrderStatus).includes(updateOrderDto.status as OrderStatus)
    ) {
      order.status = updateOrderDto.status as OrderStatus;
    }

    if (updateOrderDto.shippingAddress) {
      order.shippingAddress = updateOrderDto.shippingAddress;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }
}
