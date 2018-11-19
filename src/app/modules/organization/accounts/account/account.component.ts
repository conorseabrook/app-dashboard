import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from 'app/services/accounts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  forms: {
    account?: FormGroup;
    accountPermissions?: FormGroup;
  } = {};
  account;
  address;
  timezones = [];
  error;
  success;

  constructor(
    private accountsService: AccountsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.subs[this.subs.length] = this.route.params.subscribe(async params => {
      this.address = params.address;
      await this.getAccount();
      this.initForms();
      this.timezones = moment.tz.names();
    });
  }

  ngOnDestroy() {
    this.subs.map(sub => sub.unsubscribe());
  }

  initForms() {
    this.forms.account = new FormGroup({
      address: new FormControl({ value: this.account.address, disabled: true }),
      fullName: new FormControl(this.account.fullName),
      email: new FormControl(this.account.email),
      timeZone: new FormControl(this.account.timeZone),
    });

    this.forms.accountPermissions = new FormGroup({
      accessLevel: new FormControl(this.account.accessLevel, [
        Validators.required,
      ]),
      permissions: new FormGroup({
        super_account: new FormControl({ value: null, disabled: true }),
        manage_accounts: new FormControl(null),
        register_accounts: new FormControl(null),
        create_event: new FormControl(null),
        create_asset: new FormControl(null),
      }),
    });
    try {
      this.account.permissions.map(permission =>
        this.forms.accountPermissions
          .get('permissions')
          .get(permission)
          .setValue(true),
      );
    } catch (e) {}
  }

  getAccount() {
    return new Promise((resolve, reject) => {
      this.accountsService.getAccount(this.address).subscribe(
        ({ data }: any) => {
          console.log('[GET] Account: ', data);
          this.account = data;
          resolve();
        },
        error => this.router.navigate(['/organization/accounts']),
      );
    });
  }

  modifyAccount() {
    this.error = false;
    this.success = false;
    const form = this.forms.account;
    const _data = form.value;
    const body = {};

    if (form.invalid) {
      this.error = 'Form is invalid';
    }

    Object.keys(_data).map(property => {
      if (_data[property]) {
        body[property] = _data[property];
      }
    });

    this.accountsService.modifyAccount(this.account.address, body).subscribe(
      ({ data }: any) => {
        console.log('[MODIFY] Account ', data);
        this.getAccount();
      },
      error => {
        console.error('[MODIFY] Account: ', error);
        this.error = 'Account update failed';
      },
    );
  }

  modifyPermissions() {
    this.error = false;
    this.success = false;
    const form = this.forms.accountPermissions;
    const _data = form.value;
    const body = { accessLevel: _data.accessLevel, permissions: [] };

    if (form.invalid) {
      this.error = 'Form is invalid';
    }

    Object.keys(_data.permissions).map(permission => {
      if (_data.permissions[permission]) {
        body.permissions.push(permission);
      }
    });

    this.accountsService.modifyAccount(this.account.address, body).subscribe(
      ({ data }: any) => {
        console.log('[MODIFY] Account ', data);
        this.getAccount();
      },
      error => {
        console.error('[MODIFY] Account: ', error);
        this.error = 'Account update failed';
      },
    );
  }
}