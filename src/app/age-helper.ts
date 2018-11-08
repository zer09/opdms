import moment from 'moment';
import { Patient } from './class/patient';

export class AgeHelper {

    public static longAgeString(pt: Patient): string {
        const now: moment.Moment = moment();
        const bd: moment.Moment = moment(pt.birthdate);
        const dif: number = now.diff(bd);
        const period: moment.Duration = moment.duration(dif);
        let st = '';

        const bdv: any = {
            y: period.years(),
            m: period.months(),
            d: period.days()
        };

        if (bdv.y > 0) {
            st += bdv.y > 1 ? bdv.y + ' Years ' : bdv.y + ' Year ';
        }

        if (bdv.m > 0) {
            st += bdv.m > 1 ? bdv.m + ' Months ' : bdv.m + ' Month ';
        }

        if (bdv.d > 0) {
            st += bdv.d > 1 ? bdv.d + ' Days ' : bdv.d + ' Day ';
        }

        return st.trim();
    }

    public shortAgeString(pt: Patient): string {
        const now: moment.Moment = moment();
        const bd: moment.Moment = moment(pt.birthdate);
        const dif: number = now.diff(bd);
        const period: moment.Duration = moment.duration(dif);

        const bdv: any = {
            y: period.years(),
            m: period.months(),
            d: period.days()
        };

        if (bdv.y > 1) {
            return bdv.y + ' y/o';
        } else if (bdv.year === 1 && bdv.m === 0) {
            return '1 y/o';
        } else if (bdv.y === 1 && bdv.m > 0) {
            return bdv.y + ' yr. & ' + bdv.m + ' m/o';
        } else {
            let st = '';
            if (bdv.m > 0) {
                st += bdv.m > 1 ? bdv.m + ' mos. ' : bdv.m + ' mo. ';
                if (bdv.d > 0) {
                    st += ' & ';
                }
            }

            if (bdv.d > 0) {
                st += bdv.d > 1 ? bdv.d + ' days ' : bdv.d + ' day ';
            }

            st += 'old';
            return st;
        }
    }

    public singleAgeString(pt: Patient): string {
        const now: moment.Moment = moment();
        const bd: moment.Moment = moment(pt.birthdate);
        const dif: number = now.diff(bd);
        const period: moment.Duration = moment.duration(dif);

        const bdv: any = {
            y: period.years(),
            m: period.months(),
            d: period.days()
        };

        if (bdv.y >= 1) {
            return bdv.y += ' y/o';
        }

        if (bdv.m >= 1) {
            return bdv.m += ' mo/o';
        }

        return bdv.d + ' day/o';
    }

}
