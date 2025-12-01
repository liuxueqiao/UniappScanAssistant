declare namespace Http {
  type BaseResponse<T> = Promise<{
    msg: string;
    code: number;
    data?: T;
  }>;
}

// declare namespace GetTest {
//   interface params {
//     a: number
//   }
//   interface data {
//     name: string
//     age: number
//   }
// }

// declare namespace PostTest {
//   interface params {
//     a: number
//   }
//   interface data {
//     val: string
//   }
// }
