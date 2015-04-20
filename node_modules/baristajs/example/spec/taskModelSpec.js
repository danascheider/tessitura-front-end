require(process.cwd() + '/spec/support/fixtures.js');

describe('Task model', function() {
  beforeEach(function() {
    task = new Barista.TaskModel();
  });

  it('has a default title of \'Untitled Task 1\'', function() {
    expect(task.get('title')).toBe('Untitled Task 1');
  });
});