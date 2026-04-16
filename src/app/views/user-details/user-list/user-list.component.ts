import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Input,ChangeDetectorRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { AgGridAngular } from 'ag-grid-angular'; 

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [NgbRatingModule, CalendarModule, MatIconModule, MatFormFieldModule, NgSwitch, NgSwitchCase, FormsModule, CdkDropList, CdkDrag, MatSlideToggleModule, RouterModule, NgFor,MatSelectModule, MatMenuModule,NgIf,AgGridAngular],
})
export class UserListComponent {
  @Input() memberdata: any;
  @Input() rowData: any;
  @Input() rowOverDueData: any; 
  @Input() rowUpcomingData: any; 
  @Input() rowCompletedData: any; 
  @Input() columnDefs: any;
  @Input() defaultColDef: any;  // Input to accept column definitions
  @Input() themeClass: any;     // Input for grid theme class
  @Input() pagination: any;    // Input for pagination toggle
  @Input() paginationPageSize: any;  // Input for pagination page size
  @Input() paginationPageSizeSelector: any; // Input for page size options

  currentRate = 0;

  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  // single date and multiple date  select

  selectOption(option: string, event: Event) {
    event.preventDefault(); // Prevent the default behavior of the dropdown toggle

    // Add your custom logic for handling the selected option here
    console.log(`Selected option: ${option}`);
  }


  checkbox: boolean = false;

  bulkUpload() {
    this.checkbox = true;
  }
  hideBottomaction() {
    this.checkbox = !this.checkbox;
  }


  // priority dropdown

  selectedPriority: { image: string } = { image: '' }; 
  selectPriority(image: string): void {
    this.selectedPriority = { image };
  }

  // priority dropdown

  // status dropdown
  selectedStatus: string = ''; 

  selectStatus(status: string): void {
    this.selectedStatus = status;
  }

  // status dropdown




  data = [];
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }

  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { backdrop: 'static', position: 'end' });
  }

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { ...colors['yellow'] },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...colors['blue'] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...colors['yellow'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private offcanvasService: NgbOffcanvas,private cdr: ChangeDetectorRef) {
   
   }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


  // overview ts start

  title = 'ng-chart';
  chart: any = [];
  chart2:any = [];
  chart3:any = [];
  ngOnChanges(){
      if (this.memberdata) {
        
          this.initializeChart();
          this.performancerelatedchart();
          this.initializeChartanalysis();
      }
  }

  ngOnInit() {
   
    this.selectPriority('../../../assets/img/dashboard/flag-R.svg');
}
  private performancerelatedchart() {
   
    
    const canvas = document.getElementById('performance') as HTMLCanvasElement;
    const context = canvas?.getContext('2d');
  
    // Clear the canvas
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    // Check if there's an existing chart associated with the canvas
    const existingChart = Chart.getChart(canvas);
  
    // If an existing chart is found, destroy it
    if (existingChart) {
      existingChart.destroy();
    }
  
    // Create a new Chart instance
    this.chart = new Chart('performance', {
      type: 'bar',
      data: {
        labels: ['On Track', 'Before Time', 'Delayed'], // Each label corresponds to a separate box
        datasets: [
          {
            label: 'Tasks', // General label for the data
            data: [
              this.memberdata.totalLowPriorityTasks, // Data for 'On Track'
              this.memberdata.totalMediumPriorityTasks, // Data for 'Before Time'
              this.memberdata.totalHighPriorityTasks // Data for 'Delayed'
            ],
            borderWidth: 1,
            backgroundColor: ['#FCA349', '#8BD878', '#FF9292'], // Different colors for each bar
            borderRadius: 5,
            barThickness:20,
          },
        ],
      },
      options: {
        aspectRatio: 3,
        indexAxis: 'x', // Ensure bars are shown horizontally
        responsive: true,
        plugins: {
          legend: {
            onClick: () => {},
            labels: {
              usePointStyle: true,
              boxHeight: 7,
              boxWidth: 7,
              font: {
                size: 12, // Adjust font size
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    
  }
  
  private initializeChart() {
    const canvas = document.getElementById('priority') as HTMLCanvasElement;
    const context = canvas?.getContext('2d');
  
    // Clear the canvas
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    // Check if there's an existing chart associated with the canvas
    const existingChart = Chart.getChart(canvas);
  
    // If an existing chart is found, destroy it
    if (existingChart) {
      existingChart.destroy();
    }
  
    // Create a new Chart instance
    this.chart2 = new Chart('priority', {
      type: 'pie',
      data: {
        labels: ['Low Priority', 'Medium Priority', 'High Priority'],
        datasets: [{
          data: [
            this.memberdata.totalLowPriorityTasks,
            this.memberdata.totalMediumPriorityTasks,
            this.memberdata.totalHighPriorityTasks
          ],
          backgroundColor: [
            '#8BD878',
            '#FCA349',
            '#FF5656'
          ],
          hoverOffset: 4
        }]
      }, options: {
        aspectRatio:3/2,
        responsive: true,
        plugins: {
          legend: {
            position:'left',
            onClick: () => {}, 
            labels: {
              usePointStyle:true,
              boxHeight:7,
              boxWidth:7,
              font: {
                  size: 12 // Change this value to adjust the font size
              }
          },
          },
        },
      },
    });
  }
  
  private initializeChartanalysis() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas?.getContext('2d');
  
    // Clear the canvas
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    // Check if there's an existing chart associated with the canvas
    const existingChart = Chart.getChart(canvas);
  
    // If an existing chart is found, destroy it
    if (existingChart) {
      existingChart.destroy();
    }
  
    this.chart3 = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['Task Status'],

        datasets: [
          {
            label: 'Process Task',
            data: [this.memberdata.totalIncompletedProcessTasks],
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 30,
            maxBarThickness: 50,
            minBarLength: 1,
            backgroundColor: "#8BD878",
            borderRadius: 5,
          },
          {
            label: 'Pending Task',
            data: [this.memberdata.totalIncompletedPendingTasks],
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 30,
            maxBarThickness: 50,
            minBarLength: 1,
            backgroundColor: " #FF9292",
            borderRadius: 5,
          },
        ],
      },
      options: {
        aspectRatio:4,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true,
            stacked: true
          }
        } ,
           responsive: true,
          plugins: {
            legend: {
              onClick: () => {}, 
              labels: {
                usePointStyle:true,
                boxHeight:7,
                boxWidth:7,
                font: {
                    size: 12 // Change this value to adjust the font size
                }
            },
            },
          },
       
      },
    });
  }
  getInitials(name: string): string {
    return name.split(' ').map(name => name.charAt(0)).join('');
    }


}
