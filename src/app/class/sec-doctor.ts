import { UserDetails } from '../interface/user-details';
import { User } from './user';
import { UserType } from '../enum/user/user-type.enum';

export class SecDoctor {
  private static _default: SecDoctor = new SecDoctor();

  // doctor shared enc key.
  public UUID2!: string;
  public PS!: string;
  public PES!: string;
  public APS!: string;
  public VS!: string;
  public PTI!: string;
  public signature!: string;
  public userDetails: UserDetails;


  constructor() {
    this.userDetails = {
      name: {
        first: '',
        last: 'Default',
      }
    };
  }

  public static get Default(): SecDoctor {
    return SecDoctor._default;
  }

  public static parse(secDoctorSTR: string): SecDoctor {
    const p = JSON.parse(secDoctorSTR);
    const secDr = new SecDoctor();
    secDr.signature = p.signature;
    secDr.UUID2 = p.UUID2;
    secDr.PS = p.PS;
    secDr.PES = p.PES;
    secDr.APS = p.APS;
    secDr.VS = p.VS;
    secDr.PTI = p.PTI;
    secDr.userDetails = p.userDetails;

    return secDr;
  }

  public static UserToDr(usr: User): SecDoctor | undefined {
    if (usr.userType !== UserType.DOCTOR) {
      return undefined;
    }

    const secDr = new SecDoctor();
    secDr.signature = usr.signature;
    secDr.UUID2 = usr.UUID2;
    secDr.PS = usr.PS;
    secDr.PES = usr.PES;
    secDr.APS = usr.APS;
    secDr.VS = usr.VS;
    secDr.PTI = usr.PTI;
    secDr.userDetails = usr.userDetails;

    return secDr;
  }

  public toString(): string {
    return [
      'Dr.',
      this.userDetails.name.first,
      this.userDetails.name.last
    ].join(' ');
  }

  public stringify(): string {
    return JSON.stringify(this);
  }

}
