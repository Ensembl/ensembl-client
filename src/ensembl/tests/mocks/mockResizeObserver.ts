class MockResizeObserver {
  public observe() {
    return jest.fn();
  }
  public unobserve() {
    return jest.fn();
  }
}

export default MockResizeObserver;
