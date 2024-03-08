import { useState, ChangeEvent, useEffect, KeyboardEvent } from 'react'
import AnimalApi from '../models/animals'
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";

const AnimalsList = () => {

  const [animalList, setAnimalList] = useState<{ value: string, id: number }[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredAnimalList, setFilteredAnimalList] = useState<{ value: string, id: number }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [userAddedList, setUserAddedList] = useState<{ value: string, id: number }[]>([]);

  const [animalListCurrentPage, setAnimalListCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const animalListTotalPages = Math.ceil(animalList.length / itemsPerPage);
  const animalListStartIndex = (animalListCurrentPage - 1) * itemsPerPage;
  const animalListEndIndex = animalListStartIndex + itemsPerPage;
  const animalListToRender = animalList.slice(animalListStartIndex, animalListEndIndex);

  const [userListCurrentPage, setUserListCurrentPage] = useState<number>(1);
  const userAddedTotalPages = Math.ceil(userAddedList.length / itemsPerPage);
  const startIndex = (userListCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const listToRender = userAddedList.slice(startIndex, endIndex);
  const filteredListToRender = filteredAnimalList.slice(startIndex, endIndex);
  const filteredTotalPages = Math.ceil(filteredAnimalList.length / itemsPerPage);
  const totalPages = filteredAnimalList.length ? filteredTotalPages : userAddedTotalPages;

  useEffect(() => {
    const newList: { value: string; id: number; }[] = [];
    AnimalApi.getAnimal().forEach((animal: string, index: number) => {
      newList.push({value: animal, id: index});
    })
    setAnimalList(newList);
  }, []);

  const addToUserList = (item: { value: string, id: number }) => {
    setUserAddedList([...userAddedList, item]);
  }

  const removeAnimal = (id: number) => {
    const newList = userAddedList.filter(list => list.id !== id);
    const minPage = Math.ceil(newList.length / itemsPerPage);
    if(userListCurrentPage > minPage) {
      setUserListCurrentPage(minPage);
    }
    setUserAddedList(newList);
    if(filteredAnimalList.length) {
      const newFilterdList = filteredAnimalList.filter(list => list.id !== id);
      setFilteredAnimalList(newFilterdList);
      if(!newFilterdList.length) {
        setInputValue("");
      }
    }
  }

  const filterAnimal = () => {
    const newList = userAddedList.filter(list => list.value.toLowerCase().includes(inputValue.toLowerCase()));
    if(newList.length) {
      setUserListCurrentPage(1);
    } else {
      setErrorMsg(`${inputValue} Not Found`);
    }
    setFilteredAnimalList(newList);
  }

  return (
      <div className='flex gap-3'>
        <div className=' bg-gray-200 border rounded mt-10 mx-auto flex flex-col justify-center min-h-[555px]'>
          <div className='grow flex items-center justify-center border-b border-b-black'>
            <h2 className='text-3xl'>Animal Dictionary</h2>
          </div>
          <div className='mt-2'>
          {
            animalListToRender.map((item) => {
              const isExistInUserAddedList = userAddedList.some(list => list.id === item.id);
              return (
                <div className={`py-2 justify-between flex border-b border-b-black px-6`} key={item.id}>
                  <div className='capitalize'>{item.value}</div>
                  <span className={`${isExistInUserAddedList && 'cursor-not-allowed'}`}>
                    <FaPlusCircle size="1.5rem" className={`mx-2 ${isExistInUserAddedList ? 'opacity-50 pointer-events-none': 'cursor-pointer'}`} onClick={() => addToUserList(item)} />
                  </span>
                </div>
              )
            })
          }
          </div>
          <div className='border-t border-t-black text-right py-2  px-6'>
            <span className='text-gray-700'>{`Page ${animalListCurrentPage} of ${animalListTotalPages}`}</span>
            <button
              className={`p-2 ml-4 bg-gray-600 text-white ${animalListCurrentPage === 1 ? 'opacity-50 cursor-not-allowed': 'hover:bg-gray-700 text-white focus:bg-gray-800'}`} onClick={() => setAnimalListCurrentPage(animalListCurrentPage - 1)}
              disabled={animalListCurrentPage === 1}
            >
              Previous
            </button>
            <button
              className={`p-2 ml-4 bg-gray-600 text-white ${animalListCurrentPage === animalListTotalPages ? 'opacity-50 cursor-not-allowed': 'hover:bg-gray-700 text-white focus:bg-gray-800'}`}
              onClick={() => setAnimalListCurrentPage(animalListCurrentPage + 1)}
              disabled={animalListCurrentPage === animalListTotalPages}
            >
              Next
            </button>
          </div>
        </div>
        <div className=' bg-gray-200 border rounded mt-10 mx-auto min-h-[555px] relative flex flex-col'>
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
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && filterAnimal()}
                placeholder='Enter animal name to filter'
              />
              <div className='flex'>
                {filteredAnimalList.length ?
                  <FaFilterCircleXmark size="1.5rem" className={`cursor-pointer mx-2`} onClick={() => {
                    setFilteredAnimalList([]);
                    setInputValue("");
                  }} />
                  :
                  <span className={`${inputValue && (filteredAnimalList.length || listToRender.length) ? "" : 'cursor-not-allowed'}`}>
                    <FaFilter size="1.5rem" className={`mx-2 ${inputValue && (filteredAnimalList.length || listToRender.length) ? "cursor-pointer" : 'pointer-events-none opacity-50'}`} onClick={() => filterAnimal()} />
                  </span> 
                }
              </div>
            </div>
            {errorMsg && <p className='text-red-500 text-left mt-1'>{errorMsg}</p> }
          </div>
          {filteredAnimalList.length ||listToRender.length ? (
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
          ) : (
            <div className='flex grow items-center justify-center'>
              <p className='text-gray-400'>Add Animal from Dictionary</p>
            </div>
          ) }
          {
            Boolean(filteredAnimalList.length) || Boolean(listToRender.length) && (
              <div className='border-t border-t-black text-right py-2 px-6 absolute bottom-0 w-full'>
                <span className='text-gray-700'>{`Page ${userListCurrentPage} of ${totalPages}`}</span>
                <button
                  className={`p-2 ml-4 bg-gray-600 text-white ${userListCurrentPage === 1 ? 'opacity-50 cursor-not-allowed': 'hover:bg-gray-700 text-white focus:bg-gray-800'}`} onClick={() => setUserListCurrentPage(userListCurrentPage - 1)}
                  disabled={userListCurrentPage === 1}
                >
                  Previous
                </button>
                <button
                  className={`p-2 ml-4 bg-gray-600 text-white ${userListCurrentPage === totalPages ? 'opacity-50 cursor-not-allowed': 'hover:bg-gray-700 text-white focus:bg-gray-800'}`}
                  onClick={() => setUserListCurrentPage(userListCurrentPage + 1)}
                  disabled={userListCurrentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )
          }
        </div>
      </div>
  )
}

export default AnimalsList
