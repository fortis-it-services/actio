import {Pipe, PipeTransform} from '@angular/core';
import {BehaviorSubject, interval, map, Observable} from 'rxjs';

@Pipe({
  name: 'timeElapsed',
})
export class TimeElapsedPipe implements PipeTransform {

  currentDate$ = new BehaviorSubject<Date>(new Date());

  constructor() {
    interval(1000).subscribe({
      next: _ => this.currentDate$.next(new Date()),
    });
  }

  transform(date: Date): Observable<string> {
    return this.currentDate$.pipe(
      map(currentDate => date ? this.calculateElapsedTime(new Date(date), currentDate) : ''),
    )
  }

  calculateElapsedTime(start: Date, end: Date): string {

    let timeDiff = end.getTime() - start.getTime();
    timeDiff = timeDiff / 1000;
    const seconds = Math.floor(timeDiff % 60);
    timeDiff = timeDiff / 60;
    const minutes = Math.floor(timeDiff % 60);
    timeDiff = timeDiff / 60;
    const hours = Math.floor(timeDiff % 24);
    timeDiff = timeDiff / 24;
    const days = Math.floor(timeDiff);
    const totalHours = hours + (days * 24);

    const secondsAsString = seconds.toString().padStart(2, '0');
    const minutesAsString = minutes.toString().padStart(2, '0');
    const totalHoursAsString = totalHours.toString().padStart(2, '0');

    if (totalHours === 0) {
      if (minutes === 0) {
        return `${secondsAsString} second(s)`;
      } else {
        return `${minutesAsString}:${secondsAsString}`;
      }
    } else {
      return `${totalHoursAsString}:${minutesAsString}:${secondsAsString}`;
    }
  }
}
