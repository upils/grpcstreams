import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { HardwareMonitorClient } from './proto/service_grpc_web_pb';
import { EmptyRequest } from './proto/service_pb';

// Create a new HardwareMonitorClient like this, correct the ADDR and Port used
// If you use something else.
var client = new HardwareMonitorClient('http://localhost:8080');

function App() {
  const [CPU, setCPU] = useState(0);
  const [MemoryFree, setMemoryFree] = useState(0);
  const [MemoryUsed, setMemoryUsed] = useState(0);

  const getStats = () => {
    // Create our EmptyRequest that we will use to start the stream;
    var request = new EmptyRequest();
    // Dont worry about the empty Metadata for now, thats covered in another article :)
    console.log("Start stream")
    var stream = client.monitor(request, {});
    // Start listening on the data event, this is the event that is used to notify that new data arrives
    stream.on('data', function (response) {
      console.log("Received a response")
      // Convert Response to Object
      var stats = response.toObject();
      // Set our variable values
      setCPU(stats.cpu);
      setMemoryFree(stats.memoryFree);
      setMemoryUsed(stats.memoryUsed);
    });
    stream.on("err", function(err) {
            console.log("err: ", err);
    });

    stream.on('end', function () {
      console.log("end of stream")
    });
  }
  // useEffect will make this trigger on component start
  // Give an empty array as a second param to prevent running multiple times
  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="App">
      <p>CPU : {CPU}</p>
      <p>MemoryFree: {MemoryFree}</p>
      <p>MemoryUsed: {MemoryUsed}</p>
    </div>
  );
}

export default App;
