import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  menus: any[] = [];  
  constructor() {}

  ngOnInit() {
    this.menus = [
        {
            label: 'TAB 1',
            url: 'tab1',
            icon: "https://www.primefaces.org/primeng/showcase/assets/showcase/images/dock/finder.svg"
        },
        {
            label: 'TAB 2',
            url: 'tab2',
            icon: "https://www.primefaces.org/primeng/showcase/assets/showcase/images/dock/appstore.svg"
        },
        {
            label: 'TAB 3',
            url: 'tab3',
            icon: "https://www.primefaces.org/primeng/showcase/assets/showcase/images/dock/photos.svg"
        }
    ];
  }  
}