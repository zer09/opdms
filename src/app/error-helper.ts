import { PouchError } from './interface/db/pouch-error';

export class ErrorHelper {

  public static get PouchNotFound(): number {
    return 404;
  }

  public static get PouchDuplicate(): number {
    return 409;
  }

  public static IsPouchNotFound(err: PouchError): boolean {
    return err.status === this.PouchNotFound;
  }

  public static IsPouchDuplicate(err: PouchError): boolean {
    return err.status === this.PouchDuplicate;
  }
}
