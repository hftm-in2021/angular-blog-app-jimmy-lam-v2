import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

import { z } from 'zod';
import { Observable, map } from 'rxjs';

const BlogSchema = z.object({
  id: z.number(),
  title: z.string(),
  contentPreview: z.string(),
  author: z.string(),
  likes: z.number(),
  comments: z.number(),
  likedByMe: z.boolean(),
  createdByMe: z.boolean(),
});

const BlogArraySchema = z.array(BlogSchema);

export type Blog = z.infer<typeof BlogSchema>;

const CreatedBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreatedBlog = z.infer<typeof CreatedBlogSchema>;

@Injectable({
  providedIn: 'root',
})
export class BlogBackendService {
  constructor(private httpClient: HttpClient) {}

  getBlogPosts(): Observable<Blog[]> {
    return this.httpClient
      .get<Blog[]>(`${environment.serviceUrl}/entries`)
      .pipe(map((blogs) => BlogArraySchema.parse(blogs)));
  }

  addBlog(blog: CreatedBlog) {
    CreatedBlogSchema.parse(blog);
    console.log('POST REQUEST ' + blog.content + blog.title);
    return this.httpClient
      .post<void>(`${environment.serviceUrl}/entries`, blog)
      .subscribe(
        () => console.log('Blog added successfully'),
        (error) => console.error('Error adding blog:', error)
      );
  }
}
