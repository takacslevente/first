import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPatient } from 'app/shared/model/patient.model';

type EntityResponseType = HttpResponse<IPatient>;
type EntityArrayResponseType = HttpResponse<IPatient[]>;

@Injectable({ providedIn: 'root' })
export class PatientService {
  public resourceUrl = SERVER_API_URL + 'api/patients';

  constructor(protected http: HttpClient) {}

  create(patient: IPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(patient);
    return this.http
      .post<IPatient>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(patient: IPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(patient);
    return this.http
      .put<IPatient>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPatient>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPatient[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(patient: IPatient): IPatient {
    const copy: IPatient = Object.assign({}, patient, {
      dob: patient.dob && patient.dob.isValid() ? patient.dob.format(DATE_FORMAT) : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dob = res.body.dob ? moment(res.body.dob) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((patient: IPatient) => {
        patient.dob = patient.dob ? moment(patient.dob) : undefined;
      });
    }
    return res;
  }
}
