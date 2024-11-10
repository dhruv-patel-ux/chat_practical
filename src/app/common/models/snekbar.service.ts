import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  openErrorSnackBar(message: any) {
    this._snackBar.open(message, 'close', {
      panelClass: ['error-snackbar'],
      duration: 3000
    });
  }
  openSuccessSnackBar(message: any) {
    this._snackBar.open(message, 'close', {
      panelClass: ['success-snackbar'],
      duration: 3000
    });
  }
  constructor(
    private _snackBar: MatSnackBar,
  ) { }
}