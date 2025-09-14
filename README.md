# Clinic Scheduler Application

This project is an MVP scheduling system for a physiotherapy clinic.  
It manages appointment slots, bookings, and enforces business rules such as operating hours, non-overlapping bookings, and minimum advance notice.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node.js)
- TypeScript (installed as a dev dependency)

### Installation
Clone the repo and install dependencies:
```bash
git clone git@github.com:kcheverie/scheduler.git
cd scheduler
npm install
```

---

## Running the Code

To build the TypeScript source into JavaScript:
```bash
npm run build
```

To run the compiled code (after building):
```bash
node dist/index.js
```

For development with automatic rebuild:
```bash
npm run dev
```

---

## Running Tests

This project uses **Jest** for unit testing.

Run the test suite:
```bash
npm test
```

Run tests with detailed output (e.g., only failing tests):
```bash
npm test -- --verbose=false
```

Run a single test file:
```bash
npm test clinic.test.ts
```

---

## Project Structure

```
src/
  clinic.ts             # Core Clinic class (slots, bookings, validation)
  models/               # Data models (AppointmentType, AppointmentSlot, Booking)
tests/
  clinic.test.ts        # Unit tests for clinic logic
```

---

## Improvements / TODOs

- [ ] Implement `Patient` model so practitioner has contact information for each booking
- [ ] Install a package to handle creating unique ID's where necessary
- [ ] Restrict `getBookings` to role-based access to alleviate security concerns
- [ ] Implement routing/API endpoints
- [ ] Add timezone support
- [ ] Allow for more customizable `AppointmentSlots` and `AppointmentTypes`

---

## License
MIT
