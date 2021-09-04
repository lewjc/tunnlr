export type ServiceFunctionDefinitions<T> = {
  [key in keyof T]: ServiceEvents;
};

export type ServiceFunctions<T> = {
  [key in keyof T]: T[key];
};

export type ServiceEvents = {
  send: string;
  response: string;
};
