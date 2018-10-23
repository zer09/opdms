import { UserType } from '../enum/user/user-type.enum';
import { UserDetails } from '../interface/user-details';

export class User {

    public UUID: string;
    public privKey: string;
    public pubKey: string;
    public PS: string;
    public PES: string;
    public APS: string;
    public VS: string;
    public PTI: string;
    public signature: string;

    public userDetails: UserDetails;

    constructor(
        public userType: UserType
    ) { }
}
