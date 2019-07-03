import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('scannerComponent')
  scannerComponent;
   scannedCode = null;
   createdCode = null;
   qrData = null;
   currentPlatform: any;
   hideCamera: boolean = true;
   hasPermision: boolean;
   qrCodeResults: string;
   isWeb: boolean = false;

  constructor(private barcodeScanner: BarcodeScanner,
              private ptl: Platform) {
      this.ptl.ready()
      .then(() => {
          if ( this.ptl.is('cordova') ) {
              console.log('Mobile');
              return 'Mobile';
          } else { // fallback to browser APIs 
              console.log('is not Mobile');
              return 'Web';
          }
      })
      .then(value => {
        return this.currentPlatform = value;
      });
  }

  ngOnInit(){

  }

  createCode(){
    this.createdCode = this.qrData;
  }

  scanCode(){
    console.log('ScanStarts');
    console.log(this.currentPlatform);

    if(  this.currentPlatform === 'Mobile'){
      console.log('MObiles');
      this.barcodeScanner.scan().then(barcodeData =>{
        this.scannedCode = barcodeData.text;
      });
    } else if ( this.currentPlatform === 'Web' ) {
      this.startWebScan();
    }
  }

  startWebScan() {
    console.log('Starr Web Scan method');
    this.isWeb = true;
    this.hideCamera = false;
    this.scannerComponent.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.log(`Devices and Camamras: ${devices}`);
    });

    this.scannerComponent.camerasNotFound.subscribe( ( devices: MediaDeviceInfo[] ) => {
      console.log('Error: cameras not found');
      console.error('Se a encontrado un error al tratar de conectar la camara del dispositivo con la Applicacion Web');
    });
    this.scannerComponent.permissionResponse.subscribe(( answer: boolean ) => {
      console.log('permissions');
      this.hasPermision = answer;
    });
  }

  handleQrCodeResult(result: string){
    this.qrCodeResults = result;
    console.log(this.qrCodeResults);
  }

  platformDetection() {
    console.log(this.ptl.platforms());
  }


}
