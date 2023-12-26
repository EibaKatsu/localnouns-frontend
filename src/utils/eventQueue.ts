type TransferEvent = {
  from: string;
  to: string;
  tokenId: BigInt;
  event: any;
};

type EventHandler = (event: TransferEvent) => Promise<void>;

export class EventQueue {
  private queue: { event: TransferEvent; handler: EventHandler }[];
  private processing: number;
  private processingLimit: number;

  constructor(_processingLimit: number) {
    this.queue = [];
    this.processing = 0;
    this.processingLimit = _processingLimit;
  }

  private async processNext(): Promise<void> {
    if (this.processing > this.processingLimit || this.queue.length === 0) {
      return;
    }

    this.processing++;
    const { event, handler } = this.queue.shift()!;
    await handler(event);
    this.processing--;

    this.processNext();
  }

  public add(event: TransferEvent, handler: EventHandler): void {
    this.queue.push({ event, handler });
    this.processNext();
  }
}
