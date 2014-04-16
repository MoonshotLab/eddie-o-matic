Servo FLOOR_SELECTOR;
Servo BELL;
int pins[] = {D0, D1, D2, D3, D4, D5};


// Pass in params like 1,100
int updateState(String param)
{
  int pinNumber = param[0] - '0';
  int location = param.substring(2, param.length()).toInt();

  char publishString[64];
  sprintf(publishString, "%d - %d", pinNumber, location);

  BELL.write(145);
  delay(1000);
  BELL.write(125);
  delay(1000);

  digitalWrite(pins[pinNumber], 1);
  FLOOR_SELECTOR.write(location);

  delay(5000);

  // Reset
  for(int i=0; i<6; i++){
    digitalWrite(pins[i], 0);
  }
  FLOOR_SELECTOR.write(90);

  return 1;
}


void setup()
{
  FLOOR_SELECTOR.attach(A0);
  BELL.attach(A4);

  FLOOR_SELECTOR.write(90);

  for(int i=0; i<6; i++){
    pinMode(pins[i], OUTPUT);
    digitalWrite(pins[i], 1);
  }

  delay(3000);

  for(int i=0; i<6; i++){
    digitalWrite(pins[i], 0);
  }

  Spark.function("updateState", updateState);
}
