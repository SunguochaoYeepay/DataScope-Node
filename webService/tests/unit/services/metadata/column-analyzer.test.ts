import { ColumnAnalyzer } from '../../../../src/services/metadata/column-analyzer';

describe('ColumnAnalyzer', () => {
  let columnAnalyzer: ColumnAnalyzer;

  beforeEach(() => {
    columnAnalyzer = new ColumnAnalyzer();
  });

  it('应该能够实例化', () => {
    expect(columnAnalyzer).toBeDefined();
  });
}); 