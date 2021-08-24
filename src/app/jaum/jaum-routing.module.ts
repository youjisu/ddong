import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JaumPage } from './jaum.page';

const routes: Routes = [
  {
    path: '',
    component: JaumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JaumPageRoutingModule {}
