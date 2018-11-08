import { Sex } from '../enum/sex.enum';
import { MaritalStatus } from '../enum/marital-status.enum';

export class Patient {
    public title: string;
    public name: {
        first: string,
        last: string,
        middle: string,
        suffix: string,
        nicname: string,
    };

    public birthdate: string;
    public sex: Sex;
    public maritalStatus: MaritalStatus;
    public language: string;
    public religion: string;
    public occupation: string;
    public city: string;
    public address: string;

    public contactMobile: string;
    public contactHome: string;
    public contactEmail: string;
    public contactOffice: string;

    public father: string;
    public mother: string;
    public guardian: string;

    public referredBy: string;
    public allergies: string;

    constructor() { }
}
