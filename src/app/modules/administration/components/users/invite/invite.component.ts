import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'app/services/storage.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  inviteForm: FormGroup;
  spinner = false;
  error;
  success;
  message = false;

  constructor(private http: HttpClient, private storage: StorageService) {
    this.initInviteForm();
  }

  initInviteForm() {
    this.inviteForm = new FormGroup({
      members: new FormArray([
        new FormGroup({
          email: new FormControl('', [Validators.required]),
          accessLevel: new FormControl(1, []),
          permissions: new FormControl('create_entity', [])
        }),
        new FormGroup({
          email: new FormControl('', [Validators.required]),
          accessLevel: new FormControl(1, []),
          permissions: new FormControl('create_entity', [])
        })
      ]),
      message: new FormControl('', [])
    });
  }

  ngOnInit() {
  }

  // Methods for adding/removing new fields to the form
  remove(array, index: number) {
    (<FormArray>this.inviteForm.get(array)).removeAt(index);
  }

  addMember() {
    (<FormArray>this.inviteForm.get('members')).push(
      new FormGroup({
        email: new FormControl('', [Validators.required]),
        accessLevel: new FormControl(1, []),
        permissions: new FormControl('create_entity', [])
      })
    );
  }

  errorsResetInvite() {
    this.error = false;
    this.success = false;
  }

  invite() {
    this.errorsResetInvite();
    const body = {
      invites: this.generateInviteObject(),
      user: this.storage.get('user')
    };

    if (this.inviteForm.valid && body.invites.length > 0) {
      this.spinner = true;
      console.log(this.generateInviteObject());

      // Send invites
      const url = `/api/invites`;

      this.http.post(url, body).subscribe(
        (resp: any) => {
          this.spinner = false;
          this.success = 'Invites sent';
        },
        err => {
          console.log('Invites error: ', err);
          this.error = 'Invites failed';
        }
      );
    } else {
      this.error = 'Need at least one invite';
    }
  }

  generateInviteObject() {
    const message = this.inviteForm.get('message').value;
    const invites = [];

    // Invitees
    const members = this.inviteForm.get('members')['controls'];
    if (members.length > 0) {
      members.map((member) => {
        const permissions = member.get('permissions').value.split(',');

        invites.push({
          to: member.get('email').value,
          accessLevel: member.get('accessLevel').value,
          permissions,
          message
        });
      });
    }

    return invites;
  }
}
