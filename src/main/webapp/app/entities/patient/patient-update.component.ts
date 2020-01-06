import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { IPatient, Patient } from 'app/shared/model/patient.model';
import { PatientService } from './patient.service';

@Component({
  selector: 'jhi-patient-update',
  templateUrl: './patient-update.component.html'
})
export class PatientUpdateComponent implements OnInit {
  isSaving = false;
  dobDp: any;

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    dob: [],
    sex: []
  });

  constructor(protected patientService: PatientService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.updateForm(patient);
    });
  }

  updateForm(patient: IPatient): void {
    this.editForm.patchValue({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dob: patient.dob,
      sex: patient.sex
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patient = this.createFromForm();
    if (patient.id !== undefined) {
      this.subscribeToSaveResponse(this.patientService.update(patient));
    } else {
      this.subscribeToSaveResponse(this.patientService.create(patient));
    }
  }

  private createFromForm(): IPatient {
    return {
      ...new Patient(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      dob: this.editForm.get(['dob'])!.value,
      sex: this.editForm.get(['sex'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatient>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
