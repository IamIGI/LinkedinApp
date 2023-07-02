export interface NotificationData {
  pageType: string;
  title: string;
  message: string;
  params: {
    positionClass: string;
    timeOut: number;
  };
}

export const newUser = {
  homePage: {
    pageType: 'firstTimeHomePage',
    title: '',
    message: 'Kliknij na zdjęcie aby zaktualizować',
    params: {
      positionClass: 'toast-top-left',
      timeOut: 5000,
    },
  },
  accountPage: {
    pageType: 'firstTimeAccountPage',
    title: '',
    message:
      'Aktualizuj swoje dane, pozwoli Ci to w szybszy sposób zwiększyć twoją sieć kontaktów',
    params: {
      positionClass: 'toast-top-center',
      timeOut: 5000,
    },
  },
  networkPage: {
    pageType: 'firstTimeNetworkPage',
    title: '',
    message:
      'Poszerzaj listę swoich kontaktów. Sprawdzaj kto chce nawiązać z tobą kontakt',
    params: {
      positionClass: 'toast-top-center',
      timeOut: 5000,
    },
  },
  statisticsPage: {
    pageType: 'firstTimeStatisticsPage',
    title: '',
    message: 'Sprwadzaj statystyki swojego konta',
    params: {
      positionClass: 'toast-top-center',
      timeOut: 5000,
    },
  },
};
