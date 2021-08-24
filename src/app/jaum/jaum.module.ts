import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JaumPageRoutingModule } from './jaum-routing.module';

import { JaumPage } from './jaum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JaumPageRoutingModule
  ],
  declarations: [JaumPage]
})
export class JaumPageModule {}
