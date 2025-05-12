new p5();

let lines;
let font;
let icon;
let texts = [];
let loaded = false;
let searchW = 1000;
let searchH = 70;
let defaulttext = "search meeeee"
let searchtext = "";
let activate = false;
let results = [];
let resultW = 0;
let resultH = 0;
let gap = 0;
let startx = 50;
let starty = 200;
let convoscreen = false;
let focus = -1;
let convoH = 70;
let convocoord = [];
let beforecount = 1;
let aftercount = 1;
let backD = 180;
let resultcoord = [];
let scroll = 0;
let passwordfilled = false;
let password = "wookie";

function preload(){
  lines = loadStrings('texts.txt');
  font = loadFont('munro.ttf');
  icon = loadImage('searchicon.png');
  left = loadImage('left.png');
}

function setup() {
  width = windowWidth;
  height = windowHeight;
  gap = width/80;
  resultW = (width-100-5*gap)/6;
  resultH = (height-200-8*gap)/8;

  createCanvas(windowWidth, windowHeight);
  frameRate(60);
}

function mousePressed(){
  if(!passwordfilled){
    if(width/2+searchW/2-searchH/2-(searchH-20)/2 < mouseX && mouseX < width/2+searchW/2-searchH/2+(searchH-20)/2 && height/2+60-(searchH-20)/2 < mouseY && mouseY < height/2+60+(searchH-20)/2){
      if(searchtext == password){
        passwordfilled = true;
        searchtext = defaulttext;
      }
    }
  }
  else{
    if(width-200-backD/2 < mouseX && mouseX < width-200+backD/2 && height-200-backD/2 < mouseY && mouseY < height-200+backD/2){
      // console.log("hi");
      // console.log(convoscreen);
      if(convoscreen){
        activate = true;
        focus = -1;
        convoscreen = false;
      }
      else{
        activate = false;
        searchtext = defaulttext;
        results = [];
        scroll = 0;
      }
    }
    else{
      if(width/2+searchW/2-searchH/2-(searchH-20)/2 < mouseX && mouseX < width/2+searchW/2-searchH/2+(searchH-20)/2 && height/2+60-(searchH-20)/2 < mouseY && mouseY < height/2+60+(searchH-20)/2){
        activate = true;

        results = [];
        for(let i = 0; i < texts.length; i++){
          if(texts[i][0].toLowerCase().includes(searchtext) && !results.includes(i)){
            results.push(i);
          }
        }
      }
      else if(results != [] && focus == -1){
        let rows = Math.floor(results.length/6);
        let cols = results.length%6;
        for(let i = 0; i < rows; i++){
          for(let j = 0; j < 6*(i != rows-1 || cols == 0)+cols*!(i != rows-1 || cols == 0); j++){
            if(startx + (resultW+gap)*j < mouseX && mouseX < startx + (resultW+gap)*j + resultW && starty + (resultH+gap)*i + scroll < mouseY && mouseY < starty + (resultH+gap)*i + resultH + scroll){
              // console.log(texts[results[i*6+j]]);
              convoscreen = true;
              focus = results[i*6+j];

              convocoord[focus] = height/2;
              for(let k = 0; k < focus; k++){
                convocoord[k] = convocoord[focus] - (focus-k)*(convoH+gap);
              }
              for(let k = focus+1; k < texts.length; k++){
                convocoord[k] = convocoord[focus] + (k-focus)*(convoH+gap);
              }
            }
          }
        }
        activate = false;
      }
    }
  }
}

function isAlphanumeric(str) {
  return str.length == 1 && /^[a-zA-Z0-9]+$/.test(str);
}

function keyPressed(){
  if(isAlphanumeric(key) || key == " "){
    if(searchtext == defaulttext){
      searchtext = "";
    }
    searchtext += key;
  }
  else if(key == "Backspace" && searchtext.length != 0 && searchtext != defaulttext){
    searchtext = searchtext.substring(0, searchtext.length-1);
    if(searchtext.length == 0){
      searchtext = defaulttext;
    }
  }
}

function mouseWheel(event){
  for(let i = 0; i < texts.length; i++){
    convocoord[i] -= event.delta;
  }
  if((starty + (resultH+gap)*(Math.floor(results.length/6)-1) + resultH + scroll > height || event.delta < 0) && (starty + scroll <= starty || event.delta > 0)){
    scroll -= event.delta;
  }

  if(starty + (resultH+gap)*(Math.floor(results.length/6)-1) + resultH + scroll < height){
    scroll = height - (starty + (resultH+gap)*(Math.floor(results.length/6)-1) + resultH) - 50;
  }
  
  if(starty + scroll > starty){
    scroll = 0;
  }
  // console.log("a;sldkfja " + convocoord[focus]);
  // console.log(convocoord[focus+aftercount]);
  // console.log(convocoord[focus-beforecount]);
}

