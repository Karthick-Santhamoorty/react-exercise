import { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react'
import AnimalApi from '../models/animals'
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";

const AnimalsList = () => {

  const [animalList, setAnimalList] = useState<{ value: string, id: number }[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredAnimalList, setFilteredAnimalList] = useState<{ value: string, id: number }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const animalListTotalPages = Math.ceil(animalList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const listToRender = animalList.slice(startIndex, endIndex);
  const filteredListToRender = filteredAnimalList.slice(startIndex, endIndex);
  const filteredTotalPages = Math.ceil(filteredAnimalList.length / itemsPerPage);
  const totalPages = filteredAnimalList.length ? filteredTotalPages : animalListTotalPages;

  useEffect(() => {
    const newList: { value: string; id: number; }[] = [];
    AnimalApi.getAnimal().forEach((animal: string, index: number) => {
      newList.push({value: animal, id: index});
    })
    setAnimalList(newList);
  }, []);



  const addNewAnimal = () => {
    const isExisting = animalList.some(list => list.value.toLowerCase() === inputValue.toLowerCase());
    if(isExisting) {
      setErrorMsg(`${inputValue} Already Exists`);
    } else if (inputValue) {
      setAnimalList([{ value: inputValue, id: Date.now() }, ...animalList]);
      setInputValue("");
      setFilteredAnimalList([]);
      setCurrentPage(1);
      setErrorMsg("");
    }
  }

  const removeAnimal = (id: number) => {
    const newList = animalList.filter(list => list.id !== id);
    setAnimalList(newList);
    if(filteredAnimalList.length) {
      const newFilterdList = filteredAnimalList.filter(list => list.id !== id);
      setFilteredAnimalList(newFilterdList);
      if(!newFilterdList.length) {
        setInputValue("");
      }
    }
  }

  const filterAnimal = () => {
    const newList = animalList.filter(list => list.value.toLowerCase().includes(inputValue.toLowerCase()));
    if(newList.length) {
      setCurrentPage(1);
    } else {
      setErrorMsg(`${inputValue} Not Found`);
    }
    setFilteredAnimalList(newList);
  }

  return (
    <div className='flex flex-col'>
      <h1>Animal List</h1>
      <div className=' bg-gray-200 border rounded mt-10 mx-auto'>
        <div className='mt-3 border-b p-4 border-b-black px-6'>
          <div className='flex items-center justify-between'>
            <input
              className='text-black min-h-8 w-60 rounded px-2'
              type='text'
              value={inputValue}
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                setInputValue(e.target.value);
                setErrorMsg("");
              }}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && addNewAnimal()}
              placeholder='Enter animal name'
            />
            <div className='flex'>
              <FaPlusCircle size="1.5rem" className="cursor-pointer mx-2" onClick={addNewAnimal} />
              {filteredAnimalList.length ?
                <FaFilterCircleXmark size="1.5rem" className={`cursor-pointer mx-2`} onClick={() => {
                  setFilteredAnimalList([]);
                  setInputValue("");
                }} />
                : <FaFilter size="1.5rem" className={`mx-2 ${inputValue ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`} onClick={() => filterAnimal()} />
              }
            </div>
          </div>
          {errorMsg && <p className='text-red-500 text-left mt-1'>{errorMsg}</p> }
        </div>
        <div className='mt-2'>
        {
          (filteredAnimalList.length ? filteredListToRender : listToRender).map((item) => (
            <div className={`py-2 justify-between flex border-b border-b-black px-6`} key={item.id}>
              <div className='capitalize'>{item.value}</div>
              <FaTrashAlt size="1.5rem" className="cursor-pointer" onClick={() => removeAnimal(item.id)} color='#f87171' />
            </div>
          ))
        }
        </div>
        <div className='border-t border-t-black text-right py-2  px-6'>
          <span className='text-gray-700'>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className={`p-2 ml-4 bg-gray-600 text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed': 'hover:bg-gray-700 text-white focus:bg-gray-800'}`} onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`p-2 ml-4 bg-gray-600 text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed': 'hover:bg-gray-700 text-white focus:bg-gray-800'}`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnimalsList
