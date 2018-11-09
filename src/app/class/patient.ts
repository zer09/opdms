import { Sex } from '../enum/sex.enum';
import { MaritalStatus } from '../enum/marital-status.enum';

export class Patient {
    public title = '';
    public name = {
        first: '',
        last: '',
        middle: '',
        suffix: '',
        nickname: '',
    };

    public birthdate = '';
    public sex: Sex;
    public maritalStatus = MaritalStatus.Single;
    public language = '';
    public religion = '';
    public occupation = '';
    public city = '';
    public address = '';

    public contact = {
        mobile: '',
        home: '',
        email: '',
        office: ''
    };

    public father = '';
    public mother = '';
    public guardian = '';

    public referredBy = '';
    public allergies = '';

    constructor() { }
}
