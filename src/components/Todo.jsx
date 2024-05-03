import React,{ useEffect, useState} from 'react'
import axios from 'axios';

const Todo = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [todos, setTodos]  = useState([])
  const [message, setMessage]  = useState(false)
  const [editmessage, setEditMessage] = useState(false)
  const [editId, setEditId] = useState(-1)
  const apiUrl = 'https://mern-todo-cicd-147256e7c7f6.herokuapp.com'

  //Edit
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault();
        if(title.trim() !== '' && description.trim() !== ''){
            try {
              // Make POST request to your API endpoint
              const response = await axios.post(apiUrl+'/todos', { title, description });
              console.log('Response from server:', response.data);
              
              // Optionally, display a success message to the user
              // alert('Item submitted successfully!');
              
              setMessage(true)

              setTimeout(() => {
                  setMessage(false)
              }, 3000);

              // Clear the form after successful submission
              setTitle('');
              setDescription('');
              setTodos([...todos, {title, description}])

            } catch (error) {
              console.error('Error submitting item:', error);
              alert('An error occurred while adding the item. Please try again later.');
            }
        }
  }
  useEffect(() => {
    getItems()
  }, [])
  

  const getItems = async() =>{
    try {
      const response = await axios.get(apiUrl+'/todos')
      setTodos(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  const handleEdit = (item) =>{
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  }

  const handleUpdate = async(e) =>{
    e.preventDefault();
        if(editTitle.trim() !== '' && editDescription.trim() !== ''){
            try {
              // Make POST request to your API endpoint
              const response = await axios.put(apiUrl+'/todos/'+editId, { title: editTitle, description: editDescription });
              console.log('Response from server:', response.data);
              
              // Optionally, display a success message to the user
              // alert('Item submitted successfully!');
              
              const updatedTodos = todos.map(item=>{
                if(item._id == editId){
                   item.title = editTitle;
                   item.description = editDescription;
                }
                return item;
              })
              
              setTodos(updatedTodos)
              setEditMessage(true)
              setTimeout(() => {
                  setEditMessage(false)
              }, 3000);
              setEditId(-1);
            } catch (error) {
              console.error('Error submitting item:', error);
              alert('An error occurred while adding the item. Please try again later.');
            }
        }
  }
  
  const handleEditCancel = () =>{
    setEditId(-1)
  }
    
  const handleDelete = async (id) =>{
    if(window.confirm('Are you sure you want to delete?')){
        await axios.delete(apiUrl+'/todos/'+id)
        const updatedTodos = todos.filter(item=> item._id !== id)
        setTodos(updatedTodos)
      }
}
  return (
    <>
    <div className='row p-3 bg-success text-light'>
        <h1>Todo project with MERN Stack</h1>
    </div>
    <div className='row'>
      <h3>Add Item</h3>
      {message && <p className='text-success'>Item added successfully</p>}
      {editmessage && <p className='text-success'>Item Updated successfully</p>}
        <div className='form-group d-flex gap-2'> 
            <input 
            placeholder='Title' 
            onChange={(e)=> setTitle(e.target.value)}
            value={title} 
            className='form-control' 
            type='text' 
            />
            <input
             placeholder='Description'
             onChange={(e)=> setDescription(e.target.value)}
             value={description} 
             className='form-control' 
             type='text' 
             /> 
            <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
        </div>
        <div className='row mt-3'>
          <h3>Tasks</h3>
          <ul className='list-group'>
           { todos.map(item => 
           <li key={item._id} className='list-group-item bg-info d-flex justify-content-between align-items-center my-2'>
              <div className='d-flex flex-column me-2'>
                {
                  editId == -1 || editId !== item._id ? 
                  <>
                    <span className='fw-bold'>{item.title}</span>
                    <span >{item.description}</span>
                  </> 
                  : 
                  <>
                  <div className='form-group d-flex gap-2'> 
                      <input 
                      placeholder='Title' 
                      onChange={(e)=> setEditTitle(e.target.value)}
                      value={editTitle} 
                      className='form-control' 
                      type='text' 
                      />
                      <input
                      placeholder='Description'
                      onChange={(e)=> setEditDescription(e.target.value)}
                      value={editDescription} 
                      className='form-control' 
                      type='text' 
                      /> 
                  </div>
                  </>
                }
              </div>
              <div className='d-flex gap-2'>
               { editId == -1  || editId !== item._id ? 
               <button 
                onClick={() => handleEdit(item)}
                className='btn btn-warning'>
                  Edit
                  </button>
                  : 
                  <button onClick={handleUpdate}>
                    Update
                  </button>
                  }
                { 
                editId == -1 || editId !== item._id 
                ? 
                <button 
                onClick={()=> handleDelete(item._id)}
                className='btn btn-danger'>
                  Delete
                  </button>
                  :
                  <button 
                  onClick={handleEditCancel}
                  className='btn btn-danger'>
                  Cancel
                  </button>
                  }
              </div>
            </li> )}
          </ul>
        </div>
    </div>
    </>
  )
}

export default Todo