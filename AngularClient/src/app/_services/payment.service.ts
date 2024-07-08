import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PaymentRequest {
  PaymentMethodId: string;
  Amount: number;
  Currency: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  // private apiUrl = 'http://localhost:4201/api/payments';
  // constructor(private http: HttpClient) {}
  // processPayment(
  //   paymentMethodId: string,
  //   amount: number,
  //   currency: string
  // ): Observable<any> {
  //   const paymentData: PaymentRequest = {
  //     PaymentMethodId: paymentMethodId,
  //     Amount: amount,
  //     Currency: currency,
  //   };
  //   return this.http.post<any>(this.apiUrl, paymentData);
  // }
}
