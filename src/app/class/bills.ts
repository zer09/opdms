export class Bill {

  public bill = '';
  public amount = 0;

  public static unminified(s: string): Bill {
    const p = JSON.parse(s);
    const b = new Bill();

    b.bill = p[0];
    b.amount = p[1];

    return b;
  }

  public static displayFn(bill: Bill): string | undefined {
    return `${bill.bill} (${bill.amount})`;
  }

  public minified(): string {
    const p = {
      0: this.bill,
      1: this.amount,
    };

    return JSON.stringify(p);
  }
}
