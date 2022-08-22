import { Test, TestingModule } from '@nestjs/testing';
import { ExamResultsController } from './exam_results.controller';

describe('ExamResultsController', () => {
  let controller: ExamResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamResultsController],
    }).compile();

    controller = module.get<ExamResultsController>(ExamResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
