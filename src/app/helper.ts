export class Helper {
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

}
