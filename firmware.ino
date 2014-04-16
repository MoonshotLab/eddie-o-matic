Servo FLOOR_SELECTOR;
Servo BELL;
int pins[] = {D0, D1, D2, D3, D4, D5, D6, D7};
unsigned long lastUpdate = 0UL;


// Pass in params like 1,100
int updateState(String param)
{
  lastUpdate = millis();

  int pinNumber = param[0] - '0';
  int floorValue = param.substring(2, param.length()).toInt();

  char publishString[64];
  sprintf(publishString, "%d - %d", pinNumber, floorValue);

  FLOOR_SELECTOR.write(floorValue);
  digitalWrite(pins[pinNumber], 1);

  BELL.write(145);
  delay(1000);
  BELL.write(125);

  return 1;
}


void setup()
{
  FLOOR_SELECTOR.attach(A0);
  FLOOR_SELECTOR.write(90);
  BELL.attach(A4);
  BELL.write(125);

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

    FLOOR_SELECTOR.write(90);
  }
}
