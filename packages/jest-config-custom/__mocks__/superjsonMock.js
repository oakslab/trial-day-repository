module.exports = {
  // Mock the necessary functions and properties
  stringify: jest.fn().mockImplementation((value) => JSON.stringify(value)),
  parse: jest.fn().mockImplementation((value) => JSON.parse(value)),
};
