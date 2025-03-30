import { RelationshipDetector } from '../../../../src/services/metadata/relationship-detector';

describe('RelationshipDetector', () => {
  let relationshipDetector: RelationshipDetector;

  beforeEach(() => {
    relationshipDetector = new RelationshipDetector();
  });

  it('应该能够实例化', () => {
    expect(relationshipDetector).toBeDefined();
  });
}); 