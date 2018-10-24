import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { StorageService } from 'app/services/storage.service';
import { AssetsService } from 'app/services/assets.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit, OnDestroy {
  createEventsSub: Subscription;
  eventForm: FormGroup;
  error;
  success;
  spinner;
  identifiersAutocomplete = ['UPCE', 'UPC12', 'EAN8', 'EAN13', 'CODE 39', 'CODE 128', 'ITF', 'QR', 'DATAMATRIX', 'RFID', 'NFC',
    'GTIN', 'GLN', 'SSCC', 'GSIN', 'GINC', 'GRAI', 'GIAI', 'GSRN', 'GDTI', 'GCN', 'CPID', 'GMN'];

  @Input() assetIds: String[];

  isObject(value) { return typeof value === 'object'; }

  constructor(
    private storageService: StorageService,
    private assetsService: AssetsService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    if (this.createEventsSub) { this.createEventsSub.unsubscribe(); }
  }

  private initForm() {
    this.eventForm = new FormGroup({
      type: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      accessLevel: new FormControl(0, []),
      documents: new FormArray([
        new FormGroup({
          name: new FormControl(null, []),
          url: new FormControl(null, []),
        }),
      ]),
      identifiers: new FormArray([
        new FormGroup({
          name: new FormControl(null, []),
          value: new FormControl(null, []),
        }),
      ]),
      properties: new FormArray([
        new FormGroup({
          name: new FormControl(null, []),
          value: new FormControl(null, []),
        }),
      ]),
      groups: new FormArray([
        new FormGroup({
          title: new FormControl(null, []),
          content: new FormArray([
            new FormGroup({
              name: new FormControl(null, []),
              value: new FormControl(null, []),
            }),
          ]),
        }),
      ]),
      location: new FormGroup({
        lat: new FormControl(null, []),
        lng: new FormControl(null, []),
        name: new FormControl(null, []),
        city: new FormControl(null, []),
        country: new FormControl(null, []),
        locationId: new FormControl(null, []),
        GLN: new FormControl(null, []),
      }),
    });
  }

  // Methods for adding/removing new fields to the form

  remove(array, index: number) { (<FormArray>this.eventForm.get(array)).removeAt(index); }

  addDocument() {
    (<FormArray>this.eventForm.get('documents')).push(
      new FormGroup({
        name: new FormControl(null, []),
        url: new FormControl(null, []),
      })
    );
  }

  addIdentifier() {
    (<FormArray>this.eventForm.get('identifiers')).push(
      new FormGroup({
        name: new FormControl(null, []),
        value: new FormControl(null, []),
      })
    );
  }

  addProperty() {
    (<FormArray>this.eventForm.get('properties')).push(
      new FormGroup({
        name: new FormControl(null, []),
        value: new FormControl(null, []),
      })
    );
  }

  addGroup() {
    (<FormArray>this.eventForm.get('groups')).push(
      new FormGroup({
        title: new FormControl(null, []),
        content: new FormArray([
          new FormGroup({
            name: new FormControl(null, []),
            value: new FormControl(null, []),
          }),
        ]),
      })
    );
  }

  addGroupProperty(i) {
    const groups = <FormArray>this.eventForm.get('groups');
    (<FormArray>groups.at(i).get('content')).push(
      new FormGroup({
        name: new FormControl(null, []),
        value: new FormControl(null, []),
      })
    );
  }

  removeGroupProperty(i, j) {
    const groups = <FormArray>this.eventForm.get('groups');
    (<FormArray>groups.at(i).get('content')).removeAt(j);
  }

  private generateEvent(assetId) {
    const address = this.storageService.get('user')['address'];
    const secret = this.storageService.get('secret');
    const eventForm = this.eventForm.getRawValue();

    const data = [];

    // Identifiers object
    const ide = eventForm.identifiers;
    if (ide.length > 0) {
      const identifiers = {};
      identifiers['type'] = 'ambrosus.event.identifiers';
      identifiers['identifiers'] = {};
      ide.map(item => {
        if (item.name && item.value) {
          identifiers['identifiers'][item.name] = [];
          identifiers['identifiers'][item.name].push(item.value);
        }
      });

      if (Object.keys(identifiers['identifiers']).length) { data.push(identifiers); }
    }

    // Information
    const info = {};

    info['type'] = eventForm.type;
    info['name'] = eventForm.name;
    const description = eventForm.description;
    if (description) { info['description'] = description; }

    // Documents
    const documents = eventForm.documents;
    if (documents.length > 0) {
      const _documents = {};
      documents.map((document, index, array) => {
        if (document.name && document.url) {
          _documents[document.name] = {};
          _documents[document.name]['url'] = document.url;
        }
      });

      if (Object.keys(_documents).length) { info['documents'] = _documents; }
    }

    // Properties
    eventForm.properties.map(item => {
      if (item.name && item.value) {
        info[item.name] = item.value;
      }
    });

    // Groups
    const groups = eventForm.groups;
    groups.map(group => {
      if (group.title && group.content.length) {
        const _group = {};
        group.content.map(property => {
          if (property.name && property.value) {
            _group[property.name] = property.value;
          }
        });
        if (Object.keys(_group).length) { info[group.title] = _group; }
      }
    });

    data.push(info);

    // Location Event
    const location = eventForm.location;
    const { lat, lng, name, city, country, locationId, GLN } = location;

    if ((lat || lat === 0) && (lng || lng === 0) && name && city && country && locationId && GLN) {
      const _location = {
        type: 'ambrosus.event.location',
        location: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lat, lng],
          },
        },
        name,
        city,
        country,
        locationId,
        GLN,
      };

      data.push(_location);
    }

    // Finish signing event

    const idData = {
      assetId,
      timestamp: Math.floor(new Date().getTime() / 1000),
      accessLevel: eventForm.accessLevel,
      createdBy: address,
      dataHash: this.assetsService.calculateHash(data),
    };

    const content = {
      idData,
      signature: this.assetsService.sign(idData, secret),
      data,
    };

    const event = {
      eventId: this.assetsService.calculateHash(content),
      content,
    };

    return event;
  }

  save() {
    this.error = false;
    this.success = false;

    if (this.eventForm.valid && this.assetIds.length > 0) {
      const eventForm = this.eventForm.getRawValue();

      // Location Event
      const location = eventForm.location;
      const { lat, lng, name, city, country, locationId, GLN } = location;

      if ((lat || lat === 0) || (lng || lng === 0) || name || city || country || locationId || GLN) {
        if (!((lat || lat === 0) && (lng || lng === 0) && name && city && country && locationId && GLN)) {
          return this.error = 'Event location must either be blank or completely filled';
        }
      }

      // Confirmation window
      if (!confirm(`You are about to create an event for ${this.assetIds.length} asset${this.assetIds.length === 1 ? '' : 's'}, are you sure you want to proceed?`)) { return; }

      this.spinner = true;

      // Make a request
      const events = [];
      this.assetIds.map(assetId => events.push(this.generateEvent(assetId)));
      this.createEventsSub = this.assetsService.createEvents(events).subscribe(
        (resp: any) => {
          this.spinner = false;
          this.success = 'Success';
        },
        err => {
          this.error = err.message;
          this.spinner = false;
          console.error('Events create error: ', err);
        }
      );

    } else if (!this.eventForm.valid) {
      this.error = 'Please fill all required fields';
    } else if (this.assetIds.length === 0) {
      this.error = 'There are no assets selected';
    }
  }
}
