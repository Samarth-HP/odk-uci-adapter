import { Test, TestingModule } from '@nestjs/testing';
import { ImportantAnnouncementController } from './important_announcement.controller';

describe('ImportantAnnouncementController', () => {
  let controller: ImportantAnnouncementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportantAnnouncementController],
    }).compile();

    controller = module.get<ImportantAnnouncementController>(ImportantAnnouncementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
