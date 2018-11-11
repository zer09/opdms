import { ULID, monotonicFactory } from 'ulid';
export class Helper {

  private static _ulid: ULID = monotonicFactory();

  public static get ulidString(): string {
    return this._ulid();
  }

  public static clinicNode: string;

  public static isApp: boolean = (!document.URL.startsWith('http') ||
    document.URL.startsWith('http://localhost:8080'));

  public static get defStore(): string {
    return '18YZR9UJZ2nOYVQQzRR9wjWt9ii';
  }

  public static get strDefNode(): string {
    return 'usr:clinic:node';
  }

  public static get strUsrSesChg(): string {
    return 'usr:ses:chg';
  }

  public static toLocaleTimeString(date: Date | string): string {
    return date instanceof Date ? date.toLocaleTimeString('en-US') :
      new Date(date).toLocaleTimeString('en-US');
  }

  // https://www.rosettacode.org/wiki/Remove_duplicate_elements#JavaScript
  public static unique(arr: any) {
    const u = arr.concat().sort();
    for (let i = 1; i < u.length;) {
      if (u[i - 1] === u[i]) {
        u.splice(i, 1);
      } else {
        i++;
      }
    }

    return u;
  }

}
