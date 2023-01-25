const grpc = require('@grpc/grpc-js');
const { CalculatorServiceClient } = require('../proto/calculator_grpc_pb');
const { SumRequest } = require('../proto/sum_pb');
const { PrimeRequest } = require('../proto/prime_pb');

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

function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new CalculatorServiceClient('localhost:50051', creds);

  // doSum(client);
  doPrime(client);

  client.close();
}
main();