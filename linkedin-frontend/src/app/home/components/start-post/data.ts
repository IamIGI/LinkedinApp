interface optionsInterface {
  option: number;
  icon: string;
  text: string;
  color: string;
}

export const options: optionsInterface[] = [
  { option: 1, icon: 'photo_camera', text: 'Zdjęcie', color: '#378fe9' },
  { option: 2, icon: 'smart_display', text: 'Wideo', color: '#5f9b41' },
  { option: 3, icon: 'event_note', text: 'Wydarzenia', color: '#c37d16' },
  { option: 4, icon: 'edit_note', text: 'Napisz artykuł', color: '#e16745' },
];
