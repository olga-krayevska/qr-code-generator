import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { QRCodeErrorCorrectionLevel } from 'angularx-qrcode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'qr-generator';
  stringToCode = "Hello there!";
  errorCorrectionLevel = "M" as QRCodeErrorCorrectionLevel;
  formGroup = new FormGroup ({
    qrInput: new FormControl(''),
    errorCorrectionLevel: new FormControl(this.errorCorrectionLevel)
  })

  ngOnInit() {
    this.formGroup?.valueChanges.subscribe((changes) => {
      if (changes) {
        this.stringToCode = changes.qrInput ?? this.stringToCode;
        this.errorCorrectionLevel = changes.errorCorrectionLevel as QRCodeErrorCorrectionLevel ?? this.errorCorrectionLevel;
      }
    })
  }

  get qrInput(): AbstractControl<string | null, string | null> | null {
    return this.formGroup.get('qrInput');
  }
 
  saveAsImage(qrcode: any): void {
    let qrcodeElement = qrcode.qrcElement.nativeElement
        .querySelector("canvas")
        .toDataURL("image/png")
    
    if (qrcodeElement) {
      let blobData = this.convertBase64ToBlob(qrcodeElement);
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "Qrcode"
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    const parts = Base64Image.split(";base64,")
    const imageType = parts[0].split(":")[1]
    const decodedData = window.atob(parts[1])
    const uInt8Array = new Uint8Array(decodedData.length)
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: imageType })
  }
  
  clear(): void {
    this.qrInput?.reset();
  }
}
