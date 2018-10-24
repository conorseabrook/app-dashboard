import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2, Input } from '@angular/core';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventAddComponent implements OnInit {
  json;

  @Input() assetIds: String[] = [];
  @Input() isDialog;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() { }

  tabOpen(open, element) {
    this.json = open === 'form' ? false : true;
    const tabHeaderItems = this.el.nativeElement.querySelectorAll('.tab_header_item');
    for (const item of tabHeaderItems) {
      this.renderer.removeClass(item, 'active');
    }
    this.renderer.addClass(element, 'active');
  }
}
