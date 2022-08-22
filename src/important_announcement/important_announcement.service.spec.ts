import { Test, TestingModule } from '@nestjs/testing';
import { ImportantAnnouncementService } from './important_announcement.service';

describe('ImportantAnnouncementService', () => {
  let service: ImportantAnnouncementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportantAnnouncementService],
    }).compile();

    service = module.get<ImportantAnnouncementService>(ImportantAnnouncementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
