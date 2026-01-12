import MagnifyingGlass from './components/MagnifyGlass';
import { Searchbox } from './components/Searchbox';
import { Navbar } from './components/searchBoxControl';
import { LiquidNavbar } from './FilterTest';

function App() {
  const bgImage = '/pic.jpg';

  return (
    <>
      <div
        className=" w-full min-h-screen  bg-black/90  bg-center p-12 "
        // style={{ backgroundImage: `url(${bgImage})` }}
        >
        {/* <MagnifyingGlass /> */}
        {/* <Navbar /> */}
        <p className='text-6xl text-white'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora natus fugiat quisquam iusto sit, consequuntur incidunt ad expedita, animi beatae harum explicabo a maxime, nesciunt eaque reprehenderit eos vero vel. Alias, doloremque asperiores inventore, numquam consectetur quo culpa minus ea, repudiandae provident minima! Deleniti amet provident aperiam, ullam corporis cum?</p>
        <LiquidNavbar/>
      </div>
      <div
        className="relative h-screen w-full bg-contain mx-auto flex justify-center bg-center p-12 "
        style={{ backgroundImage: 'url(/nature.jpg)' }}>
        <Searchbox className="fixe" />
        {/* <LiquidNavbar/> */}
      </div>
    </>
  );
}

export default App;
