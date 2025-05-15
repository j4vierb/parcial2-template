export class BussinessLogicException extends Error {
  type: BussinessError;
  constructor(message: string, type: number) {
    super(message);
    this.type = type;
  }
}

export enum BussinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST,
}
