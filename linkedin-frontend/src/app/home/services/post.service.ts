import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getSelectedPost(params: any) {
    const modifiedURL = `${environment.baseApiUrl}/feed${params}`;
    return this.http.get<Post[]>(modifiedURL);
  }
}
