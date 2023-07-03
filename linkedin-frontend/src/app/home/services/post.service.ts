import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, map, take, tap, Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ToastrService } from 'ngx-toastr';

export interface CreatePost {
  content: string;
  role?: string;
  fileName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postImage$ = new BehaviorSubject<boolean>(false);
  postBody: CreatePost = {
    content: '',
    role: '',
    fileName: '',
  };

  postURL = `${environment.baseApiUrl}/feed`;
  postURLwithImage = `${environment.baseApiUrl}/feed/image`;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private toastr: ToastrService
  ) {}

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getPostImageName(userId: number, imageName: string): string {
    return `${environment.baseApiUrl}/feed/post/image/${imageName}?userId=${userId}`;
  }

  getSelectedPosts(params: any) {
    const modifiedURL = `${this.postURL}/${params}`;
    return this.http.get<Post[]>(modifiedURL).pipe(
      tap((posts: Post[]) => {
        if (posts.length === 0) {
          throw new Error('Brak postów do załadowania');
        }
      }),
      catchError(
        this.errorHandlerService.handleError<Post[]>('getSelectedPosts', [])
      )
    );
  }

  isPostImageAdded(): Observable<boolean> {
    return this.postImage$.asObservable();
  }

  onImageChange(addImage: boolean) {
    this.postImage$.next(addImage);
  }

  smallImageName(imageName: string): string {
    return `${imageName.split('.')[0]}-small.${imageName.split('.')[1]}`;
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
      fileName: '',
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
        if (result.createdAt) {
          this.toastr.success('Opublikowano Post', 'Sukces');
        }
        this.clearPostBody();
        return result;
      })
    );
  }

  updatePost(postId: number) {
    const body: { content: string; imageName?: string } = {
      content: this.postBody.content,
    };
    if (this.postBody?.fileName) {
      body.imageName = this.postBody.fileName;
    }
    const modifiedURL = `${this.postURL}/${postId}`;
    return this.http.put(modifiedURL, body, this.httpOptions).pipe(take(1));
  }

  deletePost(postId: number) {
    const modifiedURL = `${this.postURL}/${postId}`;
    return this.http.delete(modifiedURL).pipe(take(1));
  }

  deletePostImage(postId: number, imageName: string) {
    const modifiedURL = `${this.postURL}/post/image/${postId ?? 0}`;

    const options = {
      body: { imageName },
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.delete(modifiedURL, options).pipe(take(1));
  }

  savePostImageTemporary(
    file: File
  ): Observable<{ newFilename?: string; error?: string }> {
    let formData = new FormData();
    formData.append('file', file);

    const modifiedURL = `${this.postURL}/temporary/image`;
    return this.http.post(modifiedURL, formData).pipe(take(1));
  }

  clearUserTemporaryStorage(userId: number) {
    const modifiedURL = `${this.postURL}/temporary/image?userId=${userId}`;
    return this.http.delete(modifiedURL).pipe(take(1)).subscribe();
  }
}
