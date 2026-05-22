import {
  Button,
  Card,
  Checkbox,
  Input,
  Select,
  Window,
} from '../components/ui';

function App() {
  return (
    <Window>
      <div className="relative mb-4 flex justify-center items-center gap-2">
        <h1 className="text-5xl font-black tracking-tight bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Game Title
        </h1>
      </div>
      <Card className="max-w-100 mx-auto flex flex-col items-center text-center">
        <Input placeholder="username" className="w-64"></Input>
        <Input
          type="password"
          placeholder="password"
          className="mt-4 w-64"
        ></Input>
        <Button className="mt-4 w-64">Login</Button>
        <Button className="mt-4 w-64">Register</Button>
        <Button className="mt-4 w-64">Host a game</Button>
        <Checkbox label="CheckBox" className="mt-4 w-64" />
        <Select className="mt-4 w-64">
          <option value="Hello1">Hello1</option>
          <option value="Hello2">Hello2</option>
          <option value="Hello3">Hello3</option>
        </Select>
      </Card>
    </Window>
  );
}

export default App;
