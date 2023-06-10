import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, map, take, tap, Observable } from 'rxjs';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';
import { CreatePost } from '../components/start-post/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postImage$ = new BehaviorSubject<boolean>(false);
  postBody: CreatePost = {
    content: '',
    role: '',
    file: undefined,
  };

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

  isPostImageAdded(): Observable<boolean> {
    return this.postImage$.asObservable();
    // return of(Boolean(this.postBody.file));
  }

  setPostImage(file: File) {
    this.postBody.file = file;
    this.postImage$.next(true);
  }

  setPostBody(body: CreatePost) {
    this.postBody.content = body?.content;
    this.postBody.role = body?.role;
    this.postBody.fileName = body?.fileName;
  }

  clearPostBody() {
    this.postBody = {
      content: '',
      role: '',
      file: undefined,
    };
    this.postImage$.next(false);
  }

  createPost() {
    const body: { content: string; imageName?: string } = {
      content: this.postBody.content,
    };
    if (this.postBody?.fileName) {
      body.imageName = this.postBody.fileName;
    }

    return this.http.post<Post>(this.postURL, body).pipe(
      take(1),
      map((result: Post) => {
        this.clearPostBody();
        return result;
      })
    );
  }

  updatePost(
    postId: number
    // body: { content?: string; fileName?: string; role?: string }
  ) {
    const body: { content: string; imageName?: string } = {
      content: this.postBody.content,
    };
    if (this.postBody?.fileName) {
      body.imageName = this.postBody.fileName;
    }
    console.log(body);
    const modifiedURL = `${this.postURL}/${postId}`;
    return this.http.put(modifiedURL, body, this.httpOptions).pipe(take(1));
  }

  deletePost(postId: number) {
    const modifiedURL = `${this.postURL}/${postId}`;
    return this.http.delete(modifiedURL).pipe(take(1));
  }

  savePostImageTemporary(
    file: File
  ): Observable<{ newFilename?: string; error?: string }> {
    let formData = new FormData();
    formData.append('file', file);

    const modifiedURL = `${this.postURL}/temporary/image`;
    console.log(file.name);
    console.log(modifiedURL);
    return this.http.post(modifiedURL, formData).pipe(take(1));
  }

  clearUserTemporaryStorage(userId: number) {
    const modifiedURL = `${this.postURL}/temporary/image?userId=${userId}`;
    this.http.delete(modifiedURL).pipe(take(1));
  }
}
