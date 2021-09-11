import * as firebase from 'firebase';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { Func } from '../../func';
import { ApiHttpService } from '../api-http.service';
declare let Kakao: any;

@Component({
  selector: 'app-jaum',
  templateUrl: './jaum.page.html',
  styleUrls: ['./jaum.page.scss'],
  providers: [MessageService]
})
export class JaumPage implements OnInit {

  private db = firebase.default.database();
  private rId = null;
  private isMute = true;
  private subMenu = [];
  private messages = new Array();
  private inputMessage = '';
  private limitCnt = 0;
  private lastChatTime = 0;
  private isStart = false;
  private delayStart = false;
  private rTitle = false;
  private userCnt = 0;
  private qTitle = null;
  private qResult = null;
  private qSubject = null;

  public backgroundAudio = null;
  public soundAudio = null;

  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;
  @ViewChild('chatInput', { static: false }) chatInput: { setFocus: () => void; };

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private http: ApiHttpService,
    public router: Router
  ) {
    Kakao.init('331b61f85ecddd45862bd73350ff4638');

    this.activatedRoute.queryParams.subscribe(params => {
      this.rId = params['rId'];

      // 채팅 설정
      this.db.ref('rooms/' + this.rId + '/jaum/messages').limitToLast(1).on('child_added', (snapshot) => {
        const data = snapshot.val();
        data.isMe = data.uId == localStorage.uId;
        this.setChat(data);
        this.playAudio('chat');
      });

      // 유저 수
      this.db.ref('rooms/' + this.rId + '/jaum/users').limitToLast(1).on('child_added', async (snapshot) => {
        const userList = (await this.db.ref('rooms/' + this.rId + '/jaum/users').once('value')).val();
        this.userCnt = Object.values(userList).length;
        this.playAudio('join');
      });
      this.db.ref('rooms/' + this.rId + '/jaum/users').on('child_removed', async () => {
        const userList = (await this.db.ref('rooms/' + this.rId + '/jaum/users').once('value')).val();
        this.userCnt = Object.values(userList).length;
      });

      // 문제 설정
      this.db.ref('rooms/' + this.rId + '/jaum/result').on('child_added', async (snapshot) => {
        const data = snapshot.val();
        this.qTitle = Object.values(data.value);
        this.qResult = Object.values(data.result);
        this.qSubject = data.subject;
        this.isStart = true;
      });

      // 문제 초기화
      this.db.ref('rooms/' + this.rId + '/jaum/result').on('child_removed', async () => {
        this.qTitle = this.qResult;
        this.isStart = false;
        this.resetTitle();
        this.playAudio('action');
      });

      (async () => {
        if (params['rId'] != null || this.rId != undefined) {
          if ((await this.db.ref('rooms/' + this.rId + '/jaum').once('value')).val() != null) {
            this.db.ref('rooms/' + this.rId + '/jaum/users/' + localStorage.uId).set(true);
            this.db.ref('rooms/' + this.rId + '/jaum/users/' + localStorage.uId).onDisconnect().remove();
          }
        }
      })();
    });
  }

  ngOnInit() {
    this.backgroundAudio = new Audio();
    this.backgroundAudio.autoplay = true;
    this.backgroundAudio.src = '../../assets/sounds/background.mp3';
    this.backgroundAudio.volume = 0.3;
    this.backgroundAudio.loop = true;
    this.backgroundAudio.load();
    this.backgroundAudio.play();

    window.addEventListener('visibilitychange', () => {
      this.backgroundAudio.pause();
      this.isMute = false;
    });

    window.addEventListener('keyboardWillHide', () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    });
  }

  mute() {
    if (this.isMute) {
      this.backgroundAudio.pause();
    }
    else {
      this.backgroundAudio.load();
      this.backgroundAudio.play();
    }
    this.isMute = !this.isMute;
  }

  exit() {
    // this.router.navigateByUrl('/tabs/tab1');
    window.location.href = '/tabs/tab1';
  }

  ngOnDestroy() {
    this.backgroundAudio.pause();
    this.isMute = false;
  }

  setFocusOnInput() {
    this.chatInput.setFocus();
  }

  sendChat() {
    if (this.inputMessage.length > 0) {
      if (this.lastChatTime + 10000 < Date.now()) {
        this.lastChatTime = Date.now();
        this.limitCnt = 0;
      }
      if (this.limitCnt > 10) {
        // this.toastBox('[경고] 도배로 인해 당분간 채팅이 금지됩니다.');
        this.inputMessage = '';
      }
      else {
        if (this.inputMessage.indexOf('자음게임') == 0 || this.inputMessage.indexOf('모음게임') == 0) {
          const gType = this.inputMessage.indexOf('자음게임') > -1 ? 0 : (this.inputMessage.indexOf('모음게임') > -1 ? 1 : -1);
          const param = gType == 0 ? this.inputMessage.split('자음게임')[1].trim() : (gType == 1 ? this.inputMessage.split('모음게임')[1].trim() : '');
          this.pushMessage('normal', this.inputMessage);
          if (gType == -1) return;

          (async () => {
            if ((await this.db.ref('rooms/' + this.rId + '/jaum/isStart').once('value')).val() == true) {
              this.guideChat(['진행중인 게임이 있습니다', '정답을 맞추거나 포기해야 합니다']);
            }
            else {
              this.db.ref('rooms/' + this.rId + '/jaum/').update({ isStart: true });
              const result = (await this.http.jaum.get({ code: param }));
              this.db.ref('rooms/' + this.rId + '/jaum/result').push({
                value: Func.split_hangul(Func.aesDecrypt(result.payload.result), gType),
                result: Func.aesDecrypt(result.payload.result),
                subject: result.payload.subject
              });
              this.db.ref('rooms/' + this.rId + '/jaum/messages/').push({
                text: ['게임이 시작되었습니다!'],
                guide: true,
                createdAt: Date.now()
              });
              this.db.ref('rooms/' + this.rId + '/jaum/messages/').push({
                text: ['[' + result.payload.subject + '] ' + Func.split_hangul(result.payload.data, gType)],
                guide: true,
                createdAt: Date.now()
              });
            }
          })();
        }
        else if (this.inputMessage.indexOf('정답 ') == 0 && this.qResult != null) {
          const rResult = this.inputMessage.split('정답 ')[1];
          (async () => {
            const tResult = Object.values((await this.db.ref('rooms/' + this.rId + '/jaum/result/').once('value')).val())[0]['result'];
            if (rResult.replace(/ /g, '') == tResult.replace(/ /g, '')) {
              this.pushMessage('correct', '정답 ' + tResult);
              this.db.ref('rooms/' + this.rId + '/jaum/messages/').push({
                text: [tResult + ' - 정답입니다!'],
                guide: true,
                createdAt: Date.now()
              });
              this.db.ref('rooms/' + this.rId + '/jaum/').update({
                isStart: false,
                result: null
              });
            }
            else {
              this.pushMessage('incorrect', '정답 ' + rResult);
            }
          })();
        }
        else if (this.inputMessage == '포기') {
          this.pushMessage('normal', this.inputMessage);
          (async () => {
            let tResult = null;
            try {
              tResult = Object.values((await this.db.ref('rooms/' + this.rId + '/jaum/result/').once('value')).val())[0]['result'];
            }
            catch (e) {
              this.db.ref('rooms/' + this.rId + '/jaum/').update({
                isStart: false,
                result: null
              });
            }

            if (this.qResult != null && tResult != null) {
              // this.db.ref('rooms/' + this.rId + '/jaum/messages/').push({
              //   text: [Func.makeName(localStorage.uId) + '님이 포기하였습니다!'],
              //   guide: true,
              //   createdAt: Date.now()
              // });
              this.db.ref('rooms/' + this.rId + '/jaum/messages/').push({
                text: ['정답은 ' + this.qResult.join('') + ' 입니다!'],
                guide: true,
                createdAt: Date.now()
              });
              this.db.ref('rooms/' + this.rId + '/jaum/').update({
                isStart: false,
                result: null
              });
            }

          })();
        }
        else if (this.inputMessage == '도움말') {
          this.pushMessage('normal', this.inputMessage);
          this.guideChat(['[게임시작] 자음게임 [주제], 모음게임 [주제]']);
          this.guideChat(['[정답입력] 정답 XXXX', '[게임포기] 포기']);
        }
        else {
          this.pushMessage('normal', this.inputMessage);
        }
        this.limitCnt++;
        this.inputMessage = '';
        this.setFocusOnInput();
      }
    }
  }

  pushMessage(type, text) {
    this.db.ref('rooms/' + this.rId + '/jaum/messages/').push({
      text: text,
      uId: localStorage.uId,
      name: Func.makeName(localStorage.uId),
      type: type,
      createdAt: Date.now()
    });
  }
  setChat(msgData) {
    this.messages.push(msgData);
    this.scrollToBottom();
  }

  guideAction(value) {
    switch (value) {
      case 'jStart':
        this.inputMessage = '자음게임';
        this.sendChat();
        break;
      case 'mStart':
        this.inputMessage = '모음게임';
        this.sendChat();
        break;
      case 'guide':
        this.inputMessage = '도움말';
        this.sendChat();
        break;
    }
  }

  makeRoom(value, size) {
    switch (value) {
      case 'jaum':
        this.db.ref('rooms/' + localStorage.uId + '/jaum').set({
          makeTime: Date.now()
        });
        this.router.navigate(['/jaum'], { queryParams: { 'rId': localStorage.uId } });
        break;
      case 2:

        break;
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.myContent.scrollToBottom(300);
    }, 100);
  }

  guideChat(text) {
    const msgData = new Array();
    msgData['guide'] = true;
    msgData['name'] = '';
    msgData['text'] = text;
    this.setChat(msgData);
  }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }
  // async toastBox(value) {
  //   const toast = await this.toastController.create({
  //     color: 'dark',
  //     position: 'middle',
  //     message: value,
  //     duration: 2000
  //   });
  //   toast.present();
  // }

  resetTitle() {
    setTimeout(() => {
      if (!this.isStart) {
        this.qTitle = null;
        this.qSubject = null;
        this.qResult = null;
      }
    }, 3000);
  }

  playAudio(type) {
    if (this.isMute) {
      this.soundAudio = new Audio();
      this.soundAudio.autoplay = true;
      switch (type) {
        case 'chat':
          this.soundAudio.src = '../../assets/sounds/chat.mp3';
          break;
        case 'join':
          this.soundAudio.src = '../../assets/sounds/join.mp3';
          break;
        case 'success':
          this.soundAudio.src = '../../assets/sounds/success.mp3';
          break;
        case 'fail':
          this.soundAudio.src = '../../assets/sounds/fail.mp3';
          break;
        case 'action':
          this.soundAudio.src = '../../assets/sounds/action.mp3';
          break;
      }
      this.soundAudio.load();
      this.soundAudio.play();
    }
  }

  kakaoShare() {
    Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '나랑.. 같이.. 자음게임 할래?',
        description: '#자음게임 #모음게임 #초성게임 #순발력 #뇌지컬',
        imageUrl: 'https://ddong-b30bf.web.app/assets/images/jaum_app_icon.png',
        link: {
          webUrl: location.href,
          mobileWebUrl: location.href,
        }
      }
    });
  }
}
