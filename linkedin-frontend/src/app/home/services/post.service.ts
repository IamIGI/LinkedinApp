import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getSelectedPost(params: any) {
    return this.http.get<Post[]>(URL + '/feed' + params);
  }
}
