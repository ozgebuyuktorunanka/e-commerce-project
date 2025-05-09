import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payments.controller';
import { PaymentService } from './payments.service';
import { PaymentMethod } from './types/payments.methods';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPaymentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const createPaymentDto = {
        orderId: '1',
        amount: 100,
        status: 'pending',
        paymentMethod: PaymentMethod.CREDIT_CARD
      };
      const expectedResult = { id: 1, ...createPaymentDto };
      mockPaymentService.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createPaymentDto)).toBe(expectedResult);
      expect(mockPaymentService.create).toHaveBeenCalledWith(createPaymentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of payments', async () => {
      const expectedResult = [
        { id: 1, orderId: 1, amount: 100, status: 'pending' },
        { id: 2, orderId: 2, amount: 200, status: 'completed' },
      ];
      mockPaymentService.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
      expect(mockPaymentService.findAll).toHaveBeenCalled();
    });
  });
});
