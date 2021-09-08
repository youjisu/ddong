
import { NgModule } from '@angular/core';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import {DockModule} from 'primeng/dock';

@NgModule({
  imports: [
    RippleModule,
    ButtonModule,
    DividerModule,
    CardModule,
    FieldsetModule,
    AvatarModule,
    AvatarGroupModule,
    DockModule
  ],
  exports: [
    RippleModule,
    ButtonModule,
    DividerModule,
    CardModule,
    FieldsetModule,
    AvatarModule,
    AvatarGroupModule,
    DockModule
  ],
})
export class PrimeNGModule { }
