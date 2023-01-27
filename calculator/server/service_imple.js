const { SumResponse } = require('../proto/sum_pb');
const { PrimeResponse } = require('../proto/prime_pb');
const { AvgResponse } = require('../proto/avg_pb');
const { MaxResponse } = require('../proto/max_pb');

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

exports.avg = (call, callback) => {
  let sum = 0;
  let count = 0;

  call.on('data', (req) => {
    const n = req.getNum();
    console.log(n);
    count ++;
    sum += n;
  });
  

  call.on('end', () => {
    const avg = sum / count;
    const res = new AvgResponse().setAvg(avg);
    callback(null, res);
  })
}

exports.max = (call, callback) => {
  let max = 0;
  call.on('data', (req) => {
    const n = req.getNumber();
 
    if (n > max) {
      const res = new MaxResponse().setResult(n);
      call.write(res);
      max = n;
    }
  });

  call.on('end', () => call.end());
}