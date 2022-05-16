let move_speed = 3,
  grativy = 0.5;
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
let bird_src1 = "../images/" + window.localStorage.getItem("bird-img-a");
let bird_src2 = "../images/" + window.localStorage.getItem("bird-img-b");
let bg_music_name = window.localStorage.getItem("bg-music");
let sound_point = new Audio("../sound-effects/point.mp3");
let sound_die = new Audio("../sound-effects/die.mp3");
let bg_music = new Audio(`../sound-effects/${bg_music_name}.mp3`);
document.querySelector(".background").style.backgroundImage =
  'url("../images/' + window.localStorage.getItem("background-img") + '")';

let bird_props = bird.getBoundingClientRect();

let background = document.querySelector(".background").getBoundingClientRect();

let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

document.addEventListener("keydown", (e) => {
  if (e.key == " " && game_state != "Play") {
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block";
    bird.style.top = "40vh";
    game_state = "Play";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    play();
  }
});

function play() {
  bg_music.play();
  let bg_music_timeinterval_id = setInterval(() => {
    bg_music.play();
  }, bg_music.duration * 1000);
  let starting_time = new Date();

  function move() {
    if (game_state != "Play") return;

    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bird_props.left + bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          bird_props.top + bird_props.height > pipe_sprite_props.top
        ) {
          game_state = "End";

          let ending_time = new Date();
          let time_diff = ending_time - starting_time;
          time_diff = time_diff / 1000; // convert to seconds
          let time_duration = "";
          if (Math.floor(time_diff / 60) < 10) time_duration += "0";
          time_duration += Math.floor(time_diff / 60);
          time_duration += " : ";
          if (Math.floor(time_diff) % 60 < 10) time_duration += "0";
          time_duration += Math.floor(time_diff) % 60;

          let max_score_value = window.localStorage.getItem("max-score");
          if (Number(max_score_value) == NaN) max_score_value = Number(0);
          let max_score = Math.max(
            Number(score_val.textContent),
            Number(max_score_value)
          );
          window.localStorage.setItem("max-score", max_score);

          message.innerHTML = ` <p>Game Over</p>
                                <p>Score : ${score_val.textContent}</p>
                                <p>Total Time : ${time_duration} minutes</p>
                                <p>Highest Score : ${max_score}</p>
                                <p>Press Space to Restart</p>`;
          message.classList.add("messageStyle");
          img.style.display = "none";
          bg_music.pause();
          clearInterval(bg_music_timeinterval_id);
          sound_die.play();
          return;
        } else {
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + move_speed >= bird_props.left &&
            element.increase_score == "1"
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_sprite_props.left - move_speed + "px";
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let bird_dy = 0;
  function apply_gravity() {
    if (game_state != "Play") return;
    bird_dy = bird_dy + grativy;
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = bird_src2;
        bird_dy = -7.6;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = bird_src1;
      }
    });

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      game_state = "End";
      message.style.left = "28vw";
      window.location.reload();
      message.classList.remove("messageStyle");
      return;
    }
    bird.style.top = bird_props.top + bird_dy + "px";
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;

  let pipe_gap = 35;

  function create_pipe() {
    if (game_state != "Play") return;

    if (pipe_seperation > 115) {
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
      pipe_sprite_inv.style.left = "100vw";

      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";

      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}
