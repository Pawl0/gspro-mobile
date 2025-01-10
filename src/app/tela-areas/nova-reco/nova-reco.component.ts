import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { ActivatedRoute } from '@angular/router';
import { Frase } from 'src/app/shared/modelos/frase';
import { Base64 } from '@ionic-native/base64/ngx';
import { FrasesService } from 'src/app/shared/servicos/frases.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {
  Platform,
  IonSelect,
  NavController,
  ToastController,
} from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ImageCompressService } from 'ng2-image-compress';
import { Database } from 'src/app/shared/providers/database';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-nova-reco',
  templateUrl: './nova-reco.component.html',
  styleUrls: ['./nova-reco.component.scss'],
  standalone: false,
})
export class NovaRecoComponent implements OnInit {
  // dados armazenados no local storage
  @LocalStorage('areaRecoImg') areaRecoImg: any;
  @LocalStorage('areaReco') areaReco: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('areaid') areaid: any;

  @ViewChild('frase') f: IonicSelectableComponent;
  @ViewChild('fonte') fonte: IonSelect;

  listaFrases: Frase[];

  // formulário
  formReco: FormGroup;

  inputImg: boolean;
  fraseDisplay: string;
  imgDisplay: any;
  imageData: any;

  inpComplemento: boolean;

  fraseId: number;

  @Output()
  fecharModal = new EventEmitter();

