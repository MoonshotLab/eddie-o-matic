Servo FLOOR_SELECTOR;
int pins[] = {D0, D1, D2, D3, D4, D5, D6, D7};
unsigned long lastUpdate = 0UL;


// Pass in params like 1,100
int updateState(String param)
{
  lastUpdate = millis();

  int pinNumber = param.charAt(0);
  int floorValue = param.substring(2, param.length()).toInt();

  FLOOR_SELECTOR.write(floorValue);
  digitalWrite(pins[pinNumber], 1);

  return 1;
}


void setup()
{
  FLOOR_SELECTOR.attach(A0);

  for(int i=0; i<8; i++){
    pinMode(pins[i], OUTPUT);
  }

  Spark.function("updateState", updateState);
}

void loop(){
  unsigned long now = millis();

  if(now-lastUpdate > 15000){
    for(int i=0; i<8; i++){
      digitalWrite(pins[i], 0);
    }

    FLOOR_SELECTOR.write(0);
  }
}
