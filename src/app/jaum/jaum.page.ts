import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent } from '@ionic/angular';
import * as firebase from 'firebase';
import { Func } from '../../func';

@Component({
  selector: 'app-jaum',
  templateUrl: './jaum.page.html',
  styleUrls: ['./jaum.page.scss'],
})
export class JaumPage implements OnInit {

  public db = firebase.default.database();
  public rId = null;
  public messages = new Array();
  public inputMessage = '';
  public qMessage = 'zzzz';

  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;
  @ViewChild('chatInput', { static: false }) chatInput: { setFocus: () => void; };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.rId = params['rId'];
      this.db.ref('rooms/' + this.rId + '/messages').on('child_added', (snapshot) => {
        const data = snapshot.val();
        data.name = Func.makeName(data.uId);
        data.isMe = data.uId == localStorage.uId;
        this.messages.push(data);
        this.scrollToBottom();
      });
    });
  }

  ngOnInit() {
  }

  setFocusOnInput() {
    this.chatInput.setFocus();
  }

  sendChat() {
    if (this.inputMessage.length > 0)
      this.db.ref('rooms/' + this.rId + '/messages/').push({
        text: this.inputMessage,
        uId: localStorage.uId,
        createdAt: Date.now()
      });

    this.qMessage = this.inputMessage;
    this.inputMessage = '';
    this.setFocusOnInput();
  }

  makeRoom(value, size) {
    switch (value) {
      case 'jaum':
        this.db.ref('rooms/' + localStorage.uId).set({
          roomType: value,
          roomSize: size,
          roomChat: '',
          userCount: 1,
          makeTime: Date.now()
        });
        this.router.navigate(['/jaum'], { queryParams: { "rId": localStorage.uId } });
        break;
      case 2:
        this.db.ref('rooms/' + localStorage.uId).remove();
        break;
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.myContent.scrollToBottom(300);
    }, 100);
  }
}
