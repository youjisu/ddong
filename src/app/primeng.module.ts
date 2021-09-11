
import { NgModule } from '@angular/core';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DockModule } from 'primeng/dock';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleButtonModule } from 'primeng/togglebutton';

@NgModule({
  imports: [
    RippleModule,
    ButtonModule,
    DividerModule,
    CardModule,
    FieldsetModule,
    AvatarModule,
    AvatarGroupModule,
    DockModule,
    ToastModule,
    BadgeModule,
    TagModule,
    ProgressSpinnerModule,
    ToggleButtonModule
  ],
  exports: [
    RippleModule,
    ButtonModule,
    DividerModule,
    CardModule,
    FieldsetModule,
    AvatarModule,
    AvatarGroupModule,
    DockModule,
    ToastModule,
    BadgeModule,
    TagModule,
    ProgressSpinnerModule,
    ToggleButtonModule
  ],
})
export class PrimeNGModule { }
