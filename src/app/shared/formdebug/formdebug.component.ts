import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-formdebug',
  templateUrl: './formdebug.component.html',
  styleUrls: ['./formdebug.component.scss'],
  standalone: false,
})
export class FormdebugComponent implements OnInit {
  @Input() form;

  constructor() {}

  ngOnInit() {}
}
