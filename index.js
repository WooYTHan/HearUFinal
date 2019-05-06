//var handleActionStart = false;
var command2; 
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

      var average = values/length;
      colorPids(Math.round(average))
   
  }
  })
  .catch(function(err) {
    /* handle the error */
});


function colorPids(vol) {
  if(vol <= 20 && ($("#wave").attr('src') != "inactive.gif")){
    $("#wave").attr("src","inactive.gif");
  }
  else if(vol > 20 && $("#wave").attr('src') != "active.gif"){
    $("#wave").attr("src","active.gif");
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

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.addEventListener("canplaythrough", function() {
          })
      
            const play = () => audio.play();
              resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
        
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
var recorder;

const handleAction = async () => {
  //recorder = await recordAudio();
  recorder = await recordAudio();
  //$(".pids-wrapper").fadeIn();


  $(".main").html("<h1 id='animate'>SPEAKING LOUDER DOESN’T HELP</h1><h1 id='animate2'></h1><h1 id='animate3'></h1><h1 id='action2'></h1>");

  setTimeout(function(){
    $( "#animate" ).animate({
    fontSize: "1.6rem",
    opacity: 0.4,
    top: "-=120",
     }, 1000, function() {
        $("#animate2").text("WHILE SPEAKING CLEARLY AND DIRECTLY HELPS");
      });
   }, 5000);

  setTimeout(function(){
    $( "#animate" ).animate({
      opacity: 0.2,
      top: "-=50",
      paddingTop: "5%",
     }, 1000);
    $( "#animate2" ).animate({
      fontSize: "2.24rem",
      opacity: 0.4,
      top: "-=50",
      }, 1000, function() {
        $(".pids-wrapper").fadeIn();
        $("#animate3").html("<h1 id='bigText'>TRY  <span class='highlight'>SPEAK CLEARLY</span></h1>");
        $("#action2").text("For his Birthday, There is no way your dad wants gray pants");

        recorder.start();

        command2 = {
          '*tag GRAY PANTS': preEndAction2,
        }
        annyang.addCommands(command2);
      });
   }, 8000);


  //handleActionStart = true;
  //recorder.start();
}
const preEndAction2 = async () =>{
  $(".main").html("<h1 id='action'></h1><h1 id='bigText'>THIS TIME I HEARD:</h1>");

  setTimeout(function(){
    endAction2();
  }, 2000);
}

const endAction2 = async () =>{
  annyang.removeCommands('*tag GRAY PANTS');
  annyang.pause();
  const audio = await recorder.stop();
  var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
          frequency: 280,
          peak: 10
          });
  $(".main").html("<h1 id='action'>THIS TIME I HEARD:</h1><h1 id='bigText' >For <span class='drop'>H</span>I<span class='drop'>S</span> BIR<span class='drop'>TH</span>DAY, there i<span class='drop'>s</span> no way your dad wan<span class='drop1'>ts</span> gra<span class='drop'>y p</span>an<span class='drop1'>ts</span></h1>");
  $('.drop').css("opacity","0.4");
  $('.drop1').css("opacity","0.4");
  setTimeout(function(){
    $('.drop').animate({ opacity: 1 },4500);
  }, 3000);
  var acousticGuitar2 = new Pizzicato.Sound(audio.audioUrl, function() {
      acousticGuitar2.volume = 1;
      acousticGuitar2.addEffect(lowPassFilter);
      acousticGuitar2.play();
      
      const time = Math.round(acousticGuitar2.sourceNode.buffer.duration);

      setTimeout(function(){
      $(".pids-wrapper").fadeOut();
      $(".main").hide().html("<img id='screen' src='screen9.png'/>").fadeIn('slow');
      }, time * 1000 + 3000);

  });

  annyang.start();
 
}

const playVoice = async () =>{
  $(".main").html("<h1 id='action'>PLEASE <span class='highlight'>READ OUT</span></h1><h1 id='bigText' >“FOR HIS BIRTHDAY, THERE IS NO WAY YOUR DAD WANTS GRAY PANTS.”</h1><h1 id='tryAgain'></h1>")
  
  command2 = {
    '*tag GRAY PANTS': preEndAction,
  }
  annyang.addCommands(command2);

  recorder = await recordAudio();
  recorder.start();

  annyang.addCallback('result', function(phrases) {
    console.log(phrases);
    var res = phrases[0].match("gray pants");
      if(res == null && $('#tryAgain').length){
        document.getElementById("tryAgain").innerHTML = "Sorry, I can't understand.<br>Please Try Again";
        tryAgian();
       }
  });
  var tryAgian = async () =>{
    recorder = await recordAudio();
    recorder.start();
  }

}

const preEndAction = async () =>{
  annyang.removeCommands('*tag GRAY PANTS');
  annyang.pause();
  $("#action").text("");
  $("#tryAgain").text("");
  $("#bigText").text("YOU SAID");

  setTimeout(function(){
    endAction();
  },2000);
}


const endAction = async () => {
  const audio = await recorder.stop();
  var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
          frequency: 220,
          peak: 10
          });
  //audio.play();
  var acousticGuitar = new Pizzicato.Sound(audio.audioUrl, function() {
 
  acousticGuitar.play();
  const time = Math.round(acousticGuitar.sourceNode.buffer.duration);
  $(".main").html("<h1 id='action'>YOU SAID:</h1><h1 id='bigText' >FOR HIS BIRTHDAY, THERE IS NO WAY YOUR DAD WANTS GRAY PANTS.</h1>");
 
  //acousticGuitar.play();
  //console.log(acousticGuitar);

  //annyang.pause();
  setTimeout(function() {
    $("#action").text("");
    $("#bigText").text("WHAT I HEARD");
  }, time * 1000);

  setTimeout(function() {
    $(".main").html("<h1 id='action'>WHAT I HEARD:</h1><h1 id='bigText' >For <span class='drop'>H</span>I<span class='drop'>S</span> BIR<span class='drop'>TH</span>DAY, there i<span class='drop'>s</span> no way your dad wan<span class='drop'>ts</span> gra<span class='drop'>PE</span> an<span class='drop'>ts</span></h1>");
    $('.drop').animate({ opacity: 0 },2500);
    $('.drop').animate({ opacity: 0.4 },4500);
    var acousticGuitar2 = new Pizzicato.Sound(audio.audioUrl, function() {
      acousticGuitar2.volume = 1;
      acousticGuitar2.addEffect(lowPassFilter);
      acousticGuitar2.play();
    });
      }, time * 1000 + 3000);
   
   setTimeout(function(){
   $(".pids-wrapper").fadeOut();
   $(".main").hide().html("<img id='screen' src='screen1.png'/>").fadeIn('slow');
   }, time * 1000 + 10000 + 7000);

   setTimeout(function(){
   $(".main").hide().html("<img id='screen' src='screen2.png'/>").fadeIn('slow');
   }, time * 1000 + 10000 + 16000);

   setTimeout(function(){
   $(".main").hide().html("<img id='screen' src='screen3.png'/>").fadeIn('slow');
   }, time * 1000 + 10000 + 24000);

   setTimeout(function(){
   $(".main").hide().html("<img id='screen' src='screen4.png'/>").fadeIn('slow');
   annyang.start();
   }, time * 1000 + 10000 + 32000);
  
  });
      
}

if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
    'sure': playVoice,
    'yes': handleAction,
    'repeat': playVoice,
  };
  
  // Add our commands to annyang
  annyang.addCommands(commands);
  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}


