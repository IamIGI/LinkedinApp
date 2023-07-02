import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StatisticsService } from './services/statistics.service';
import { FriendRequest } from '../home/models/FriendRequest';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { User } from '../auth/models/user.model';
import { NotificationsService } from '../notifications/services/notifications.service';

interface ViewFriendsStatistic {
  id: number;
  status: string;
  sendedDate: Date;
  repliedDate: Date;
  creator: string;
  receiver: string;
  creatorId: number;
  receiverId: number;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.sass'],
})
export class StatisticsComponent implements OnInit {
  statisticsData = new MatTableDataSource<ViewFriendsStatistic>();
  displayedColumns: string[] = [
    'id', // name there and in the html and in the passed object to table have to be the same. Otherwise sort option won't work
    'status',
    'creator',
    'receiver',
    'sendedDate',
    'repliedDate',
  ];
  sort: any;
  paginator: any;

  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    mp: MatPaginator
  ) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private router: Router,
    private statisticsService: StatisticsService,
    private authService: AuthService,
    private paginatorIntl: MatPaginatorIntl,
    private notificationService: NotificationsService
  ) {
    this.paginatorIntl.itemsPerPageLabel = 'Liczba rekordów';
    this.paginatorIntl.firstPageLabel = 'Pierwsza';
    this.paginatorIntl.lastPageLabel = 'Ostatnia';
    this.paginatorIntl.nextPageLabel = 'Następna';
    this.paginatorIntl.previousPageLabel = 'Poprzednia';
  }

  ngOnInit(): void {
    this.statisticsService
      .getFriendsData()
      .subscribe((data: FriendRequest[]) => {
        this.statisticsData.data = this.createViewFriendStatisticsData(data);
      });

    this.notificationService
      .checkNotificationsStatus('statistics')
      .pipe(take(1))
      .subscribe();
  }

  setDataSourceAttributes() {
    this.statisticsData.paginator = this.paginator;
    this.statisticsData.sort = this.sort;
  }

  doFilter(filterValue: string) {
    this.statisticsData.filter = filterValue.trim().toLowerCase();
  }

  navigateToUser(data: ViewFriendsStatistic) {
    this.authService.userId
      .pipe(
        map((authenticatedUserId: number) => {
          console.log(authenticatedUserId);
          if (data.creatorId === authenticatedUserId) {
            this.router.navigate(['home', 'account', data.receiverId]);
          } else {
            this.router.navigate(['home', 'account', data.creatorId]);
          }
        })
      )
      .subscribe();
  }

  createViewFriendStatisticsData(
    data: FriendRequest[]
  ): ViewFriendsStatistic[] {
    let modifiedArray: ViewFriendsStatistic[] = [];
    for (let i = 0; i < data.length; i++) {
      const record: ViewFriendsStatistic = {
        id: data[i].id,
        status: data[i].status,
        sendedDate: data[i].sendedDate,
        repliedDate: data[i].repliedDate,
        creator: this.getUserName(data[i].creator),
        receiver: this.getUserName(data[i].receiver),
        creatorId: data[i].creator.id,
        receiverId: data[i].receiver.id,
      };
      modifiedArray.push(record);
    }

    return modifiedArray;
  }

  getUserName(user: User) {
    const { isPrivateAccount, firstName, lastName } = user;
    if (isPrivateAccount) return `${firstName} ${lastName}`;
    return `${firstName}`;
  }
}
