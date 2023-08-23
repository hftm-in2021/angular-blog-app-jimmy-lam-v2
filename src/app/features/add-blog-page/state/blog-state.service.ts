import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  BlogBackendService,
  CreatedBlog,
} from 'src/app/core/blog-backend.service';
import { LoadingStateService } from 'src/app/core/loading-state.service';

type BlogState = {
  error?: string;
};

@Injectable({
  providedIn: 'root',
})
export class BlogStateService {
  // # -> private
  #state = new BehaviorSubject<BlogState>({ error: undefined });
  // State as Observable -> Read only
  state$ = this.#state.asObservable();

  constructor(
    private blogService: BlogBackendService,
    private router: Router,
    private loadingState: LoadingStateService
  ) {}

  async addBlog(blog: CreatedBlog) {
    this.#state.next({ error: undefined });
    this.loadingState.setLoadingState(true);

    try {
      console.log('Adding blog:', blog);
      await this.blogService.addBlog(blog);
      console.log('Blog added successfully');
      this.router.navigate(['/overview']);
    } catch (error) {
      console.error('Error adding blog:', error);
      this.#state.next({
        error: (error as Error).message,
      });
    } finally {
      this.loadingState.setLoadingState(false);
      console.log(this.loadingState.state$.pipe());
    }
  }
}
