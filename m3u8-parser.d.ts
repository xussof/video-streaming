declare module 'm3u8-parser' {
  export default function parse(content: string): M3U8Parser;
  
  export interface Segment {
    uri: string;
    duration: number;
    title?: string;
  }

  export class M3U8Parser {
    segments: Array<Segment>;
    toString(): string;
  }
}
