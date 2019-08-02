import { Comments } from './Model/comments';
import { UserService } from './user.service';
import { Component, OnDestroy, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { timer, of, forkJoin, Observable, Subject, interval, concat, from, fromEvent } from 'rxjs';
import { switchMap, takeUntil, catchError, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { filter, map, flatMap } from 'rxjs/operators';
import { Post } from './Model/post';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
  title = 'angularrxjs';
  items: {};
  post: Post;
  public searchTerm: string;

  constructor(private UserService: UserService, private formBuilder: FormBuilder) {


  }

  ngOnInit() {
    this.searchBook()
  }

  postId = new FormControl();
  bookForm: FormGroup = this.formBuilder.group({
    postId: this.postId
  });

  public searchBook() {
    this.postId.valueChanges.pipe(
      debounceTime(500),
      switchMap(id => {
        console.log(id);
        return this.UserService.getpost(id);
      })
    ).subscribe(res =>  console.log(res) );
  }

  public test() {
    interval(1000)
      .pipe(
        flatMap(() => this.UserService.getPosts())
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

  public SwitchMap() {
    this.UserService.getPosts().pipe(
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


  public Concat() {
    const commentsobs: Observable<Comments[]> = this.UserService.comments();
    const postsobs: Observable<Post[]> = this.UserService.getPosts();
    const joined = concat(commentsobs, postsobs);
    joined.subscribe(res => console.log('joined dta', res));
  }


  public Forkjoin() {
    const commentsobs: Observable<Comments[]> = this.UserService.comments();
    const postsobs: Observable<Post[]> = this.UserService.getPosts();
    const joined = forkJoin(commentsobs, postsobs);
    joined.subscribe(res => console.log('joined dta', res));
  }

  /**
   * obs
   */
  public obs() {
    const secondsCounter = interval(1000);
    // Subscribe to begin publishing values
    secondsCounter.subscribe(n =>
      console.log(`It's been ${n} seconds since subscribing!`));

  }

  // search = (text$: Observable<string>) : Observable<Comments[]> {
  // return text$.pipe(
  //   switchMap(searchTerm =>{
  //     if(!searchTerm){
  //       return [];
  //     }
  //     return this.UserService.comments(searchTerm);
  //   })
  // )
  // }

}
