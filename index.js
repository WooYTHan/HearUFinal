
navigator.mediaDevices.getUserMedia({ audio: true, video: true })
.then(function(stream) {
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  microphone = audioContext.createMediaStreamSource(stream);
  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);
  javascriptNode.onaudioprocess = function() {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var values = 0;

      var length = array.length;
      for (var i = 0; i < length; i++) {
        values += (array[i]);
      }

      var average = values / length;
    
    colorPids(Math.round(average))
    //console.log(Math.round(average));
    // colorPids(average);
  }
  })
  .catch(function(err) {
    /* handle the error */
});

function colorPids(vol) {
  let all_pids = $('.pid');
  let amout_of_pids = Math.round(vol/10);
  let elem_range = all_pids.slice(0, amout_of_pids)
  for (var i = 0; i < all_pids.length; i++) {
    all_pids[i].style.backgroundColor="rgba(17, 46, 148, 0.05)";
  }
  for (var i = 0; i < elem_range.length; i++) {

    // console.log(elem_range[i]);
    elem_range[i].style.backgroundColor="#ffd000";
  }
}

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    console.log(audioChunks);

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
          frequency: 220,
          peak: 10
     });
      audio.addEventListener("canplaythrough", function() {
      })
      var acousticGuitar = new Pizzicato.Sound(audioUrl, function() {
        acousticGuitar.play();
        const time = Math.round(acousticGuitar.sourceNode.buffer.duration);
        setTimeout(function() {
            $("#bigText").text("This is what I hear:");
            acousticGuitar.addEffect(lowPassFilter);
            acousticGuitar.play();
        }, time * 1000);

        setTimeout(function() {
            $(".pids-wrapper").fadeOut();
            $(".main").html("<h1 id='action'>This is what I hear:</h1><h1 id='bigText' >For <span class='drop'>Ch</span>ri<span class='drop'>st</span>ma<span class='drop'>s</span>, <span class='drop'>th</span>ere i<span class='drop'>s</span> no way your dad wan<span class='drop'>ts</span> gra<span class='drop'>y p</span>an<span class='drop'>ts</span></h1>");
            $('.drop').animate({ opacity: 0 },2500);
            $('.drop').animate({ opacity: 0.4 },4500);
        }, time * 1000 * 2);
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
  $("#action").text("Try to Speak Out");
  $("#bigText").text('"For Christmas, there is no way your dad wants gray pants"');

  recorder.start();
}

const endAction = async () => {
  $("#action").text("");
  $("#bigText").text("This is what you said:");
  const audio = await recorder.stop();
  
}


if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
    'I am ready': handleAction,
    'For christmas *tag': endAction

  };

  // Add our commands to annyang
  annyang.addCommands(commands);
  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}

