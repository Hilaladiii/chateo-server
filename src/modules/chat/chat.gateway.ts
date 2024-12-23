import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(3002, {})
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @SubscribeMessage('message')
  handleMessage(client: Socket, message: any) {
    client.emit('reply', 'haii haii haii');
  }

  handleConnection(client: Socket) {
    console.log('user join chat', client.id);
  }
  handleDisconnect(client: any) {
    console.log('user left chat', client.id);
  }
}
