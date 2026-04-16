import { Injectable, EventEmitter } from '@angular/core';
import { SubmittimeService } from './submittime.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  taskIds: any;
  public startTime: number = 0;
  public elapsedTime: number = 0;
  public paused: boolean = false;
  public intervalId: any = null;
  public idleTimeout: any = null;
  public idleSeconds: number = 0;
  public clock: string = '00:00:00';
  public clocks: string = '00:00:00';
  public idleMessageVisible: boolean = false;
  timerStopped: EventEmitter<void> = new EventEmitter<void>();
  timerStoppedget = new EventEmitter<string>();

  constructor(private submittimeService: SubmittimeService){}

  startTimer() {
    if (this.elapsedTime === 0) {
      this.startTime = Date.now();
    } else {
      this.startTime = Date.now() - this.elapsedTime;
    }

    this.paused = false;
    this.intervalId = setInterval(() => {
      if (!this.paused) {
        this.time();
      }
    }, 1000);

    this.startIdleTimer();
  }

  pauseTimer() {
    clearInterval(this.intervalId);
    this.paused = true;
    this.elapsedTime = Date.now() - this.startTime;
  }

  resumeTimer() {
    if (this.paused) {
      this.startTime = Date.now() - this.elapsedTime;
      this.paused = false;
      this.intervalId = setInterval(() => {
        if (!this.paused) {
          this.time();
        }
      }, 1000);
    }
  }

  stopTimerforcompleted() {
    this.timerStoppedget.emit(this.clock);
    clearInterval(this.intervalId);
    this.paused = true;

    this.elapsedTime = 0;
    this.clock = '00:00:00';
    this.timerStopped.emit(this.intervalId);
}
  stopTimer() {
    clearInterval(this.intervalId);
    this.paused = true;

    this.elapsedTime = 0;
    this.clock = '00:00:00';
    this.timerStopped.emit(this.intervalId);
}
  // submitForms(clocks: any) {
  //   const information = {
  //     stoptime: clocks,
  //     taskids: this.taskIds
  //   };
  //   this.submittimeService.updatetime(information);
  // }

  tasksidss(taskId: any) {
    this.taskIds = taskId;
  }

  time() {
    const currentTime = Date.now();
    let elapsedTime = currentTime - this.startTime;

    let hours: number | string = Math.floor(elapsedTime / 3600000);
    let minutes: number | string = Math.floor((elapsedTime % 3600000) / 60000);
    let seconds: number | string = Math.floor((elapsedTime % 60000) / 1000);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Update the clock property directly
    this.clock = hours + ':' + minutes + ':' + seconds;
  }

  initTimers() {
    this.startTimer();
  }

  startIdleTimer() {
    clearInterval(this.idleTimeout);
    this.idleTimeout = setInterval(() => {
      this.idleSeconds++;
      if (this.idleSeconds >= 180) {
        this.showIdleMessage();
      }
    }, 1000);
  }

  resetIdleTimer() {
    this.idleSeconds = 0;
  }

  showIdleMessage() {
    this.idleMessageVisible = true;
    console.log('You have been idle for 3 minutes. Please resume your work.');
    this.pauseTimer();
    clearInterval(this.idleTimeout);
  }

  onUserInteraction() {
    this.resetIdleTimer();
    if (this.idleMessageVisible) {
      this.hideIdleMessage();
    }
  }

  hideIdleMessage() {
    this.idleMessageVisible = false;
    this.startIdleTimer();
  }
}
