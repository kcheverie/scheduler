const OPENING_TIME = 9
const CLOSING_TIME = 17

export function validateBooking(startTime: Date, endTime: Date): boolean {
    const start = startTime.getHours()
    const end = endTime.getHours()
    
      return start < end && start >= OPENING_TIME && end <= CLOSING_TIME
    

}