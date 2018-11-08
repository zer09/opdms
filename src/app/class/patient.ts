import { Sex } from '../enum/sex.enum';
import { MaritalStatus } from '../enum/marital-status.enum';

export class Patient {
    public title = '';
    public name: {
        first: '',
        last: '',
        middle: '',
        suffix: '',
        nicname: '',
    };

    public birthdate = '';
    public sex: Sex;
    public maritalStatus = MaritalStatus.Single;
    public language = '';
    public religion = '';
    public occupation = '';
    public city = '';
    public address = '';

    public contactMobile = '';
    public contactHome = '';
    public contactEmail = '';
    public contactOffice = '';

    public father = '';
    public mother = '';
    public guardian = '';

    public referredBy = '';
    public allergies = '';

    constructor() { }
}
