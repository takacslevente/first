import { Moment } from 'moment';
import { Sex } from 'app/shared/model/enumerations/sex.model';

export interface IPatient {
  id?: number;
  firstName?: string;
  lastName?: string;
  dob?: Moment;
  sex?: Sex;
}

export class Patient implements IPatient {
  constructor(public id?: number, public firstName?: string, public lastName?: string, public dob?: Moment, public sex?: Sex) {}
}
