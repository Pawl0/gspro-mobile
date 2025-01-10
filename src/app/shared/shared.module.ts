import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// debug
import { FormdebugComponent } from 'src/app/shared/formdebug/formdebug.component';

// ngx-webstoraged
// import { NgxWebstorageModule } from 'ngx-webstorage';

// ionic-selectable
import { IonicSelectableComponent } from 'ionic-selectable';

// ng2-image-compress
import { ImageCompressService } from 'ng2-image-compress';

// cordova plugins
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

// signature pad
// import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [FormdebugComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // NgxWebstorageModule.forRoot(),
    IonicSelectableComponent,
    // SignaturePadModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormdebugComponent,
    // NgxWebstorageModule,
    IonicSelectableComponent,
    // SignaturePadModule,
  ],
  providers: [
    Camera,
    ImageCompressService,
    AndroidPermissions,
    Base64,
    CallNumber,
    LaunchNavigator,
  ],
})
export class SharedModule {}
