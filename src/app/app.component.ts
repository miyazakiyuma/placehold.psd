import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import {
  initializeImageMagick,
  ImageMagick,
  MagickFormat
} from '@imagemagick/magick-wasm';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  pictForm = new FormGroup({
    width: new FormControl(150, [Validators.min(1), Validators.max(32768)]),
    height: new FormControl(150, [Validators.min(1), Validators.max(32768)]),
    fontSize: new FormControl(16, [Validators.min(1), Validators.max(512)] ),
    fontColor: new FormControl("#ffffff", [Validators.required] ),
    bgColor: new FormControl("#3d4070", Validators.required),
    text: new FormControl(""),
  });
  color:any;


  get pictText():string {
     const v = this.pictForm.value;
      let text = v.text;
      if(!text) {
        text = `${v.width} x ${v.height}`;
      }
      return text;
  }
get style() {
  const v = this.pictForm.value;
  return {
    'width':`${v.width}px`,
    'min-width':`${v.width}px`,
    'max-width':`${v.width}px`,
    'height':`${v.height}px`,
    'min-height':`${v.height}px`,
    'max-height':`${v.height}px`,
    'background-color':v.bgColor,
    'color':v.fontColor,
    'font-size':!v.fontSize ? '16px' : `${v.fontSize}px`
  };
}


  async click() {
    const canvas = await html2canvas(document.querySelector("#capture")!);
    const v = this.pictForm.value;
    initializeImageMagick().then(async () => {
      ImageMagick.readFromCanvas(canvas, image=>{
          image.write(data => {
            const blob = new Blob([data], { type: 'application/octet-stream' });
            saveAs(blob, 'placehold.psd');
        }, MagickFormat.Psd);
      });
    }).catch(err => {
        console.error(err);
    });
  }

}
