import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ImageCompressService } from 'ng2-image-compress';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'app-tela-nao-exec',
  templateUrl: './tela-nao-exec.page.html',
  styleUrls: ['./tela-nao-exec.page.scss'],
  standalone: false,
})
export class TelaNaoExecPage implements OnInit {
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('infoIniciais') infoIniciais: any;

  listaFrasesNaoExec: any;

  formMotivo: FormGroup;

  fraseSelecionada = false;
  frase: string;
  fraseId: number;
  hasComplete: number = 0;
  fraseSplit: any = [];

  delimitador = '_____';

  inputImg: boolean;
  imgDisplay: any;

  inpComplemento: boolean;
  inpImg: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private db: Database,
    private localSt: LocalStorageService
  ) {
    this.formMotivo = this.formBuilder.group({
      frase: [null, Validators.required],
      complemento: [null, [Validators.maxLength(200), Validators.minLength(3)]],
      img: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.metodoInicial();
  }

  async metodoInicial() {
    this.listaFrasesNaoExec = await this.db.getAll('fraseNaoExec');

    this.inpComplemento = false;
    this.inpImg = false;

    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      document.URL.indexOf('http://localhost:8080') !== -1
    ) {
      this.inputImg = false;
    } else {
      this.inputImg = true;
    }
  }

  voltar() {
    this.modalCtrl.dismiss();
    this.imgDisplay = null;
  }

  setarMotivo(valor: any) {
    if (valor.frase.indexOf('_____') == -1) {
      this.hasComplete = 1;
      this.fraseSplit = [valor.frase];
    } else if (valor.frase.split('_____').length >= 2) {
      this.hasComplete = 1;
      this.fraseSplit = valor.frase.split('_____');
    } else if (valor.frase.split('_____').length < 2) {
      this.hasComplete = 2;
      this.fraseSplit = valor.frase.split('_____');
    } else {
      this.hasComplete = 0;
      this.fraseSplit = [valor.frase];
    }
    if (valor !== undefined) {
      this.fraseId = valor.id;
      this.frase = valor.frase;
    } else {
      this.fraseId = null;
    }

    this.inpImg = true;

    this.verificarNumeroDeCampos();
  }

  verificarNumeroDeCampos() {
    if (this.frase.includes('_____') || this.frase.includes('TEXTO PRÓPRIO')) {
      this.inpComplemento = true;
      this.formMotivo.get('complemento').setValidators([Validators.required]);
      this.formMotivo.get('complemento').updateValueAndValidity();
    } else {
      this.inpComplemento = false;
      this.formMotivo.get('complemento').clearValidators();
      this.formMotivo.get('complemento').updateValueAndValidity();
    }
  }

  foto(valor?: any) {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      document.URL.indexOf('http://localhost:8080') !== -1
    ) {
      ImageCompressService.filesToCompressedImageSource(
        valor.target.files
      ).then((observableImages) => {
        observableImages.subscribe(
          (image) => {
            this.formMotivo
              .get('img')
              .patchValue(image.compressedImage.imageDataUrl);
            this.imgDisplay = image.compressedImage.imageDataUrl;
            const im = new Image();
            im.src = image.compressedImage.imageDataUrl;
          },
          (error) => {
            console.log(error);
            console.log('Error while converting');
          }
        );
      });
    } else {
      this.androidPermissions
        .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(
          (result) => {
            const options: CameraOptions = {
              quality: 40,
              destinationType: this.camera.DestinationType.DATA_URL,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.CAMERA,
              targetWidth: 1280,
              targetHeight: 720,
              saveToPhotoAlbum: true,
              correctOrientation: false,
            };
            try {
              this.camera.getPicture(options).then((imageData) => {
                const im = new Image();
                im.src = 'data:.image/png;base64,' + imageData;
                im.onload = () => {};
                this.formMotivo
                  .get('img')
                  .patchValue('data:image/jpeg;base64,' + imageData);
                this.imgDisplay = im.src;
              });
            } catch (e) {
              alert(
                'Não foi possível processar a imagem no momento, libere espaço em seu aparelho e tente novamente'
              );
              console.log(e);
            } finally {
            }
          },
          (err) => {
            console.log(err);
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.CAMERA
            );
          }
        );
    }
  }

  async gravarDados() {
    let frase = this.frase;
    frase = this.formMotivo.get('complemento').value;
    await this.db.createQuery(
      `UPDATE os SET status = 2, codFrase = ` +
        this.fraseId +
        `, horaInfo = "` +
        Date.now() +
        `", obsGeral = "` +
        frase +
        `", img = "` +
        this.imgDisplay +
        `" WHERE id = ` +
        this.ordemDetalhes.id
    );
    await this.alertSucesso();
  }

  async alertSucesso() {
    await this.localSt.clear('horaInicio');
    const alert = await this.alertCtrl.create({
      message: 'Ordem de serviço não executada informada.',
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss().then(() => {
        this.modalCtrl.dismiss();
        this.navCtrl.navigateForward('/lista-os');
      });
    }, 2500);
  }
}
