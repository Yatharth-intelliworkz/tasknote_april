import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
declare var Razorpay: any;

export class RazorpayService {

  constructor() { }
  options:any;
  initializeRazorpay(paymentData: any, callback: (response: any) => void): void {
    this.options = {
      key: 'rzp_test_wcy8vOc5JCc3vU', // Replace with your Razorpay key
      amount: paymentData.amount * 100, // Amount in paise
      currency: 'INR',
      name: 'TaskNote',
      description: 'Test Transaction',
      image: 'https://example.com/your_logo',
      order_id: paymentData.orderId, // Razorpay order ID
      handler: function (response: any) {
        callback(response); // Pass the response to the callback function
      },
      prefill: {
        name: paymentData.name,
        email: paymentData.email,
        contact: paymentData.contact
      },
      theme: {
        color: '#F37254'
      }
    };

    const razorpay = new Razorpay(this.options);
    razorpay.open();
  }
}
