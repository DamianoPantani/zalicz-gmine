export type User = {
  id: number;
  userName: string;
  email: string;
};

export type CheckedGmina = {
  id: number;
  date: string;
};

export type Session = {
  authToken: string;
  user: User;
  checkedGminas: CheckedGmina[];
};
