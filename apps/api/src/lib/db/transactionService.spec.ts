import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { TRPCError } from '@trpc/server';
import { LoggerService } from '../../services';
import { PrismaService } from './prisma';
import { PrismaTransaction, TransactionService } from './transactionService';

jest.mock('./prisma');
jest.mock('../../services/logger');

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockPrismaService: DeepMocked<PrismaService>;
  let mockLoggerService: LoggerService;

  beforeEach(() => {
    mockPrismaService = createMock<PrismaService>();
    mockLoggerService = createMock<LoggerService>();

    transactionService = new TransactionService(
      mockPrismaService,
      mockLoggerService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('enter function', () => {
    it('should handle a transaction correctly', async () => {
      // arrange
      const transactionMock: PrismaTransaction =
        createMock<PrismaTransaction>();
      const transactionResult = { ok: true };
      const mockFn = jest.fn().mockResolvedValue(transactionResult);

      mockPrismaService.$transaction.mockImplementation(async (cb) => {
        return cb(transactionMock);
      });

      // act
      const result = await transactionService.enter(mockFn);

      // assert
      expect(result).toBe(transactionResult);
      expect(mockFn).toHaveBeenCalledWith(transactionMock);
    });

    it('should handle errors in transaction function', async () => {
      // arrange
      const transactionMock: PrismaTransaction =
        createMock<PrismaTransaction>();
      const errorResult = {
        ok: false,
        error: new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        }),
      };

      const mockFn = jest.fn().mockResolvedValue(errorResult);
      mockPrismaService.$transaction.mockImplementation(async (cb) => {
        return cb(transactionMock);
      });

      // act
      // assert
      await expect(transactionService.enter(mockFn)).rejects.toThrow(
        errorResult.error,
      );
      expect(mockFn).toHaveBeenCalledWith(transactionMock);
    });
  });

  describe('current function', () => {
    it('should return the current active transaction', () => {
      // arrange

      // act
      // assert
      transactionService.enter(async (transaction) => {
        expect(transactionService.current()).toBe(transaction);
        return {
          ok: true,
        };
      });
    });

    it('should return the prisma service if no active transaction', () => {
      // arrange

      // act
      // assert
      expect(transactionService.current()).toBe(mockPrismaService);
    });
  });
});
