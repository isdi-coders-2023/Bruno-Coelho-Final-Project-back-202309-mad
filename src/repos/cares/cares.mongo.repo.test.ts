import { Care } from '../../entities/care.js';
import { CareModel } from './cares.mongo.model.js';
import { CaresMongoRepo } from './cares.mongo.repo.js';
// Import { Auth } from '../../services/auth.js';
// import { Care } from '../../entities/care';
// import { HttpError } from '../../types/http.error.js';

jest.mock('./cares.mongo.model.js');

describe('GivenCaresMongoRepo', () => {
  const mockRepo = new CaresMongoRepo();
  describe('When it is instantiated', () => {
    test('Then the search method should be used', async () => {
      const mockCare = [{ type: 'Test', enum: 'hair' } as unknown as Care];
      const exec = jest.fn().mockResolvedValueOnce(mockCare);
      CareModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await mockRepo.search('hair');
      expect(CareModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockCare);
    });
    test('Then the search method should be used', async () => {
      const mockCare = [{ type: 'Test', enum: 'hair' } as unknown as Care];

      const exec = jest.fn().mockResolvedValueOnce(mockCare);
      CareModel.find = jest.fn().mockReturnValueOnce({
        skip: jest.fn().mockReturnValueOnce({
          limit: jest.fn().mockReturnValueOnce({
            exec,
          }),
        }),
      });
      const result = await mockRepo.getByPage('hair', '2');
      expect(CareModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockCare);
    });
  });
});
