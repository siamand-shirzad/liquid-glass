import { Searchbox } from './components/SearchBox';

function App() {
  const bgImage = '/pic.jpg'; 

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-fixed bg-center p-12 flex flex-col items-center overflow-x-hidden" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Searchbox className='fixed bottom-50'/>
    </div>
  );
}

export default App;