function draw() {
  background('#bee3ba');

  if(!passwordfilled){
    push();
    textFont(font);
    textSize(100);
    textAlign(CENTER, CENTER);
    text('enter password...', width/2, height/2-60);
    pop();

    rect(width/2-searchW/2, height/2-searchH/2+60, searchW, searchH);
    
    push();
    textFont(font);
    textSize(30);
    textAlign(LEFT);
    text(searchtext, width/2-searchW/2+20, height/2+67.5);
    pop();

    push();
    fill("#dddddd");
    rect(width/2+searchW/2-searchH+10, height/2-searchH/2+70, searchH-20, searchH-20);
    pop();

    push();
    textFont(font);
    textSize(30);
    textAlign(CENTER, CENTER);
    text("go",width/2+searchW/2-searchH/2, height/2+55);
    pop();
  }
  else{
    if(lines.length != 0 && !loaded){
      amt = 0;
      while(amt < lines.length-1){
        msg = ""
        lc = 0;
        while(true){
          line = lines[amt];
          // console.log(line);
          amt++;
          idx = -1;
          if(line.includes("Phone Number:")){
            idx = line.indexOf("Phone Number:")
            if(lc == 0){
              msg = line.substring(6,idx-1);
            }
            else{
              msg = line.substring(0,idx-1);
            }
            break
          }
          else{
            msg += line;
          }
          lc++;
        }
        idx2 = line.indexOf("Is From Me:")
        from_me = line[idx2+12];

        idx3 = line.indexOf("Date:")
        date = line.substring(idx3+6);

        texts.push([msg, from_me, date]);
      }

      // console.log(texts);
      loaded = true;
    }

    // console.log(texts.length);
    // console.log(activate);
    // console.log(convoscreen);
    if(texts.length != 0 && !activate){
      // console.log(";alksjdfa");
      background('#bee3ba');
      push();
      textFont(font);
      textSize(100);
      textAlign(CENTER, CENTER);
      text('my loving messages <3', width/2, height/2-60);
      pop();

      rect(width/2-searchW/2, height/2-searchH/2+60, searchW, searchH);
      
      push();
      textFont(font);
      textSize(30);
      if(searchtext == defaulttext){
        fill("#a9a9a9");
      }
      else{
        fill("#000000");
      }
      textAlign(LEFT);
      text(searchtext, width/2-searchW/2+20, height/2+67.5);
      pop();

      push();
      fill("#dddddd");
      rect(width/2+searchW/2-searchH+10, height/2-searchH/2+70, searchH-20, searchH-20);
      pop();

      push();
      icon.resize(30,30);
      imageMode(CENTER, CENTER);
      image(icon, width/2+searchW/2-searchH/2, height/2+60);
      pop();
    }

    if(activate){
      background('#bee3ba');
      push();
      textFont(font);
      textSize(100);
      textAlign(LEFT, TOP);
      text('search results (' + results.length + ')...', 50, 50);
      pop();

      // console.log(results);
      // console.log(results.length);
      // console.log(results.length/6);
      let rows = Math.floor(results.length/6);
      let cols = results.length%6;
      for(let i = 0; i < rows; i++){
        for(let j = 0; j < 6*(i != rows-1 || cols == 0)+cols*!(i != rows-1 || cols == 0); j++){
          rect(startx + (resultW+gap)*j, starty + (resultH+gap)*i+scroll, resultW, resultH);
          push();
          textFont(font);
          textSize(20);
          textAlign(LEFT, TOP);
          if(texts[results[i*6+j]][1] == "1"){
            text("joseph: " + texts[results[i*6+j]][0], startx + (resultW+gap)*j+20, starty + (resultH+gap)*i+20+scroll, resultW-40, resultH-40);
          }
          else{
            text("jade: " + texts[results[i*6+j]][0], startx + (resultW+gap)*j+20, starty + (resultH+gap)*i+20+scroll, resultW-40, resultH-40);
          }
          pop();

          push();
          textFont(font);
          textSize(17);
          textAlign(RIGHT, BOTTOM);
          text(texts[results[i*6+j]][2], startx + (resultW+gap)*j+resultW-5, starty + (resultH+gap)*i+resultH-5+scroll);
          pop();
        }
      }

      push();
      fill("#add8e6");
      left.resize(120,120);
      circle(width-200, height-200, backD);
      imageMode(CENTER, CENTER);
      image(left,width-200, height-200);
      pop();
    }

    // console.log(height);
    // console.log(convocoord[focus+aftercount]);
    if(convocoord[focus-aftercount] < height){
      // console.log("hi");
      aftercount += 1;
    }

    if(convocoord[focus+beforecount] > 0){
      // console.log("bye");
      beforecount += 1;
    }

    if(convoscreen){
      background('#bee3ba');
      
      // console.log(beforecount);
      // console.log(aftercount);
      for(let i = Math.max(0,focus-beforecount); i < Math.min(texts.length-1,focus+aftercount); i++){
        push();
        textAlign(LEFT, CENTER);
        textSize(25);
        textFont(font);
        if(texts[i][1] == "1"){
          if(i != focus){
            fill("#dddddd");
          }
          else{
            fill("#ffd700");
          }
          rect(50, convocoord[2*focus-i]-convoH/2, width-100, convoH);
          fill("#000000");
          text("joseph: " + texts[i][0], 75, convocoord[2*focus-i]);
        }
        else{
          if(i != focus){
            fill("#ffffff");
          }
          else{
            fill("#ffd700");
          }
          rect(50, convocoord[2*focus-i]-convoH/2, width-100, convoH);
          fill("#000000");
          text("jade: " + texts[i][0], 75, convocoord[2*focus-i]);
        }
        pop();

        push();
        textAlign(RIGHT, CENTER);
        textSize(25);
        textFont(font);
        text(texts[i][2], width-75, convocoord[2*focus-i]);
        pop();
      }

      push();
      fill("#add8e6");
      left.resize(120,120);
      circle(width-200, height-200, backD);
      imageMode(CENTER, CENTER);
      image(left,width-200, height-200);
      pop();
    }
  }
}
