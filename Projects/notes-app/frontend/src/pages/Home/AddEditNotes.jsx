import React, { useState } from 'react'
import TagsInput from '../../components/Input/TagsInput/TagsInput'
import { MdClose } from 'react-icons/md';
import axiosInstace from '../../utils/axiosInstance';

const AddEditNotes = ({onClose,noteData,type,getAllNotes,showToastMessage}) => {

  const[title,setTitle] = useState(noteData?.title || '');
  const[content,setContent] = useState(noteData?.content || '');
  const[tags,setTags] =  useState(noteData?.tags || []);

  const[error,setError] = useState(null)

  // Add New Note
  const addNewNote = async () =>{
    try{
      const response = await axiosInstace.post("/add",{
        title,content,tags
      })
      if(response.data && response.data.note){
        showToastMessage(response.data.message,'add')
        getAllNotes();
        onClose();
      }
    }catch(err){
      if(err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
      }
    }
  }; 

  // Edit Note
  const editNote = async (id) =>{
    try{
      const response = await axiosInstace.put(`/edit/${id}`,{
        title,content,tags
      })
      if(response.data && response.data.note){
        showToastMessage(response.data.message,'edit')
        getAllNotes();
        onClose();
      }
    }catch(err){
      if(err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
      }
    }
  }

  const handleAddNote = () =>{
    if(!title){
      setError('Please enter the title');
      return
    }
    if(!content){
      setError("Please enter the content");
      return;
    }
    setError('');
    if(type === 'edit'){
      editNote(noteData._id);
    }else{
      addNewNote();
    }
  }

  return (
    <div className='relative' >
      <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500' onClick={onClose}>
        <MdClose className='text-xl text-slate-400' />
      </button>
      <div className="flex flex-col gap-2">
        <label className='input-label' htmlFor="">TITLE</label>
        <input type="text"
        className='text-2xl text-slate-950 outline-none'
        placeholder='Go To Gtm At 5'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="" className="input-label">CONTENT</label>
        <textarea typeof='text' className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded' placeholder='Content' rows={10} value={content} onChange={(e) => setContent(e.target.value)} ></textarea>
      </div>
      <div className="mt-3">
        <label htmlFor="" className="input-labels">TAGS</label>
        <TagsInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className='text-red-500 text-xs pt-4'>{error} </p> }
      <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}> {type === 'edit' ? 'UPDATE' : 'ADD'} </button>
    </div>
  )
}

export default AddEditNotes
