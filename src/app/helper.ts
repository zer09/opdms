export class Helper {
    public static clinicNode: string;

    public static isApp: boolean = (!document.URL.startsWith('http') ||
        document.URL.startsWith('http://localhost:8080'));

    public static get defStore(): string {
        return '18YZR9UJZ2nOYVQQzRR9wjWt9ii';
    }

}
