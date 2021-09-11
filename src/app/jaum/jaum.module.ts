import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { JaumPageRoutingModule } from './jaum-routing.module';
import { JaumPage } from './jaum.page';
import { PrimeNGModule } from '../primeng.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JaumPageRoutingModule,
    PrimeNGModule
  ],
  declarations: [JaumPage]
})
export class JaumPageModule {}
