export type ServiceFunctionDefinitions<T> = {
  [key in keyof T]: ServiceFunctionEvents;
};

export type ServiceFunctions<T> = {
  [key in keyof T]: T[key];
};

export type ServiceFunctionEvents = {
  send: string;
  response: string;
};
