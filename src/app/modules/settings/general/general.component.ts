import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from 'app/services/storage.service';
import * as moment from 'moment-timezone';
import { AccountsService } from 'app/services/accounts.service';

declare let Web3: any;

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  editAccountForm: FormGroup;
  error;
  success;
  spinner = false;
  account;
  timezones = [];
  web3;

  constructor(
    private storageService: StorageService,
    private accountsService: AccountsService,
  ) {
    this.web3 = new Web3();
  }

  ngOnInit() {
    this.account = this.storageService.get('account') || {};

    this.editAccountForm = new FormGroup({
      address: new FormControl(
        { value: this.account.address, disabled: true },
        [Validators.required],
      ),
      fullName: new FormControl(this.account.fullName, []),
      email: new FormControl(this.account.email, []),
      timeZone: new FormControl(this.account.timeZone, []),
      password: new FormControl('', []),
      passwordConfirm: new FormControl('', [this.comparePasswords]),
    });

    this.timezones = moment.tz.names();
  }

  comparePasswords(control: FormControl) {
    try {
      const data = this.editAccountForm.value;
      if (!data.password) {
        return null;
      }

      return control.value === data.password
        ? null
        : { 'Passwords do not match': true };
    } catch (e) {
      return null;
    }
  }

  editAccount() {
    this.error = false;
    this.success = false;
    const form = this.editAccountForm;
    const _data = form.value;
    const secret = this.storageService.get('secret');
    const body = {};

    if (form.invalid) {
      return (this.error = 'Form is invalid');
    }

    Object.keys(_data).map(property => {
      if (_data[property]) {
        body[property] = _data[property];
      }
    });

    if (_data.password) {
      body['token'] = btoa(
        JSON.stringify(this.web3.eth.accounts.encrypt(secret, _data.password)),
      );
    }

    this.accountsService.modifyAccount(this.account.address, body).subscribe(
      ({ data }: any) => {
        this.success = 'Updated';
        this.storageService.set('account', data);
        this.accountsService._account.next(data);
      },
      error => {
        console.error('[MODIFY] Account: ', error);
        this.error = error ? error.message : 'Edit account error';
      },
    );
  }
}