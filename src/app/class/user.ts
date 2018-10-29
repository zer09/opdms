import { UserType } from '../enum/user/user-type.enum';
import { IUserDetails } from '../interface/iuser-details';

export class User {

    public UUID: string;
    public UUID2: string;
    public privKey: string;
    public pubKey: string;
    public PS: string;
    public PES: string;
    public APS: string;
    public VS: string;
    public PTI: string;
    public signature: string;

    public userDetails: IUserDetails;

    constructor(
        public userType: UserType
    ) { }
}
