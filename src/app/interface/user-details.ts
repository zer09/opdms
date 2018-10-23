export interface UserDetails {
    name: {
        first: string;
        middle?: string;
        last: string;
        suffix?: string;
    };
    address?: string;
    contact?: string;
    regDate: string;
}
