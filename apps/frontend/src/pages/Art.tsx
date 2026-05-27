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

function App() {
  return (
    <Window>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
        <img
          src="../public/game_banner.png"
          className="max-h-25 mx-auto mb-2 block select-none"
        ></img>
        <Card className="flex w-full flex-col items-center text-center">
          <div className="grid grid-cols-3 gap-3 place-items-center">
            <Button className="h-20 w-20" color="red">
              #ff9191
            </Button>
            <Button className="h-20 w-20" color="orange">
              #ffc780
            </Button>
            <Button className="h-20 w-20" color="yellow">
              #fff190
            </Button>
            <Button className="h-20 w-20" color="green">
              #a9ffb3
            </Button>
            <Button className="h-20 w-20" color="blue">
              #6dd8fe
            </Button>
            <Button className="h-20 w-20" color="purple">
              #d791ff
            </Button>
            <Button className="h-20 w-20" color="pink">
              #ffbfff
            </Button>
            <Button className="h-20 w-20" color="violet">
              #a9a3ff
            </Button>
            <Button className="h-20 w-20" color="white">
              #f8f8f8
            </Button>
          </div>
          <Button buttonClassName="mt-4" className="w-66">
            Default
          </Button>
        </Card>
        <Card className="flex w-full flex-col items-center text-center">
          <nav className="flex flex-col items-center gap-10">
            <Anchor size="small">grey</Anchor>
            <Anchor color="red">red</Anchor>
            <Anchor color="orange" size="large">
              orange
            </Anchor>
            <Anchor color="yellow">yellow</Anchor>
            <Anchor color="green">green</Anchor>
            <Anchor color="blue">blue</Anchor>
            <Anchor color="purple">purple</Anchor>
            <Anchor color="pink">pink</Anchor>
            <Anchor color="violet">violet</Anchor>
            <Anchor color="white">white</Anchor>
          </nav>
        </Card>
        <Card className="flex w-full flex-col items-center text-center">
          <Button className="w-20 h-20" borderRadius="rounded-full">
            <img src="../public/game_icon.png" className="scale-120" />
          </Button>
          <Button buttonClassName="mt-4" className="">
            <img src="../public/game_icon.png" className="w-16 h-16" />
            Default
          </Button>
        </Card>
        <Card className="flex w-full flex-col items-center text-center">
          <Input placeholder="username" className="w-64"></Input>
          <Input
            type="password"
            placeholder="password"
            className="mt-4 w-64"
          ></Input>
          <Button buttonClassName="mt-4" className="w-64" size="small">
            Login
          </Button>
          <Button buttonClassName="mt-4" className="w-64">
            Register
          </Button>
          <Button
            buttonClassName="mt-4"
            className="w-64"
            color="red"
            size="small"
          >
            Refuse
          </Button>
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
      </div>
    </Window>
  );
}

export default App;
