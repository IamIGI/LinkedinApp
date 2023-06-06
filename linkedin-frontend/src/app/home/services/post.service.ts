import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from 'src/environments/environment.development';
import { map, take, tap } from 'rxjs';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  postURL = `${environment.baseApiUrl}/feed`;
  postURLwithImage = `${environment.baseApiUrl}/feed/image`;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService
      .getUserImageName()
      .pipe(
        take(1),
        tap(({ imageName }) => {
          const defaultFullImagePath = 'null';
          this.authService
            .updateUserImagePath(imageName || defaultFullImagePath)
            .subscribe();
        })
      )
      .subscribe();
  }

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getPostImageName(userId: number, imageName: string): string {
    return `${environment.baseApiUrl}/feed/post/image/${imageName}?userId=${userId}`;
  }

  getSelectedPost(params: any) {
    const modifiedURL = `${this.postURL}/${params}`;
    return this.http.get<Post[]>(modifiedURL);
  }

  createPost(formData: FormData) {
    const postWithImage = formData.get('file') instanceof File;
    if (postWithImage) {
      return this.http.post<Post>(this.postURLwithImage, formData).pipe(
        take(1),
        map((result: Post) => {
          return result;
        })
      );
    }
    return this.http.post<Post>(this.postURL, formData).pipe(
      take(1),
      map((result: Post) => {
        return result;
      })
    );
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
