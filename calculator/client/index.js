const grpc = require('@grpc/grpc-js');
const { CalculatorServiceClient } = require('../proto/calculator_grpc_pb');
const { SumRequest } = require('../proto/sum_pb');
const { PrimeRequest } = require('../proto/prime_pb');
const { AvgRequest } = require('../proto/avg_pb');
const { MaxRequest } = require('../proto/max_pb');

function doSum(client) {
  const req = new SumRequest().setFirstNumber(1).setSecondNumber(3);

  client.sum(req, (err, res) => {
    if (err) {
      return console.log(err)
    }

    console.log(`Sum: ${res.getResult()}`)
  })
}

function doPrime(client) {
  const req = new PrimeRequest().setNumber(10);
  const call = client.prime(req);
  call.on('data', (res) => {
    console.log(res.getResult());
  })
}

function doAvg(client) {
  const inputArr = [1,2,3,4];

  const call = client.avg((err, res) => {
    if (err) {
      return console.log(err);
    }

    console.log(res.getAvg());
  });

  inputArr.map((i) => {
    return new AvgRequest().setNum(i);
  }).forEach((req) => call.write(req));

  call.end();
}

function doMax(client) {
  const input = [1, 5, 3, 6, 2, 20];

  const call = client.max();

  call.on('data', (res) => {
    console.log(res.getResult());
  });

  input.map(i => new MaxRequest().setNumber(i)).forEach(req => {
    call.write(req)
  });
  call.end();
}

function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new CalculatorServiceClient('localhost:50051', creds);

  // doSum(client);
  // doPrime(client);
  // doAvg(client);
  doMax(client);

  client.close();
}
main();