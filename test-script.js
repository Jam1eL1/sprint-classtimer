(function simulateTime() {
  const originalDate = Date;
  
  // Mock Date to always return 58 minutes
  class MockDate extends Date {
    constructor(...args) {
      if (args.length) {
        super(...args);
      } else {
        const now = new originalDate();
        now.setMinutes(58); // Force the minute to be 58
        now.setSeconds(0);
        super(now);
      }
    }
  }

  // Override the global Date object
  window.Date = MockDate;

  console.log("🕒 Time overridden! Your script should now think it's 58 minutes past the hour.");
})();
