export default interface Root {
  thread0: Thread0
  thread1: Thread1
  thread2: Thread2
  thread3: Thread3
  thread4: Thread4
  thread5: Thread5
  thread6: Thread6
  thread7: Thread7
  time: Time9
  total: Total
  num: Num
}

export interface Thread0 {
  num: Num
  recursion: Recursion
  requestlist: Requestlist
  tcpusage: number
}

export interface Num {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion {
  time: Time
}

export interface Time {
  avg: number
  median: number
}

export interface Requestlist {
  avg: number
  current: Current
  exceeded: number
  max: number
  overwritten: number
}

export interface Current {
  all: number
  user: number
}

export interface Thread1 {
  num: Num2
  recursion: Recursion2
  requestlist: Requestlist2
  tcpusage: number
}

export interface Num2 {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion2 {
  time: Time2
}

export interface Time2 {
  avg: number
  median: number
}

export interface Requestlist2 {
  avg: number
  current: Current2
  exceeded: number
  max: number
  overwritten: number
}

export interface Current2 {
  all: number
  user: number
}

export interface Thread2 {
  num: Num3
  recursion: Recursion3
  requestlist: Requestlist3
  tcpusage: number
}

export interface Num3 {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion3 {
  time: Time3
}

export interface Time3 {
  avg: number
  median: number
}

export interface Requestlist3 {
  avg: number
  current: Current3
  exceeded: number
  max: number
  overwritten: number
}

export interface Current3 {
  all: number
  user: number
}

export interface Thread3 {
  num: Num4
  recursion: Recursion4
  requestlist: Requestlist4
  tcpusage: number
}

export interface Num4 {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion4 {
  time: Time4
}

export interface Time4 {
  avg: number
  median: number
}

export interface Requestlist4 {
  avg: number
  current: Current4
  exceeded: number
  max: number
  overwritten: number
}

export interface Current4 {
  all: number
  user: number
}

export interface Thread4 {
  num: Num5
  recursion: Recursion5
  requestlist: Requestlist5
  tcpusage: number
}

export interface Num5 {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion5 {
  time: Time5
}

export interface Time5 {
  avg: number
  median: number
}

export interface Requestlist5 {
  avg: number
  current: Current5
  exceeded: number
  max: number
  overwritten: number
}

export interface Current5 {
  all: number
  user: number
}

export interface Thread5 {
  num: Num6
  recursion: Recursion6
  requestlist: Requestlist6
  tcpusage: number
}

export interface Num6 {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion6 {
  time: Time6
}

export interface Time6 {
  avg: number
  median: number
}

export interface Requestlist6 {
  avg: number
  current: Current6
  exceeded: number
  max: number
  overwritten: number
}

export interface Current6 {
  all: number
  user: number
}

export interface Thread6 {
  num: Num7
  recursion: Recursion7
  requestlist: Requestlist7
  tcpusage: number
}

export interface Num7 {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion7 {
  time: Time7
}

export interface Time7 {
  avg: number
  median: number
}

export interface Requestlist7 {
  avg: number
  current: Current7
  exceeded: number
  max: number
  overwritten: number
}

export interface Current7 {
  all: number
  user: number
}

export interface Thread7 {
  num: Num8
  recursion: Recursion8
  requestlist: Requestlist8
  tcpusage: number
}

export interface Num8 {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion8 {
  time: Time8
}

export interface Time8 {
  avg: number
  median: number
}

export interface Requestlist8 {
  avg: number
  current: Current8
  exceeded: number
  max: number
  overwritten: number
}

export interface Current8 {
  all: number
  user: number
}

export interface Time9 {
  elapsed: number
  now: number
  up: number
}

export interface Total {
  num: Num9
  recursion: Recursion9
  requestlist: Requestlist9
  tcpusage: number
}

export interface Num9 {
  cachehits: number
  cachemiss: number
  expired: number
  prefetch: number
  queries: number
  queries_ip_ratelimited: number
  recursivereplies: number
}

export interface Recursion9 {
  time: Time10
}

export interface Time10 {
  avg: number
  median: number
}

export interface Requestlist9 {
  avg: number
  current: Current9
  exceeded: number
  max: number
  overwritten: number
}

export interface Current9 {
  all: number
  user: number
}

export interface Num {
  rpz: {
    action: {
      "rpz-cname-override": number
    }
  }
}