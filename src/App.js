import { useState, useEffect } from 'react'
import './index.css'
import personService from './services/persons'


const Filter =({searchString, handleSearchString, handleClearSearchBox}) => {
  return (
    <form onSubmit={handleClearSearchBox} >
    <div>
        search
        <input text='search' value={searchString} onChange={handleSearchString}/>
        <button type='submit' >clear</button>
    </div>
    <br></br>
    </form>
    
  )}

const Person = ({ person, deletePerson }) => {
  return (
    <>
    <li>{person.name} : {person.number}</li>
    <button  onClick = {() => deletePerson(person)}>Delete</button>
    </>
  )}

const Form = ({addPerson, newName, handleNewName, newNumber, handleNewNumber}) => {
    return (
      <form onSubmit={addPerson} >
        <div>
        name
          <input text='name' value={newName}
              onChange={handleNewName}/>
        </div>
        <div>
        number
          <input text='number' value={newNumber}
              onChange={handleNewNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )}

const Numbers =  ({searchMatches, deletePerson}) => {
  return(
    <ul>
      {searchMatches.map((person, i)  =>
            <Person key={i} person={person} deletePerson={deletePerson}  />
          )}
    </ul>
  )
}
const Notifcation = ({message}) => {
  const notificationStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
  
  if (message === null){
    return null
  }
  return (
    <div className='error' style={notificationStyle}>
        {message}
    </div>
  )
}



  
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchString, setSearchString] = useState ('')
  const [errorMessage, setErrorMessage] = useState (null)
  //  .filter syntax:
  //  const result = words.filter(word => word.length < 8);

  useEffect(() => {
    personService
    .getAll() // dont forget the brackets as we are calling the function
    .then(initialPersons => {
      setPersons(initialPersons)
      })
    
  }, [])
  
  const clearBox = () => {
    setNewName("")
    setNewNumber("")
  }

  const handleClearSearchBox = (event) =>
      setSearchString('')
    
  const searchMatches = persons.filter(isMatched)
  const extractName = persons.map(person => person.name.trim().toLowerCase())
  const objectToUpdate = persons.find(person => person.name.trim().toLowerCase()===newName)

  function isMatched(person)  {
    return person.name.toLowerCase().includes(searchString.toLowerCase())
  }
   
  const handleSearchString =(event) => {
    setSearchString(event.target.value)
  }
 
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewName = (event) =>{
    setNewName(event.target.value)
    }
  
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name : newName.trim(),
      number : newNumber
      }
    //console.log(personObject)
    if (newName=== "" || newNumber === ''){
      alert(`You Haven't entered a Name and Number`)
    clearBox()
      //setNewName("")
    //setNewNumber("")
    return false
    }
    // check if name already exists:
    if (extractName.includes(newName.trim().toLowerCase())) {
      //alert(`${newName.trim()} is already added to phonebook`)
      if(window.confirm(`${newName.trim()} is already added to the phonebook, replace the old number with a new one?`)){
        //const personForUpdate = persons.find(n => n.name.trim().toLowerCase() ===newName.trim().toLowerCase )  
        const newPerson =  objectToUpdate
        personService
          .update(objectToUpdate.id, personObject)
          .then(returnedPersonObject => {
            //console.log(returnedPersonObject.name,returnedPersonObject.number)
            setPersons(persons.map(person => person.id !== newPerson.id ? person : returnedPersonObject))
          })
          .then(setErrorMessage(
            ` '${newPerson.name}' has been added to phonebook`
            ))
          .then(clearBox())
          //.then(setNewName(""))
          //.then(setNewNumber(""))
          
          .then (setTimeout(() => {
            setErrorMessage(null)
          }, 5000))
          .catch(error => {
            setErrorMessage(
              ` '${newPerson.name}' was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            personService
            .getAll() // dont forget the brackets as we are calling the function
            .then(initialPersons => {
              setPersons(initialPersons)
              console.log(persons)
            })
      clearBox()
      //setNewName("")
      //setNewNumber("")
      return false
      })
      }
    }
    else{
      personService
        .create(personObject)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
          
          console.log(persons)
      })
      .then(setErrorMessage(
        ` '${personObject.name}' has been added to phonebook`
          ))
      .then(setTimeout(() => {
          setErrorMessage(null)
        }, 5000))
      clearBox()  
    //setNewName("")
    //setNewNumber("")
    return true
      } 
    }
  
  const deletePerson = (person) => {
    if (window.confirm(`Do you really want to delete ${person.name}`)) {
      personService
      ._delete(person.id)
      
      .then(response => {
        const updatedPersons = persons.filter((entry) => entry.id !== person.id);
        setPersons(updatedPersons);
      })

        .then(setErrorMessage(
          ` '${person.name}' has been deleted from phonebook`
        )
        )
        .then(setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        )

        .catch(error => {
          setErrorMessage(
            ` '${person.name}' was already removed from server`
          )
          console.log('delete error caught')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          const updatedPersons = persons.filter((entry) => entry.id !== person.id);
          setPersons(updatedPersons);
          
        })
            
        
        
        
    }}
  


  return(
    <div>
      <h2>Phonebook</h2>
      <Notifcation message={errorMessage} />
      <Filter searchString = {searchString} handleSearchString = {handleSearchString} handleClearSearchBox={handleClearSearchBox} />
      <Form newName={newName} addPerson={addPerson} handleNewName={handleNewName} 
          newNumber={newNumber} handleNewNumber={handleNewNumber} />
      
      <h2>Numbers</h2>
      <Numbers deletePerson={deletePerson} searchMatches = {searchMatches} />
      
    </div>
  )

  }
export default App