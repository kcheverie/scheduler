import { validateBooking } from '../src/clinic';

let start: Date;
let end: Date;

beforeEach(() => {
  start = new Date();
  end = new Date();
})

test('a 9am start time and 10am end time is valid', () => {
  start.setHours(9, 0, 0, 0);
  end.setHours(10, 0, 0, 0);
  expect(validateBooking(start, end)).toBe(true);
});

test('a 7pm start time is invalid', () => {
  start.setHours(19, 0, 0, 0);
  end.setHours(20, 0, 0, 0);
  expect(validateBooking(start, end)).toBe(false);
});

test('a 5pm end time is valid', () => {
  start.setHours(16, 0, 0, 0);
  end.setHours(17, 0, 0, 0);
  expect(validateBooking(start, end)).toBe(true);
});


test('a 5:30pm end time is ivalid', () => {
  start.setHours(17, 30, 0, 0);
  end.setHours(18, 0, 0, 0);
  expect(validateBooking(start, end)).toBe(false);
});

test('an end time can not be earlier than a start time', () => {
  start.setHours(3, 30, 0, 0);
  end.setHours(1, 0, 0, 0);
  expect(validateBooking(start, end)).toBe(false);
});