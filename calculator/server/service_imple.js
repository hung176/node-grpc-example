const { SumResponse } = require('../proto/sum_pb');
const { PrimeResponse } = require('../proto/prime_pb');

exports.sum = (call, callback) => {
  const sum = call.request.getFirstNumber() + call.request.getSecondNumber();
  const res = new SumResponse().setResult(sum)

  callback(null, res);
}

exports.prime = (call, callback) => {
  let n = call.request.getNumber();
  const res = new PrimeResponse()

  let k = 2;

  while (n > 1) {
    if (n % k === 0) {
      res.setResult(k);
      call.write(res);
      n = n / k;
    } else {
      k ++;
    }
  }
  call.end();
}
