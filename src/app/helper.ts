export class Helper {

    public static isApp: boolean = (!document.URL.startsWith('http') ||
        document.URL.startsWith('http://localhost:8080'));

}
