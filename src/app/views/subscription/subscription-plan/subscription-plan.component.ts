import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})
export class SubscriptionPlanComponent implements OnInit {
  isModalOpen: boolean = false;
  private apiUrl = environment.ApiUrl;
  calculationData: any;
  totalDays: number = 0;
  costPerDay: number = 10;
  totalCost: number = 0;
  oneYearLater: any;
  sixMonthsLater: any;
  threeMonthsLater: any;
  todayDate = new Date();
  
  // PhonePe Configuration
  private baseUrl = 'https://api.phonepe.com/apis/hermes/pg/v1/phonepe-api/pay';
  private merchantId = 'M22B04II0CH0J';
  private saltKey = '6ce385d7-d96e-4642-84c1-3516e298ba72';
  private saltIndex = '1'; // Usually provided by PhonePe

  constructor(
    private commonService: CommonService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getyourplan();
    this.commonService.checkLoggedIn();
  }

  // Your existing modal and calculation methods remain the same...

  async makePayment(price: number) {
    try {
      const mainprice = price;
      const gstPercentage = 18;
      const gstAmount = (mainprice * gstPercentage) / 100;
      const totalPrice = mainprice + gstAmount;
      
      await this.initiatePhonePePayment(totalPrice, '9265249451');
    } catch (error) {
      console.error('Payment initiation failed:', error);
      // Handle error appropriately
    }
  }

  async initiatePhonePePayment(amount: number, mobileNumber: string): Promise<void> {
    try {
      const transactionId = `TXN${Date.now()}`;
      const merchantTransactionId = `MT${Date.now()}`;

      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: `MUID${Date.now()}`,
        amount: amount * 100, // Convert to paise
        redirectUrl: `${window.location.origin}/payment-success`,
        redirectMode: 'POST',
        callbackUrl: `${window.location.origin}/payment-callback`,
        mobileNumber: mobileNumber,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      // Generate base64 encoded payload
      const base64Payload = btoa(JSON.stringify(payload));
      
      // Generate checksum
      const checksum = await this.generateChecksum(base64Payload);

      const requestData = {
        request: base64Payload,
        checksum: checksum
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'method':'POST',
      });

      // Make the API call
      const response = await firstValueFrom(
        this.http.post(this.baseUrl, requestData, { headers })
      );

      // Handle the response
      if (response) {
        // Redirect to PhonePe payment page
        const redirectUrl = (response as any).data.instrumentResponse.redirectInfo.url;
        window.location.href = redirectUrl;
      }

    } catch (error) {
      console.error('PhonePe payment initiation failed:', error);
      throw error;
    }
  }

  private async generateChecksum(payload: string): Promise<string> {
    try {
      // Concatenate payload + saltKey + saltIndex
      const dataToHash = payload + this.saltKey + this.saltIndex;
      
      // Convert string to Uint8Array
      const encoder = new TextEncoder();
      const data = encoder.encode(dataToHash);
      
      // Generate SHA-256 hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => 
        byte.toString(16).padStart(2, '0')
      ).join('');
      
      // Return final checksum with saltIndex
      return `${hashHex}###${this.saltIndex}`;
    } catch (error) {
      console.error('Checksum generation failed:', error);
      throw error;
    }
  }

  getyourplan(){
    const token = localStorage.getItem('tasklogintoken');
       if (token) {
         const headers = new HttpHeaders()
           .set('Authorization', `Bearer ${token}`)
           .set('Accept', 'application/json');
         this.http
           .get(`${this.apiUrl}yourPlan`, { headers })
           .subscribe(
             (PlanDetails: any) => {
               this.calculationData = PlanDetails.data[PlanDetails.data.length - 1];
               this.threeMonthsLater = this.addMonths(this.calculationData.endDate, 3);
               this.sixMonthsLater = this.addMonths(this.calculationData.endDate, 6);
               this.oneYearLater = this.addYears(this.calculationData.endDate, 1);
             },
 
             (error) => {
               console.error('Error loading projects list:', error);
             }
           );
       } else {
        
         console.log('No token found in localStorage.');
       }
 }

 addMonths(date: string, months: number): string {
  const [day, month, year] = date.split('-').map(Number);
  const currentDate = new Date(year, month - 1, day); // JS Date uses 0-based months
  currentDate.setMonth(currentDate.getMonth() + months);
  return this.formatDate(currentDate);
}

addYears(date: string, years: number): string {
  const [day, month, year] = date.split('-').map(Number);
  const currentDate = new Date(year, month - 1, day); // JS Date uses 0-based months
  currentDate.setFullYear(currentDate.getFullYear() + years);
  return this.formatDate(currentDate);
}

formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // JS Date uses 0-based months
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Return in 'DD-MM-YYYY' format
}

openModal() {
  this.calculateCost();
}

closeModal() {
  this.isModalOpen = false;
}

calculateCost() {
const startDate = new Date(this.calculationData.startDate);
const endDate = new Date(this.calculationData.endDate);

this.totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
this.totalCost = this.totalDays * this.calculationData.no_of_employees * this.costPerDay;
}

confirmSubscription() {
alert('Subscription confirmed!');
this.closeModal();
}
  // Your existing date formatting methods remain the same...
}