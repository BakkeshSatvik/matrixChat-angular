import { MatrixEvent } from 'matrix-js-sdk';

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  event: MatrixEvent;
  reactions?: Map<string, Set<string>>;
}
