const grpc = require('@grpc/grpc-js');
const addr = 'localhost:50051';
const { GreetServiceService } = require('../proto/greet_grpc_pb');
const serviceImple = require('./service_imple');

function cleanup(server) {
  console.log('Cleanup');
  if (server) {
    server.forceShutdown();
  }
}

function main() {
  const server = new grpc.Server();
  const creds = grpc.ServerCredentials.createInsecure();

  process.on('SIGINT', () => {
    console.log('Caught interupt signal');
    cleanup(server);
  })

  server.addService(GreetServiceService, serviceImple);

  server.bindAsync(addr, creds, (err, _) => {
    if (err) {
      return cleanup(server);
    }

    server.start();
  })

  console.log(`Listening on:  ${addr}`);
}

main();