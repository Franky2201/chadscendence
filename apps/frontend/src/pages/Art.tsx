import {
  Anchor,
  Button,
  Card,
  Checkbox,
  Input,
  Select,
  Toggle,
  Window,
} from '../components/ui';
import { useState } from 'react';
import type { ItemColor } from '../components/ui/unified';

function App() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [gridColor, setGridColor] = useState<ItemColor>('grey');
  const [gridAngle, setGridAngle] = useState(45);
  const [gridSize, setGridSize] = useState(20);
  const [gridSpeed, setGridSpeed] = useState(4);

  function toggleBoolean() {
    setIsDisabled((previousValue) => !previousValue);
  }

  return (
    <Window
      color={gridColor}
      angle={gridAngle}
      size={gridSize}
      speed={gridSpeed}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
        <img
          src="../public/game_banner.png"
          className="max-h-25 mx-auto mb-2 block select-none"
        ></img>
        <Card className="flex w-full flex-col items-center text-center">
          <div className="grid grid-cols-3 gap-3 place-items-center">
            <Button
              className="h-20 w-20"
              color="red"
              onClick={() => {
                setGridColor('red');
                setGridAngle(135);
                setGridSize(30);
                setGridSpeed(2);
              }}
            >
              Red
            </Button>
            <Button
              className="h-20 w-20"
              color="orange"
              onClick={() => {
                setGridColor('orange');
                setGridAngle(90);
                setGridSize(40);
                setGridSpeed(1);
              }}
            >
              Orange
            </Button>
            <Button
              className="h-20 w-20"
              color="yellow"
              onClick={() => {
                setGridColor('yellow');
                setGridAngle(135);
                setGridSize(30);
                setGridSpeed(2);
              }}
            >
              Yellow
            </Button>
            <Button
              className="h-20 w-20"
              color="green"
              onClick={() => {
                setGridColor('green');
                setGridAngle(190);
                setGridSize(10);
                setGridSpeed(1);
              }}
            >
              Green
            </Button>
            <Button
              className="h-20 w-20"
              color="blue"
              onClick={() => {
                setGridColor('blue');
                setGridAngle(135);
                setGridSize(30);
                setGridSpeed(2);
              }}
            >
              Blue
            </Button>
            <Button
              className="h-20 w-20"
              color="purple"
              onClick={() => {
                setGridColor('purple');
                setGridAngle(135);
                setGridSize(30);
                setGridSpeed(2);
              }}
            >
              Purple
            </Button>
            <Button
              className="h-20 w-20"
              color="pink"
              onClick={() => {
                setGridColor('pink');
                setGridAngle(135);
                setGridSize(30);
                setGridSpeed(2);
              }}
            >
              Pink
            </Button>
            <Button
              className="h-20 w-20"
              color="violet"
              onClick={() => {
                setGridColor('violet');
                setGridAngle(135);
                setGridSize(30);
                setGridSpeed(2);
              }}
            >
              Violet
            </Button>
            <Button
              className="h-20 w-20"
              color="white"
              onClick={() => {
                setGridColor('white');
                setGridAngle(135);
                setGridSize(30);
                setGridSpeed(2);
              }}
            >
              White
            </Button>
          </div>
          <Button
            className="w-66 mt-4"
            onClick={() => {
              setGridColor('grey');
              setGridAngle(45);
              setGridSize(20);
              setGridSpeed(4);
            }}
          >
            Default
          </Button>
        </Card>
        <Card className="flex w-full flex-col items-center text-center">
          <nav className="flex flex-col items-center gap-4">
            <Anchor>grey</Anchor>
            <Anchor color="red">red</Anchor>
            <Anchor color="orange">orange</Anchor>
            <Anchor color="yellow">yellow</Anchor>
            <Anchor color="green">green</Anchor>
            <Anchor color="blue">blue</Anchor>
            <Anchor color="purple">purple</Anchor>
            <Anchor color="pink">pink</Anchor>
            <Anchor color="violet">violet</Anchor>
            <Anchor color="white">white</Anchor>
          </nav>
        </Card>
        <Card className="flex w-full flex-col items-center">
          <Button className="w-20 h-20" borderRadius="rounded-full">
            <img src="../public/game_icon.png" className="h-16 w-16" />
          </Button>
          <Button className="mt-4 mb-4 w-64 h-20" size="large">
            <img src="../public/game_icon.png" className="h-16 w-16" />
            Default
          </Button>
        </Card>
        <Card className="flex w-full flex-col items-center text-center">
          <div className="flex">
            <div className="flex flex-col gap-2 mr-2">
              <Input
                placeholder="nickname"
                className="w-30"
                size="small"
              ></Input>
              <Input placeholder="username" className="w-30"></Input>
              <Input
                type="password"
                placeholder="password"
                className="w-30"
                size="large"
                color="red"
              ></Input>
            </div>
            <div className="flex flex-col ml-2">
              <Button className="w-30" size="small">
                Login
              </Button>
              <Button className="w-30 mt-1">Register</Button>
              <Button className="w-30 mt-1" color="red" size="large">
                Refuse
              </Button>
            </div>
          </div>
          <Checkbox label="CheckBox" className="w-64 mt-4" />
          <Toggle label="Toggle" color="red" className="mt-4" size="small" />
          <Toggle label="Toggle" color="green" className="mt-4" />
          <Toggle label="Toggle" color="purple" className="mt-4" size="large" />
          <Select className="mt-4 w-64">
            <option value="Hello1">Hello1</option>
            <option value="Hello2">Hello2</option>
            <option value="Hello3">Hello3</option>
          </Select>
        </Card>
        <Card className="flex w-full flex-col items-center text-center">
          <div className="flex flex-col gap-3">
            <Input type="text" placeholder="Username ..." />
            <div className="flex gap-3">
              <Button color="violet" className="w-25">
                Inviter
              </Button>
              <Button color="grey" className="w-25">
                Share link
              </Button>
            </div>
          </div>
        </Card>
        <Card className="flex w-full justify-center items-center gap-4">
          <Button
            size="large"
            color="blue"
            onClick={toggleBoolean}
            className="w-40"
          >
            Disable button
          </Button>
          <Button
            size="large"
            color="green"
            disabled={isDisabled}
            className="w-40"
          >
            Button
          </Button>
        </Card>
      </div>
    </Window>
  );
}

export default App;
