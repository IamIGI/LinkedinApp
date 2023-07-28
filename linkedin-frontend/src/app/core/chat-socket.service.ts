import { Injectable } from '@angular/core';
import { SocketIoConfig, Socket } from 'ngx-socket-io';
import localStorageKeys from 'src/dictionaries/localStorage-dict';

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: localStorage.getItem(localStorageKeys.jwtToken),
        },
      },
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService extends Socket {
  constructor() {
    super(config);
  }
}
