type TransferEvent = {
  from: string;
  to: string;
  tokenId: BigInt;
  event: any;
};

type EventHandler = (event: TransferEvent) => Promise<void>;

export class EventQueue {
  private queue: { event: TransferEvent; handler: EventHandler }[];
  private processing: boolean;

  constructor() {
    this.queue = [];
    this.processing = false;
  }

  private async processNext(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const { event, handler } = this.queue.shift()!;
    await handler(event);
    this.processing = false;

    this.processNext();
  }

  public add(event: TransferEvent, handler: EventHandler): void {
    this.queue.push({ event, handler });
    this.processNext();
  }
}
