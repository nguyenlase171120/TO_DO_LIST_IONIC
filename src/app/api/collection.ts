export type TaskItemTypes = {
  Id?: string;
  Title: string;
  Description: string;
  Order: number;
  IsDone: boolean;
};

export type ErrorResponseTypes = {
  error: {
    title: string;
    detail: string;
    traceId: string;
    status: number;
  };
};