  @Output()
  mostrarSalvar = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private localSt: LocalStorageService,
    private frasesService: FrasesService,
    private ac: ActivatedRoute,
    private camera: Camera,
    private base64: Base64,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private navCtrl: NavController,
    private db: Database,
    private file: File,
    private toastController: ToastController
  ) {
    this.formInicial();
  }

  ngOnInit() {
    this.metodoInicial();
  }

  // ====

  async metodoInicial() {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      document.URL.indexOf('http://localhost:8080') !== -1
    ) {
      this.inputImg = false;
    } else {
      this.inputImg = true;
    }

    this.listaFrases = await this.db.getAll('frase');

    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.voltar();
    });
  }

  // ====

  formInicial() {
    return (this.formReco = this.fb.group({
      recoFrase: [null, Validators.required],
      recoComplemento: [null, Validators.maxLength(200)],
      recoImgReal: [null, Validators.required],
    }));
  }

  // ====

  formSecundario() {
    return (this.formReco = this.fb.group({
      recoFrase: [null, Validators.required],
      recoComplemento: [null, Validators.maxLength(200)],
      recoImgReal: null,
    }));
  }

  // ====

  patchForm(i: number, obj: any) {
    this.formReco = this.fb.group({
      recoFrase: [obj, Validators.required],
      recoComplemento: null,
    });
    if (this.areaReco[i].recoComplemento !== null) {
      this.formReco
        .get('recoComplemento')
        .patchValue(this.areaReco[i].recoComplemento);
    }
  }

  // ====

  voltar() {
    this.navCtrl.back();
    setTimeout(() => {
      this.localSt.clear('areaRecoImg');
      this.localSt.clear('img');
      this.imgDisplay = null;
      this.f.clear();
    }, 50);
  }

  // ====

  setarReco(valor: any) {
    const frase = valor.value;
    this.fraseId = frase.id;
    this.fraseDisplay = frase.recomendacao;
  }

  // ====

  pegarImg(valor?: any) {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      document.URL.indexOf('http://localhost:8080') !== -1
    ) {
      try {
        ImageCompressService.filesToCompressedImageSource(
          valor.target.files
        ).then((observableImages) => {
          observableImages.subscribe(
            (image) => {
              this.imgDisplay = image.compressedImage.imageDataUrl;
              const im = new Image();
              im.src = image.compressedImage.imageDataUrl;
            },
            (error) => {
              console.log('Error while converting');
            }
          );
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      let source: any;
      if (valor === 'camera') {
        source = this.camera.PictureSourceType.CAMERA;
      } else if (valor === 'galeria') {
        source = this.camera.PictureSourceType.PHOTOLIBRARY;
      }
      try {
        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then(
            () => {
              const options: CameraOptions = {
                quality: 40,
                destinationType: this.camera.DestinationType.FILE_URI,
                mediaType: this.camera.MediaType.PICTURE,
                sourceType: source,
                targetWidth: 1280,
                targetHeight: 720,
                saveToPhotoAlbum: true,
              };
              try {
                this.camera
                  .getPicture(options)
                  .then(async (imageData: string) => {
                    this.imageData = imageData.split('?')[0];
                    const fileName = this.imageData.split('/').pop();
                    const path = this.imageData.substring(
                      0,
                      this.imageData.lastIndexOf('/') + 1
                    );
                    let imageBase64: string;
                    await this.file
                      .readAsDataURL(path, fileName)
                      .then((base64File: string) => {
                        imageBase64 = base64File;
                      })
                      .catch(() => {
                        imageBase64 =
                          'iVBORw0KGgoAAAANSUhEUgAABQAAAALQBAMAAAA9U8BlAAAAG1BMVEUAAAD/Dw4/AwN/BwdfBQUfAQHfDQyfCQi/CwozZa0BAAAACXBIWXMAAA7EAAAOxAGVKw4bAAASR0lEQVR4nO3dzWPTRsIH4ODESY516QaOCfTrWC/t0mNS2LZHQtl0j/htGzg2S9/Csdm+W/izX0u2pJE0I5ts3MTieS7gWNLMSD9JI1kfGxsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJdl8969q64C77Ibo9FVV6Ev7t5r++yqK3XtCeClORq1/eWqK3XtCeClEcCLEMBLI4AXIYCX5mi097Lpf6+6UteeAF6ao9HNq67CGhLASyOAFyGAl0YAL0IAL40AXsTOy5dXXYW+EECulABypQSQKyWAXCkB5EoJIFdKALlSAsiVEkCulABypQSQK3WpAXzy6vT09PXfFwz1+MGrP05Pn7+IDDf8Jvvml0fdExjcnw71+q/RaedfLapBUdqH999kFf58QXnLmTY+qHk2K14fLl1guknDu69SsySbW1Vbs0/Pf7lo7a9MRwC3RqPD+X8/fPXH5L1ihA/mfxx88+Y0vChk8Ov8iupn+x0F3v21vPK6Ndwnk9kXe//qqvIn89FvZ/P+RlmdzLfzr34Il1eixoP7k6IitfLSDaxsj/bCEbJLyL+f1WnepE9nE65d2psqsLNJW+fzMb4IBp8umWkDh2f5N/+eT3024K1LWZn+RN0BnN0ft5W39L3GCN/kDa4Gn8+BcDG0Dar4ZcPV59an1Tf/Ttc4GOqLxtIal9+EyyFe408mo8B/Fg1eV7scKw/gTlFw/qfvi+kGNxgmC+xq0mb1TRDmWQDP5l/8nP1pWHxatx7VEgH8btayegCH84VdDj2s8pdeDwe1hTCqbb02/hl+k7wtYLakT0/zfw5rS+vr2Vd5Gf/TamK9xh/XK1Ju69MNDLUCWLX+t2zcspm3yqHSBXY0aSuf0F7+zd5+OUIewHJ23c7+dFJO+OfUnLueFgewWAnrAZwvnmo5ZDP41lePpn2W8/ryDw3ycV5//tWdOx9+mf032ELk4fzlo2k/7sv67K7JlvRe3iPKyrm9cVwtrZ28BtP/PPm1NuVojQ/yRffi4Z07dx5kFb7ZPXhDI4DvZ8v/x0fDD89nkZtO/NZHw8d/C+OQLrCjSWfZLNnP+neTcIzpktmfhnzv7xuPv52Vkc3Yfz36x91JmPm1sDCAeS72pjNuPxwhX5+fTYMUDDz6v/n/sy3RfnSSg2JW5x+ms/v9sCaj24fziU1q34SmS3pvnq3hdAH/VC2tbDn+WNWgmahGjad5eFb23z8NK5xoYE0zgNM0/FjU4TDbAM46F18H2/h0gekmTTdye8EsKdepLIAn86/+mZdxMt+pZ4MdRqt8XS0MYLYl+KU5QrZVvHVYn0659PMP8fwMRr8HO+dpAXu1D4fBh0SEJ+E+5my0Vy2t7TB0Z8FyiNb44HbYq59W+Gnn4A3NAO4W3dnNbELbReHZVmpxgekmhaHbCcKcBfC86EaOszImxZcnwYTXwqIAZkvii9YI01TerHXzBrUjiqwPFO0FDmqTyrYKh8H/g475SeLu5J1av3Faw3LOb5yHu+1ptX/qrPHdZvU/6By8oRnAcd71y5xNJ3RWrn4nVQOTBaabtFvrykyD9qga6O6s6zcb/3CnXF+Hk3rH+tpbFMCz5vFANsJO6zDjZFQugvnHp0sUvlmNle22gm/CbUfooL6HyTpWH5TTCre6Z1VfKF7junFV+jKDNwJ4sxp7e7Q3qOq4VZ8t0QLTTRrXdgM71YZyOtkq8tOt39ODcP0J5+P1tyCAm63jiWyEcesY4ayel2l+ljodMCkObbLZ+zT85qR2gBKMUJvuoFpax/Wd9m71MV7juu0qUcsM3ghgsLmdzrCPgzpOUo+ZqApMNmnY6Miclx+zHkq5OZxW9v1JNbO2Ezuf62pBAA+ChpYjDIIZPjNo7jEPlpsN43KeNkdoTbGo0tPGBIoAntUP/4bVtida44bNWl4XDt4KYDFyVu6k1qVL7BDLAtNN2mmcUjkut21ZAN8P/r4XtH1nzY5CjrITUHXFvM8COKmfMc1HuLndPIOcbW/q26vmzEs4KON/3lwRzmLnE3abxybbwebiaWP8IsDRGjcMqgYsM3gzgEHds1Ms1cgHqbMiZYHpJh03eiE75YS3aqeZplMIVtbBmp0JjDycqGjMtJn3WhvAbPmMW9uHg2aPbbjcI46Oi+UzaHUaj2Pb0BvNcjaDzUV9FaiyHa1xw7BabMsM3gxgUPdxLY6tCrcKTDfprLFOVitJ7fRBfpwYtH3NDoO7A3jWjtHR6FY7Gu09zXipTuB2sVdp7zg2Y53Ag+ZUh8XS2m6eMi4nHa9x0yTYYy8evBnAz2qf3qs+tarVKjDdpEk4oVodt2oh36qfLm+Ndr11BzDSnzgajdr9mlGr0c39R1z5o377WRetfWpm3Dq/WJx1aO3rNssURWvcNClLW2bwZgCDvB7UdoE7ySwXBSab1N6XjotFs1Xbvwzqv35ENhrX2XR9v9OwP/8qC2D7kD5bPr81/rbV7ne0ujZRu8WCPGr3lc4jJ7PPWkE/n4dl3AxNdTIkVuOW83LKywzeCGA4l46b506CT7ECk03abK395cmW+tmdYfMEVOJHpOup+yg4sjIdjdordeTIK7oHbSkDGDlajO3Ez1tbxWLE89ZyLCsQq3FkymEAFw3eCOCt+lfB2JsLA5hs0m5rp3CjmCONFb6+mNqb1GttQQDbB1RHkZ+7I+eeBktsdYKZHDlfdhDZ/LaXVrHlaxd3XvwlVuPIlIMALhy8EcAPUl+F11QmCkw26Uar/bvFXxpTrXeAjtbrp5AFAdyPjNBew2LHeu1uYUQZwEiHr90t7Fhaw/a6clYMm/xluj7lIIALB+8IYO1a1f8mgMet9WCnmHRjqpPaJHoVwMiBxFEkK7GzXefL9IWLAMZOXu1G9oTJ/VVkQY+rC8iWODFRC+DCwVcawHmT2kHaLEp9dwIY+e4o0rmLTaSzLzx8cP9NdnfEZD5LtyITjfXfYz32vJhIX+uoWANiNS49uffqzR+n2cWgQQAX9l7/iwA2C0w2qd2X2ypWyXcngJEMHUVy0ToETfxt7kl4XX7+l/YRX/xvsXMWf5kP3D5jXgWwVeOZ/DrPQhDAxOCViwYwUmCySePWLuQdDGCkG3cU6ZrFtnbJCQ+/rJ11zP8W29rFtoqxs7ZP5xNoBvCgqFSsxrnvzsOKBAGMDx64YABjBSab1D6fNwh+Pw6m2ucAPo2N0O4YxgMYP5Ys7p7Ze/7mzZvz7gC2+oXbkd+t8oGmHcaHDeMqgPFz4sWdQ6fTirwJA7j4FPrFAhgtMNmk89EHjRY9ePcC+FtshNjZkfYBR+pn+HG2CH7/ara9Kg5CYgccsQOTVlC353/Ybf+gU/6ekbhCLr/X5fbnHxVNqAK4+IK6CwUwXmCySeexJh22prrR6wBGrquIbdneIoDZvVw/7Bef3jaAkWte9ooJdAQwVpP8VqDqTvAwgIvPGl4kgIkCk00SwFUEMLtYP7jn920D2LxIa6tI2dsH8KR++/LqA5gqMNUkAYwdBcRHWD6AJ+G9SxcI4En9j0dFL2E6gfZrZ79I1zi/5v+w1oQqgIuv47lAAJMFppp0PrrZbtK7dhR86QE8r1/q+dYBrN/8tFNemd7+4bS7xtkItUttVx7AZIGpJrV/3Y5MNSeAsQtXonuyzcZxTRDA/UjxkR7AQXC7WnYT7E/lhJIXEESbOG4caqw8gOkCE03q+ClJABuWPg943LjCevctzwPOHkFxa3YgmT0GoJhc+rq7eE2Gzbs+Vh3AjgITTeq4rk8AG5b+JaT5x923/CWkeOrK8xf3Xuad9J+rgffbxaVr3Jr4qgOYLjDVpI7LqgRwib9FfwueNE45bL/lb8FZYsMfUsoD6vSP/vHatU7/TlYcwHSBqSZ1BEkAG5a9GmbQnGKxIJe9Giafu+VzzoKn7LWmvLDGjb+NVhzAdIGpJrXGiEx1RgBjN4DEfkhu7SgP5gsydgNI7HrAaax/zh4c+Ue2zwqfGjrsuP413mmob58Hqw5gusBUk47Tv8gIYMOyV0TvNDM1fssroocd9/gkT1rEOwj1wTdXHcBkgckmpW+oE8CmZe8JaZ2tKy5GWPaekK3khQIdlx/GTxzV87C76gAmC0w2KX0/kwBGhmx24aJ3xe02ZvZ07X+7u+I2k7uljnbEA/i09vl49QFMFJhsUnz216c6I4DL3hfc3AJulgFc8r7gzeQWsOM+5GW2gOM/ews4rgKYfnbC00TxAti05JMRmgE8LgO45JMRBsndUsd9yEsEMNsU/6kBrApMNym2C2hMdUYAI8+GiT6XrNmtOSsD2H42zEm0c558bFX6SXzLnKXcWXkA0wUmm5S+MFEAm3abG7DN6A+5ja1a/uyP+f/Pm7NtHL2Y4az+woxA+smg8dMwN+uDrP40TKrAZJO2W3uF1lRnBHDZ5wM2zs0cjJ6VC7I5Qvz5gPnvpr9HX4R01H6QV0eN6+d4BqO9sxUHMF1gsklbXZv7w+CjAGarcW13Md0DR6/qrN1nNx3oQbkgdxq70JP4Y+5mP5zuPX/98uW9h/vhN7vJfXCsxjdqnYGT0QfjFQcwXWC6SecdB8iHwUcBbD0jejdxBFfL6cej2+Wt1s1nRGePHI9WqngjUe5ZsOEYxJ6klKxxLe+Dyei3VQewo8Bkkw5S65QAtiz5lPzjYLuWPci+CuCST8nf2PhuEi6v4PL+o1Hraa7pGg/DB8Bkz59fdQA7Ckw2aav1MrPmVGcEMP9z8DTzr1NP2NupFkP2mppHQQC3wrcjdb1vZZj/bNpeXJuj+jifFFNLnDgqV4VPs7CvOoAdBaabNK7Px0FxpUK/Ath6PmDxgMC3CuBWMOe+HaXik20aZ/eEZG+B/GkjCGAW4eKmnezLrrk4fHznzsMHr/INR1XF6eLaK3dgg1/LKkRrfFK+F+fb/BrQlQcwXWC6Sdk69WO5DfxkUpTTrwC2Vc/hXD6A+YSeZe+K+zB78EbiXXH5qednX/0jf1HcdPcSBjCL8F7+rrjs+RXdr0mYGWZJr2qTn9X5Pbu0eJhP/7CrxsNZaY/z97b9Z2P1AUwX2NGkbKbe/msWwXw8AdxIL5+l3pZZe13mZxu1AC75tsya72vb2tkE9k7nZRRfxGscvL0y+3rlAUwX2NGk+Uydv0hTAGcjJJbPVpWt9PuCg5RlEasFcP661VzH+4JrDmoHK5+GrSjfShevcbXC5GvL6gOYLLCrSYNwtS7fNieAUYOzYgbvdxQ4f6n57Ox/PYDli8NHnW9Mr5VZf5zp3XIlCE5npHqt82U7e7v66gOYLLCzSYO/FS2qXjPaqwBeqruvTkenr//aPdB3v072nn8e30cP7v8x/fLF/vJFHtVP+AwfZFV4/uKjJUYd3p8OGv9ZZTWWLLDRpCfZPJnO1VSvhivV+hV6/fWwST0Wv319rfWwSX22Zm+mWkYPm9RjzVuNe6CHTeqxjmf4rKseNqnH2q85WHs9bFKP9XB/1cMm9dhSrwRbLz1sUn91PRRmTfWwST223Gth10oPm9RjrRtC118Pm9Rfw/TdmOuqh03qsdTdT2ush03qj18an7NL/PevoiKXp4dN6rHzH+oXJY277x1ZBz1sUo+dj24dBh+zS6gPE4Ouix42qceya4p/Ly42fZJ96ngr9nroYZN6bHZ9+vMXnz+8dz+/wD1+4/Y66WGT+uzb+t0ry9y8ed31sEl9VnvpeOfdT2ujh03qs+Hd4jEWtxfc/bQ2etikfnv88N69ew+XufFtbfSwSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvjv8HP2nUmusEn2sAAAAASUVORK5CYII=';
                      });
                    const imageObject = new Image();
                    if (imageBase64 != undefined) {
                      imageObject.src =
                        'data:.image/jpg;base64,' +
                        imageBase64
                          .replace('data:image/*;charset=utf-8;base64,', '')
                          .replace('data:image/jpeg;base64,', '');
                    }
                    this.imgDisplay = imageObject.src;
                  });
              } catch (e) {
                alert(
                  'Não foi possível processar a imagem no momento, libere espaço em seu aparelho e tente novamente'
                );
                console.log(e);
                alert(
                  'Erro ao processar imagem, tire com a câmera do aparelho e depois selecione por aqui.'
                );
              }
            },
            () => {
              try {
                this.androidPermissions.requestPermission(
                  this.androidPermissions.PERMISSION.CAMERA
                );
              } catch (e) {
                console.log(e);
                alert(
                  'O aplicativo precisa de permissoes para prosseguir. CAMREFUSED'
                );
              }
            }
          );
      } catch (e) {
        console.log(e);
      }
    }
  }

  // ====

  objeto() {
    return {
      codFraseReco: this.fraseId,
      recoFrase: this.fraseDisplay,
      recoComplemento: this.formReco.get('recoComplemento').value,
      recoImg: this.imgDisplay,
    };
  }

  // ====

  gravarDados() {
    this.mostrarSalvar.emit();
    this.db.insert('recomendacao', 'os, id_area, foto, id_frase, complemento', [
      this.ordemDetalhes.id,
      this.areaid.id,
      this.imageData,
      this.fraseId,
      this.formReco.get('recoComplemento').value,
    ]);
    // this.localSt.store('areaReco', [this.objeto()]);
    this.voltar();
  }

  // ====

  addRecoArray(objeto: any) {
    this.areaReco.push(objeto);
    this.areaReco = this.areaReco;
  }

  async mostrarToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 7000,
    });
    toast.present();
  }
}
