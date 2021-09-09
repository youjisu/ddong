import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [MessageService]
})
export class Tab1Page implements OnInit {


  constructor(
    public router: Router,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    // this.addSingle();
    this.showSuccess();
  }

  showSuccess() {
    this.messageService.add({ severity: 'info', summary: '응애응애', detail: '원신짱!' });
  }

  addSingle() {
    // this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }
}
