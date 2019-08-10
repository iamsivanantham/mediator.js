type Option = {
  timeout: number;
}

type Packet = {
  id: string,
  kind: PacketKind,
  payload?: any,
}

enum PacketKind {
  NEW = 'NEW',
  REPLY = 'REPLY',
}

type Message = {
  data: any,
  reply: (data: any) => void
}

type MessageCallback = (message: Message) => void;

class Mediator {

  private targetWindow: Window;
  private targetOrigin: string;
  private onMessageCallback?: MessageCallback;
  private option: Option;

  private registry: {[key: string]: (value?: any) => void};

  constructor(targetWindow: Window, targetOrigin: string, option: Option = {timeout: 500}) {
    this.targetWindow = targetWindow;
    this.targetOrigin = targetOrigin;
    this.option = option;
    this.registry = {};
    this.startListening();
  }

  public postMessage(payload: any, option?: Option): Promise<any> {
    return new Promise((resolve, reject) => {
      let mid = this.nextId();
      this.sendPacket({ id: mid, kind: PacketKind.NEW, payload: payload });
      this.registry[mid] = resolve;
      var timeout = (option) ? option.timeout : this.option.timeout;
      setTimeout(() => {
        reject(new Error('Request timed out'));
        delete this.registry[mid];
      }, timeout);
    });
  }

  public onMessage(onMessageCallback: MessageCallback) {
    this.onMessageCallback = onMessageCallback;
  }

  private startListening() {
    let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    let eventer = window[eventMethod];
    let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent, (e: MessageEvent) => {
      if(this.securityCheck(e)) {
        this.handleMessage(<Packet> e.data);
      }
    });
  }

  private securityCheck(e: MessageEvent) {
    if (this.targetOrigin != '*' && this.targetOrigin !== e.origin) {
      return false;
    }
    if (!e.data || !e.data.id || !e.data.kind) {
      return false;
    }
    return true;
  }

  private handleMessage(packet: Packet) {
    switch(packet.kind) {
      case PacketKind.NEW:
        this.handleNewPacket(packet);
        break;
      case PacketKind.REPLY:
        this.handleReplyPacket(packet);
        break;
    }
  }

  private handleNewPacket(packet: Packet) {
    if(this.onMessageCallback) {
      let message: Message = {
        data: packet.payload,
        reply: (data) => {
          this.sendPacket({id: packet.id, kind: PacketKind.REPLY, payload: data});
        }
      }
      this.onMessageCallback(message);
    }
  }

  private handleReplyPacket(packet: Packet) {
    if(this.registry[packet.id]) {
      this.registry[packet.id](packet.payload);
      delete this.registry[packet.id];
    }
  }

  private sendPacket(packet: Packet) {
    this.targetWindow.postMessage(packet, this.targetOrigin);
  }

  private nextId(): string {
    return `apm.${Math.random().toString(36).substr(2, 9)}.${Math.random().toString(36).substr(2, 9)}`;
  }

}

export { Option, MessageCallback, Message };
export default Mediator;