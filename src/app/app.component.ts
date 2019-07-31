import { UserService } from './user.service';
import { Component, OnDestroy, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { timer, of, Observable, Subject, interval } from 'rxjs';
import { switchMap, takeUntil, catchError, tap } from 'rxjs/operators';
import { filter, map, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularrxjs';
  items: {};
  constructor(private UserService: UserService) { }

  ngOnInit() {
    this.tricks();

  }
  public test() {
    interval(1000)
      .pipe(
        flatMap(() => this.UserService.getClients())
      )
      .subscribe(
        data => {
          this.items = data
          console.log(this.items);
        },
        error => {
          console.log('error fetching data')
        }
      )
  }

  rxjs() {

    const squareOf2 = of(1, 2, 3, 4, 5, 6)
      .pipe(
        filter(num => num % 2 === 0),
        map(num => num * num)
      );
    squareOf2.subscribe((num) => console.log(num));
  }

  public tricks() {

    this.UserService.getClients().pipe(
      switchMap(posts => {
        return this.UserService.comments().pipe(
          tap(comments => {
            console.log('posts are', posts)
            console.log('Comments: are', comments)
          })
        )
      })
    )
      .subscribe(
        data => {
          this.items = data
          console.log(this.items);
        },
        error => {
          console.log('error fetching data')
        }
      )
  }

  // public search(text$: Observable<string>): Observable<String[]> {

  // }

}
