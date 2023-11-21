import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Total number of seats in the train coach
  totalSeats = 80;
  // Number of seats in a row
  seatsPerRow = 7;
  // Number of seats in the last row (which may be less than seatsPerRow)
  lastRowSeats = 3;
  // Array to hold the row numbers
  rows: number[];
  // Set to keep track of reserved seats
  reservedSeats: Set<number> = new Set();
  // Default number of seats to reserve
  numSeats: number = 1; // Default value

  constructor() {
    // Initialize the rows array based on the total number of rows
    this.rows = Array.from({ length: this.calculateRows() }, (_, index) => index + 1);
    // Initializing already reserved seats 
  this.reservedSeats.add(1);
  this.reservedSeats.add(2);
  }

  ngOnInit(): void {}

  // Function to calculate the total number of rows
  calculateRows(): number {
    const fullRows = Math.floor(this.totalSeats / this.seatsPerRow);
    return fullRows + (this.totalSeats % this.seatsPerRow > 0 ? 1 : 0);
  }

  // Function to get the seat numbers in a specific row
  getSeatsInRow(row: number): number[] {
    const startSeat = (row - 1) * this.seatsPerRow + 1;
    const endSeat = Math.min(row * this.seatsPerRow, this.totalSeats);
    return Array.from({ length: endSeat - startSeat + 1 }, (_, index) => startSeat + index);
  }

  // Function to reserve seats
  reserveSeats(): void {
    // Loop through rows to find a row with enough available seats
    for (let row of this.rows) {
      const availableSeats = this.getAvailableSeatsInRow(row);
      // If enough seats are available in the row, reserve them
      if (availableSeats.length >= this.numSeats) {
        for (let i = 0; i < this.numSeats; i++) {
          this.reservedSeats.add(availableSeats[i]);
        }
        return;
      }
    }
    // If no full row is available, reserve nearby seats in any row
    for (let row of this.rows) {
      const availableSeats = this.getAvailableSeatsInRow(row);
      for (let seat of availableSeats) {
        this.reservedSeats.add(seat);
        if (this.reservedSeats.size === this.numSeats) {
          return;
        }
      }
    }
  }

  // Function to get available seats in a specific row
  getAvailableSeatsInRow(row: number): number[] {
    return this.getSeatsInRow(row).filter(seat => !this.reservedSeats.has(seat));
  }

  // Function to check if a seat is selected/reserved
  isSeatSelected(seatNumber: number): boolean {
    return this.reservedSeats.has(seatNumber);
  }
}
