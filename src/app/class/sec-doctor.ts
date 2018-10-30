import { IUserDetails } from '../interface/iuser-details';

export class SecDoctor {
    // doctor shared enc key.
    public UUID2: string;
    public PS: string;
    public PES: string;
    public APS: string;
    public PTI: string;
    public signature: string;
    public userDetails: IUserDetails;

    constructor() { }

    public static parse(secDoctorSTR: string): SecDoctor {
        const p = JSON.parse(secDoctorSTR);
        const secDr = new SecDoctor();
        secDr.signature = p.signature;
        secDr.UUID2 = p.UUID2;
        secDr.PS = p.PS;
        secDr.PES = p.PES;
        secDr.APS = p.APS;
        secDr.PTI = p.PTI;
        secDr.userDetails = p.userDetails;

        return secDr;
    }

    public stringify(): string {
        return JSON.stringify(this);
    }

}
