import MagnifyingGlass from './components/MagnifyGlass';
import { Searchbox } from './components/SearchBox';
import { LiquidNavbar } from './FilterTest';

function App() {
  const bgImage = '/pic.jpg'; 

  return (
    <>
    <div
      className="relative w-full min-h-screen bg-cover  bg-center p-12 " 
      style={{ backgroundImage: `url(${bgImage})` }}
      >
    <MagnifyingGlass/>
    </div>
    <div className='relative h-screen w-full bg-contain mx-auto flex justify-center bg-center p-12 '
    style={{backgroundImage: 'url(/nature.jpg)'}} >
      <Searchbox className='fixe'/>
      <LiquidNavbar/>
    </div>
      </>
  );
}

export default App;