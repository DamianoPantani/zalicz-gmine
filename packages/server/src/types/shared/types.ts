export type User = {
  id: number;
  userName: string;
  email: string;
};

export type CheckedGmina = {
  id: number;
  date: string;
};

export type UISession = {
  authToken: string;
  user: User;
  checkedGminas: CheckedGmina[];
};
