

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
          frequency: 180,
          peak: 10
     });
      var acousticGuitar = new Pizzicato.Sound(audioUrl, function() {
    // Sound loaded!
    acousticGuitar.addEffect(lowPassFilter);
        acousticGuitar.play();
    });
          //const play = () => audio.play();
          //resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
var recorder;

const handleAction = async () => {
  recorder = await recordAudio();
  $("#action").text("Say: there is no way your dad wants gray pants");
  recorder.start();
}

const endAction = async () => {
  $("#action").text("Here is what I hear:");
  const audio = await recorder.stop();
  audio.play();
}


if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
    'I am ready': handleAction,
    'there is no way your dad wants gray pants': endAction

  };

  // Add our commands to annyang
  annyang.addCommands(commands);
  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}

