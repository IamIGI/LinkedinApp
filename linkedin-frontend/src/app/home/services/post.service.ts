import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from 'src/environments/environment.development';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  postURL = `${environment.baseApiUrl}/feed`;
  constructor(private http: HttpClient) {}

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getSelectedPost(params: any) {
    const modifiedURL = `${this.postURL}/${params}`;
    return this.http.get<Post[]>(modifiedURL);
  }

  createPost(content: string) {
    return this.http
      .post<Post>(this.postURL, { content }, this.httpOptions)
      .pipe(take(1));
  }

  updatePost(postId: number, content: string) {
    const modifiedURL = `${this.postURL}/${postId}`;
    return this.http
      .put(modifiedURL, { content }, this.httpOptions)
      .pipe(take(1));
  }

  deletePost(postId: number) {
    const modifiedURL = `${this.postURL}/${postId}`;
    return this.http.delete(modifiedURL).pipe(take(1));
  }
}
