export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Categories: undefined;
  Evenements: { categorieId: string; categorieNom: string };
};
